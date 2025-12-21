import { useState, useRef, useEffect } from 'react';
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import { Platform, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';

const useRecording = () => {
    const [isRecording, setIsRecording] = useState(false);
    const recordingPath = useRef<string | null>(null);
    const audioRecorderPlayerRef = useRef<typeof AudioRecorderPlayer | null>(null);

    // Initialize AudioRecorderPlayer
    useEffect(() => {
        audioRecorderPlayerRef.current = new AudioRecorderPlayer();

        return () => {
            // Cleanup on unmount
            if (audioRecorderPlayerRef.current) {
                audioRecorderPlayerRef.current.removeRecordBackListener();
            }
        };
    }, []);

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const grants = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                ]);

                if (
                    grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log('Permissions granted');
                    return true;
                } else {
                    console.log('Permissions denied');
                    return false;
                }
            } catch (err) {
                console.warn('Permission error:', err);
                return false;
            }
        }
        return true; // iOS permissions are handled in Info.plist
    };

    const startRecording = async () => {
        try {
            if (!audioRecorderPlayerRef.current) {
                console.error('AudioRecorderPlayer not initialized');
                return { started: false };
            }

            const hasPermissions = await requestPermissions();
            if (!hasPermissions) {
                console.error('Recording permissions not granted');
                return { started: false };
            }

            // Create a unique file path
            const timestamp = Date.now();
            const path = Platform.select({
                ios: `recording_${timestamp}.m4a`,
                android: `${RNFS.CachesDirectoryPath}/recording_${timestamp}.m4a`,
            });

            console.log('Recording path:', path);

            // Configure audio settings for better quality
            const audioSet: any = {
                AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
                AudioSourceAndroid: AudioSourceAndroidType.MIC,
                AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
                AVNumberOfChannelsKeyIOS: 1,
                AVFormatIDKeyIOS: AVEncodingOption.aac,
                AVSampleRateKeyIOS: 44100,
            };

            const uri = await audioRecorderPlayerRef.current.startRecorder(path, audioSet);
            recordingPath.current = uri;

            audioRecorderPlayerRef.current.addRecordBackListener((e) => {
                // console.log('Recording:', e.currentPosition);
                return;
            });

            setIsRecording(true);
            console.log('Recording started at:', uri);
            return { started: true, path: uri };
        } catch (error) {
            console.error('Failed to start recording:', error);
            return { started: false };
        }
    };

    const stopRecording = async () => {
        try {
            if (!audioRecorderPlayerRef.current) {
                console.error('AudioRecorderPlayer not initialized');
                return null;
            }

            const result = await audioRecorderPlayerRef.current.stopRecorder();
            audioRecorderPlayerRef.current.removeRecordBackListener();
            setIsRecording(false);

            console.log('Recording stopped, result:', result);

            // Verify the file exists and has content
            if (result) {
                const fileExists = await RNFS.exists(result);
                console.log('File exists after recording:', fileExists);

                if (fileExists) {
                    const stats = await RNFS.stat(result);
                    console.log('Recorded file size:', stats.size, 'bytes');

                    if (stats.size === 0) {
                        console.error('Recorded file is empty!');
                        return null;
                    }
                } else {
                    console.error('Recorded file does not exist!');
                    return null;
                }
            }

            return result;
        } catch (error) {
            console.error('Failed to stop recording:', error);
            return null;
        }
    };

    return {
        isRecording,
        startRecording,
        stopRecording,
    };
};

export default useRecording;