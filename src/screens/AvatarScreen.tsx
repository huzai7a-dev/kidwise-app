import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import LottieView from 'lottie-react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

import avatar_idle from '@assets/avatar_idle.json';
import avatar_talking from '@assets/avatar_talking.json';
import avatar_thinking from '@assets/loading.json';
import useRecording from '@src/hooks/useRecording';
import { theme } from '@src/constants/colors';
import {
  uploadAudio,
  startAvatarSession,
} from '@src/services/uploadAudio.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const AvatarScreen = () => {
  const { startRecording, stopRecording } = useRecording();
  const [appState, setAppState] = useState('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [aiText, setAiText] = useState('');
  const glowAnim = useRef(new Animated.Value(1)).current;
  const audioPlayer = useRef(new AudioRecorderPlayer()).current;

  // Cleanup audio player on unmount
  useEffect(() => {
    return () => {
      audioPlayer.stopPlayer();
      audioPlayer.removePlayBackListener();
    };
  }, []);

  // Initialize session on mount
  useEffect(() => {
    console.log('Initializing session');
    const initSession = async () => {
      try {
        let child_id = await AsyncStorage.getItem('child_id');
        if (child_id) {
          const data = await startAvatarSession(child_id);
          console.log('Session created:', data.sessionId);
          setSessionId(data.sessionId);
        }
      } catch (error) {
        console.error('Failed to start session', error);
        Alert.alert(
          'Error',
          'Failed to initialize session. Please restart the app.',
        );
      }
    };
    initSession();
  }, []);

  // Animation for listening state
  useEffect(() => {
    if (appState === 'listening') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      glowAnim.stopAnimation();
      glowAnim.setValue(1);
    }
  }, [appState]);

  // Play audio from base64
  const playAudioFromBase64 = async (base64Audio: string) => {
    try {
      // Convert base64 to file
      const audioPath = `${
        RNFS.CachesDirectoryPath
      }/response_${Date.now()}.mp3`;
      await RNFS.writeFile(audioPath, base64Audio, 'base64');

      console.log('🔊 Playing audio from:', audioPath);

      // Play the audio
      await audioPlayer.startPlayer(audioPath);

      audioPlayer.addPlayBackListener(e => {
        // Check if playback is complete
        if (e.currentPosition >= e.duration && e.duration > 0) {
          console.log('✅ Audio playback finished');
          audioPlayer.stopPlayer();
          audioPlayer.removePlayBackListener();
          setAppState('idle');
          setAiText(''); // Clear text after speaking

          // Clean up the temp file
          RNFS.unlink(audioPath).catch(err =>
            console.log('Failed to delete temp audio:', err),
          );
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      setAppState('idle');
      Alert.alert('Error', 'Failed to play audio response');
    }
  };

  const handlePress = async () => {
    if (appState === 'idle' || appState === 'speaking') {
      // Stop any ongoing audio
      await audioPlayer.stopPlayer();
      setAiText('');

      if (!sessionId) {
        Alert.alert('Error', 'Session not initialized. Please wait.');
        return;
      }

      const { started } = await startRecording();
      if (started) {
        setAppState('listening');
      } else {
        Alert.alert(
          'Recording Failed',
          'Failed to start recording. Please check microphone permissions.',
        );
      }
    } else if (appState === 'listening') {
      setAppState('thinking');
      const path = await stopRecording();

      if (path && sessionId) {
        try {
          console.log('📤 Sending audio to backend...');
          const result = await uploadAudio(path, sessionId);

          console.log('📥 Received response:', {
            userText: result.userText,
            aiResponse: result.aiResponse,
            hasAudio: !!result.audioBase64,
            processingTime: result.processingTime,
          });

          setAiText(result.aiResponse);
          setAppState('speaking');

          // Play the audio response if available
          if (result.audioBase64) {
            await playAudioFromBase64(result.audioBase64);
          } else {
            // Fallback: just show text for a few seconds
            console.warn('⚠️ No audio received, using text-only fallback');
            setTimeout(() => {
              setAppState('idle');
              setAiText('');
            }, 5000);
          }
        } catch (error: any) {
          console.error('Process error:', error);
          setAppState('idle');

          const errorMessage =
            error.response?.data?.error || 'Failed to process audio';
          Alert.alert('Error', errorMessage);
        }
      } else {
        setAppState('idle');
        Alert.alert('Error', 'Recording failed. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Avatar Display */}
      <View style={styles.avatarContainer}>
        <Animated.View style={{ transform: [{ scale: glowAnim }] }}>
          <LottieView
            source={
              appState === 'speaking' || appState === 'thinking'
                ? avatar_talking
                : avatar_idle
            }
            autoPlay
            loop
            style={styles.avatarLottie}
            resizeMode="contain"
          />
        </Animated.View>

        {/* AI Text Display (Subtitles) */}
        {aiText && appState === 'speaking' && (
          <View style={styles.textContainer}>
            <Text style={styles.aiText}>{aiText}</Text>
          </View>
        )}

        {/* Thinking Overlay (Stars/Loader) */}
        {appState === 'thinking' && (
          <LottieView
            source={avatar_thinking}
            autoPlay
            loop
            style={styles.loader}
          />
        )}
      </View>

      {/* Interaction Button */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.touchArea}
        disabled={appState === 'thinking'}
      >
        <View
          style={[
            styles.micIndicator,
            {
              backgroundColor:
                appState === 'listening'
                  ? '#FF4B4B'
                  : appState === 'thinking'
                  ? '#FFA726'
                  : appState === 'speaking'
                  ? '#2196F3'
                  : '#4CAF50',
            },
          ]}
        >
          <Text style={styles.micText}>
            {appState === 'idle' && '👋 Tap to Talk'}
            {appState === 'listening' && '🎤 Listening...'}
            {appState === 'thinking' && '🤔 Thinking...'}
            {appState === 'speaking' && '🗣️ Speaking...'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary,
  },
  warningBanner: {
    backgroundColor: '#FF9800',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  warningText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  avatarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLottie: {
    width: width * 1.2,
    height: height * 0.6,
  },
  textContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  aiText: {
    color: '#333',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
  touchArea: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    width: width * 0.8,
    alignItems: 'center',
  },
  micIndicator: {
    paddingVertical: 18,
    paddingHorizontal: 35,
    borderRadius: 40,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  micText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loader: {
    width: 250,
    height: 250,
    position: 'absolute',
    top: '20%',
  },
});

export default AvatarScreen;
