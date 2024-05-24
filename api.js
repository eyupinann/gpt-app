import axios from 'axios';

const API_BASE_URL = 'https://gpt-mzdw.onrender.com';

const login = async (username) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      `username=${username}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data.token;
  } catch (error) {
    console.error(error);
    throw new Error('Login failed');
  }
};

const sendMessage = async (token, message) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/chat/`,
      `content=${message}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    throw new Error('Send message failed');
  }
};

export { login, sendMessage };
