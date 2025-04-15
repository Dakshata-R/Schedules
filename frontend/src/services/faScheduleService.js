import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const fetchFASchedules = async () => {
  try {
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/fa-schedules/created-by?email=${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data?.data?.schedules || [];
  } catch (error) {
    console.error('Error fetching FA schedules:', error);
    throw error;
  }
};
