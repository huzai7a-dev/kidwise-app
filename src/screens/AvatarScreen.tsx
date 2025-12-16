import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  InteractionManager,
} from 'react-native';
import {
  registerGlobals,
  LiveKitRoom,
  VideoTrack,
  useTracks,
  isTrackReference,
  AudioSession,
} from '@livekit/react-native';
import { Track } from 'livekit-client';

import Sound from 'react-native-nitro-sound';

registerGlobals();

const HEYGEN_API_URL = 'https://api.heygen.com/v1';
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:4000';

export default function AvatarScreen() {
  const [wsUrl, setWsUrl] = useState('');
  const [token, setToken] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [heygenSessionId, setHeygenSessionId] = useState('');
  const [conversationSessionId, setConversationSessionId] = useState('');
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [recordLoading, setRecordLoading] = useState(false);

  // ✅ Start Audio Session
  useEffect(() => {
    AudioSession.startAudioSession().catch(err => console.error(err));
    return () => {
      AudioSession.stopAudioSession().catch(err => console.error(err));
    };
  }, []);

  const createSession = async () => {
    try {
      setLoading(true);

      // Get token from your backend
      const tokenResp = await fetch(`${BACKEND_API_URL}/api/start-avatar`, {
        method: 'POST',
      });
      const tokenData = await tokenResp.json();
      const newToken = tokenData.token;
      setSessionToken(newToken);
      // backend conversation session id (used for STT/GPT processing)
      if (tokenData.sessionId) {
        setConversationSessionId(tokenData.sessionId);
      }

      // Create HeyGen session
      const response = await fetch(`${HEYGEN_API_URL}/streaming.new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`,
        },
        body: JSON.stringify({
          quality: 'high',
          version: 'v2',
          video_encoding: 'H264',
        }),
      });
      const data = await response.json();

      console.log({ data });

      setHeygenSessionId(data.data.session_id);
      setWsUrl(data.data.url);
      setToken(data.data.access_token);

      // Start streaming session
      await fetch(`${HEYGEN_API_URL}/streaming.start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`,
        },
        body: JSON.stringify({ session_id: data.data.session_id }),
      });

      setConnected(true);
    } catch (err) {
      console.error('Error creating session:', err);
    } finally {
      setLoading(false);
    }
  };

  // send arbitrary text to HeyGen to speak (used after backend returns an AI reply)
  const sendHeygenText = async (payloadText: string) => {
    console.log('Sending text to HeyGen:', payloadText);
    if (!payloadText?.trim()) return;
    try {
      setSpeaking(true);
      const res = await fetch(`${HEYGEN_API_URL}/streaming.task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          session_id: heygenSessionId,
          text: payloadText,
          task_type: 'repeat',
        }),
      });

      console.log('HeyGen task response:', await res.json());
    } catch (err) {
      console.error('Error sending heygen text:', err);
    } finally {
      setSpeaking(false);
    }
  };

  // Request Android permission (runtime) for recording
  const requestAndroidPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Audio Recording Permission',
          message: 'This app needs access to your microphone to record audio.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Start NitroSound recording
  const startRecording = async () => {
    try {
      // Wait for activity to be ready
      await new Promise(resolve =>
        InteractionManager.runAfterInteractions(resolve),
      );

      const ok = await requestAndroidPermission();
      if (!ok) return;

      setRecordLoading(true);
      // add listener for progress
      Sound.addRecordBackListener((e: any) => {
        setRecordTime(Sound.mmssss(Math.floor(e.currentPosition)));
      });
      const uri = await Sound.startRecorder();
      // uri is the file path where recording will be stored
      console.log('Recorder started, uri:', uri);
      setRecording(true);
    } catch (err) {
      console.error('Failed to start recorder', err);
    } finally {
      setRecordLoading(false);
    }
  };

  // Stop recording and send to backend
  const stopRecording = async () => {
    try {
      setRecordLoading(true);
      const filePath = await Sound.stopRecorder();
      Sound.removeRecordBackListener();
      setRecording(false);
      setRecordTime('00:00:00');
      console.log('Recording stopped, file:', filePath);

      // upload file to backend for STT + GPT
      const form = new FormData();
      // RN fetch expects file object with uri/name/type
      const filename = filePath.split('/').pop() || 'recording.m4a';
      const fileType =
        filename.endsWith('.m4a') || filename.endsWith('.mp4')
          ? 'audio/mp4'
          : 'audio/m4a';
      // @ts-ignore - FormData in RN accepts this shape
      form.append('audioFile', {
        uri: filePath,
        name: filename,
        type: fileType,
      });
      // include conversation session id so backend can maintain context
      form.append('sessionId', conversationSessionId || '');

      console.log({ form });
      const resp = await fetch(`${BACKEND_API_URL}/api/process-conversation`, {
        method: 'POST',
        headers: {
          // DO NOT set Content-Type here - let fetch set the multipart boundary
        },
        body: form as any,
      });

      const result = await resp.json();
      console.log({ result });
      // backend returns { userText, aiResponse }
      if (result?.aiResponse) {
        // send AI response text to HeyGen to make avatar speak
        await sendHeygenText(result.aiResponse);
      }
    } catch (err) {
      console.error('Failed to stop/upload recording', err);
    } finally {
      setRecordLoading(false);
    }
  };

  const closeSession = async () => {
    try {
      setLoading(true);
      await fetch(`${HEYGEN_API_URL}/streaming.stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ session_id: heygenSessionId }),
      });

      setConnected(false);
      setHeygenSessionId('');
      setSessionToken('');
      setWsUrl('');
      setToken('');
      setSpeaking(false);
    } catch (err) {
      console.error('Error closing session:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <SafeAreaView style={styles.startContainer}>
        <Text style={styles.title}>HeyGen Live Avatar</Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={createSession}
          disabled={loading}
        >
          <Text style={styles.startButtonText}>
            {loading ? 'Starting...' : 'Start Session'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={wsUrl}
      token={token}
      connect
      audio={false}
      video={false}
    >
      <RoomView
        onClose={closeSession}
        speaking={speaking}
        loading={loading}
        // recording props
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        recording={recording}
        recordTime={recordTime}
        recordLoading={recordLoading}
      />
    </LiveKitRoom>
  );
}

const RoomView = ({
  onClose,
  speaking,
  loading,
  onStartRecording,
  onStopRecording,
  recording,
  recordTime,
  recordLoading,
}: {
  onClose: () => void;
  speaking: boolean;
  loading: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  recording: boolean;
  recordTime: string;
  recordLoading: boolean;
}) => {
  const tracks = useTracks([Track.Source.Camera], { onlySubscribed: true });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.videoContainer}>
          {tracks.map((track, idx) =>
            isTrackReference(track) ? (
              <VideoTrack
                key={idx}
                style={styles.videoView}
                trackRef={track}
                objectFit="contain"
              />
            ) : null,
          )}
        </View>

        <TouchableOpacity
          style={[styles.closeButton, loading && styles.disabledButton]}
          onPress={onClose}
          disabled={loading}
        >
          <Text style={styles.closeButtonText}>
            {loading ? 'Closing...' : 'Close Session'}
          </Text>
        </TouchableOpacity>

        <View style={styles.controls}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ marginBottom: 6 }}>{recordTime}</Text>
            <TouchableOpacity
              style={[
                styles.recordButton,
                (recording || recordLoading || loading || speaking) &&
                  styles.disabledButton,
              ]}
              onPress={recording ? onStopRecording : onStartRecording}
              disabled={recordLoading || loading || speaking}
            >
              <Text style={styles.recordButtonText}>
                {recordLoading
                  ? 'Processing...'
                  : speaking
                  ? 'Speaking...'
                  : recording
                  ? 'Stop Recording'
                  : 'Start Recording'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a73e8',
    marginBottom: 20,
    textAlign: 'center',
  },
  startButton: { backgroundColor: '#2196F3', padding: 16, borderRadius: 30 },
  startButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  videoContainer: { flex: 1 },
  videoView: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 25,
  },
  closeButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  controls: { flexDirection: 'row', padding: 20, gap: 10 },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  recordButton: {
    backgroundColor: '#9121f3ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 150,
  },
  recordButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  disabledButton: { opacity: 0.5 },
});
