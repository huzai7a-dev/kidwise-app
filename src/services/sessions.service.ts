import axios from 'axios';
import config from '@src/config';

const BACKEND_URL = config.baseUrl;

export const getSessionsByChild = async (childId: string) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/child/${childId}/sessions`);
    return res.data;
  } catch (error) {
    console.log('Error fetching sessions:', error);
    throw error;
  }
};

export const getSessionDetails = async (sessionId: string) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/sessions/${sessionId}`);
    return res.data;
  } catch (error) {
    console.log('Error fetching session details:', error);
    throw error;
  }
};

export const askAI = async (
  parentId: string,
  childId: string,
  query: string,
) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/parent/ask`, {
      parentId,
      childId,
      query,
    });
    return response.data.answer;
  } catch (error) {
    console.error('Error in askAI:', error);
    throw error;
  }
};
