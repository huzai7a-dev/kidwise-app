import config from '@src/config';
import axios, { AxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';
import * as RNFS from 'react-native-fs';

const BACKEND_URL = config.baseUrl;
export const startAvatarSession = async (childId: string) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/start-avatar`, {
      childId,
    });
    return response.data;
  } catch (error) {
    console.error('Error starting avatar session:', error);
    throw error;
  }
};

export const uploadAudio = async (audioFilePath: string, sessionId: string) => {
  try {
    const uploadStart = Date.now();
    const fileExists = await RNFS.exists(audioFilePath);
    if (!fileExists) {
      throw new Error('Audio file does not exist at path: ' + audioFilePath);
    }
    const fileStats = await RNFS.stat(audioFilePath);
    if (fileStats.size === 0) {
      throw new Error('Audio file is empty');
    }

    const formData = new FormData();
    const fileName = `recording_${Date.now()}.m4a`;
    formData.append('audioFile', {
      uri:
        Platform.OS === 'android' ? `file://${audioFilePath}` : audioFilePath,
      type: 'audio/m4a',
      name: fileName,
    } as any);

    formData.append('sessionId', sessionId);

    const config: AxiosRequestConfig = {
      method: 'post',
      url: `${BACKEND_URL}/api/process-conversation-stream`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    };

    const response = await axios.request(config);
    return response.data;
  } catch (err: any) {
    console.error('Upload error details:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
    });
    throw err;
  }
};
