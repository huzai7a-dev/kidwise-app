import React, { useEffect, useState, useRef, useMemo } from 'react';
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
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';

registerGlobals();

const HEYGEN_API_URL = 'https://api.heygen.com/v1';
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:4000';

const SILENCE_THRESHOLD = -30; // dB threshold (adjust based on testing)
const SILENCE_DURATION = 1500; // ms of silence before auto-stop

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
  const [recordTime, setRecordTime] = useState('00:00');
  const [recordLoading, setRecordLoading] = useState(false);

  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoRestartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRecorderPlayer = AudioRecorderPlayer;

  // ✅ Start Audio Session
  useEffect(() => {
    AudioSession.startAudioSession().catch(err => console.error(err));
    return () => {
      AudioSession.stopAudioSession().catch(err => console.error(err));
      // Cleanup timers
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (autoRestartTimeoutRef.current) clearTimeout(autoRestartTimeoutRef.current);
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

      // Estimate speaking duration based on text length (rough heuristic)
      // Average: ~150 words per minute => ~2.5 words/sec => ~400ms per word
      const wordCount = payloadText.trim().split(/\s+/).length;
      const estimatedDuration = Math.max(wordCount * 400, 2000); // min 2 seconds

      // Auto-restart recording after avatar finishes speaking
      autoRestartTimeoutRef.current = setTimeout(() => {
        setSpeaking(false);
        // Auto-start recording again
        startRecording();
      }, estimatedDuration);
    } catch (err) {
      console.error('Error sending heygen text:', err);
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

  // Start recording with VAD
  const startRecording = async () => {
    try {
      // Wait for activity to be ready
      await new Promise(resolve =>
        InteractionManager.runAfterInteractions(() => resolve(undefined)),
      );

      const ok = await requestAndroidPermission();
      if (!ok) return;

      setRecordLoading(true);

      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 1,
        OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
      };

      const uri = await audioRecorderPlayer.startRecorder(
        undefined,
        audioSet,
        true, // meteringEnabled
      );

      console.log('Recorder started, uri:', uri);

      // Set recording state BEFORE adding listener to prevent race condition
      setRecording(true);

      // Add metering listener for VAD
      audioRecorderPlayer.addRecordBackListener((e: any) => {
        const currentTime = audioRecorderPlayer.mmss(
          Math.floor(e.currentPosition / 1000),
        );
        setRecordTime(currentTime);

        // Silence detection
        const currentMetering = e.currentMetering || 0;

        if (currentMetering < SILENCE_THRESHOLD) {
          // User is silent
          if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => {
              console.log('Silence detected, auto-stopping...');
              stopRecording();
            }, SILENCE_DURATION);
          }
        } else {
          // User is speaking, reset silence timer
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        }
      });
    } catch (err) {
      console.error('Failed to start recorder', err);
      // Reset state on error
      setRecording(false);
    } finally {
      setRecordLoading(false);
    }
  };

  // Stop recording and send to backend
  const stopRecording = async () => {
    // Guard: Don't try to stop if not recording
    if (!recording) {
      console.log('stopRecording called but not recording, skipping...');
      return;
    }

    try {
      setRecordLoading(true);

      // Clear silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      const filePath = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecording(false);
      setRecordTime('00:00');
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
        uri: Platform.OS === 'android' ? `file://${filePath}` : filePath,
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
      // Reset state even on error
      setRecording(false);
      audioRecorderPlayer.removeRecordBackListener();
    } finally {
      setRecordLoading(false);
    }
  };

  const closeSession = async () => {
    try {
      setLoading(true);

      // Cleanup ongoing recording
      if (recording) {
        await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setRecording(false);
      }

      // Clear timers
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (autoRestartTimeoutRef.current) clearTimeout(autoRestartTimeoutRef.current);

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
            <Text style={styles.recordTimeText}>{recordTime}</Text>
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
                      ? '🎤 Listening...'
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
  recordTimeText: {
    marginBottom: 6,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
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
