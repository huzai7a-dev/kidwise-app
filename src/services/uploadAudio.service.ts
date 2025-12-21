import axios, { AxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

// const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';
const BACKEND_URL = "https://26ef11ee0ebf.ngrok-free.app";
export const startAvatarSession = async () => {
    try {
        const response = await axios.post(`${BACKEND_URL}/api/start-avatar`);
        return response.data;
    } catch (error) {
        console.error('Error starting avatar session:', error);
        throw error;
    }
};

export const uploadAudio = async (audioFilePath: string, sessionId: string) => {
    try {
        console.log('📤 Uploading audio file...');
        const uploadStart = Date.now();

        // Check if file exists
        const fileExists = await RNFS.exists(audioFilePath);
        if (!fileExists) {
            throw new Error('Audio file does not exist at path: ' + audioFilePath);
        }

        // Get file stats
        const fileStats = await RNFS.stat(audioFilePath);
        console.log('📊 File size:', fileStats.size, 'bytes');

        if (fileStats.size === 0) {
            throw new Error('Audio file is empty');
        }

        const formData = new FormData();
        const fileName = `recording_${Date.now()}.m4a`;

        formData.append('audioFile', {
            uri: Platform.OS === 'android'
                ? `file://${audioFilePath}`
                : audioFilePath,
            type: 'audio/m4a',
            name: fileName,
        } as any);

        formData.append('sessionId', sessionId);

        const config: AxiosRequestConfig = {
            method: 'post',
            url: `${BACKEND_URL}/api/process-conversation-stream`, // Use streaming endpoint
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 30000, // 30 second timeout
        };

        const response = await axios.request(config);

        console.log(`✅ Upload completed in ${Date.now() - uploadStart}ms`);
        console.log('📊 Processing time:', response.data.processingTime, 'ms');

        return response.data;
    } catch (err: any) {
        console.error('Upload error details:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status
        });
        throw err;
    }
};