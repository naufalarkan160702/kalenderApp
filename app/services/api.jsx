import axios from 'axios';

const API_URL = 'https://date.nager.at/api/v3/PublicHolidays/2025/ID'; // Ganti dengan URL API kamu

export const fetchEvents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Contoh: [{ date: '2025-06-23', title: 'Ujian Akhir' }]
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
};
