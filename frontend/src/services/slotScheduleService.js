// src/services/slotScheduleService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const createSlotSchedule = async (slotData) => {
  try {
    const response = await axios.post(`${API_URL}/slot-schedules`, slotData);
    return response.data;
  } catch (error) {
    console.error('Error creating slot schedule:', error);
    throw error;
  }
};

export const fetchSlotSchedules = async () => {
  try {
    const response = await axios.get(`${API_URL}/slot-schedules`);
    return response.data.data.schedules;
  } catch (error) {
    console.error('Error fetching slot schedules:', error);
    throw error;
  }
};

export const deleteSlotSchedule = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/slot-schedules/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting slot schedule:', error);
    throw error;
  }
};