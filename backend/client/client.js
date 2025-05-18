const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

//settingsi
async function getSettings(userId) {
  try {
    const response = await axios.get(`${BASE_URL}/settings`, {
      params: { uporabnik: userId }
    });
    console.log('Nastavitve:', response.data);
  } catch (error) {
    console.error('Napaka pri pridobivanju nastavitev:', error);
  }
}

async function addSettings(settingsData) {
  try {
    const response = await axios.post(`${BASE_URL}/settings`, settingsData);
    console.log('Nove nastavitve so bile dodane:', response.data);
  } catch (error) {
    console.error('Napaka pri dodajanju nastavitev:', error);
  }
}

async function updateSettings(id, settingsData) {
  try {
    const response = await axios.put(`${BASE_URL}/settings/${id}`, settingsData);
    console.log('Nastavitve so bile posodobljene:', response.data);
  } catch (error) {
    console.error('Napaka pri posodabljanju nastavitev:', error);
  }
}

async function deleteSettings(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/settings/${id}`);
    console.log('Nastavitve so bile izbrisane:', response.data);
  } catch (error) {
    console.error('Napaka pri brisanju nastavitev:', error);
  }
}

// recommendationsi
async function getRecommendations(userId) {
  try {
    const response = await axios.get(`${BASE_URL}/recommendations`, {
      params: { uporabnik: userId } 
    });
    console.log('Priporočila:', response.data);
  } catch (error) {
    console.error('Napaka pri pridobivanju priporočil:', error);
  }
}


async function addRecommendation(recommendationData) {
  try {
    const response = await axios.post(`${BASE_URL}/recommendations`, recommendationData);
    console.log('Novo priporočilo je bilo dodano:', response.data);
  } catch (error) {
    console.error('Napaka pri dodajanju priporočila:', error);
  }
}


async function updateRecommendation(id, recommendationData) {
  try {
    const response = await axios.put(`${BASE_URL}/recommendations/${id}`, recommendationData);
    console.log('Priporočilo je bilo posodobljeno:', response.data);
  } catch (error) {
    console.error('Napaka pri posodabljanju priporočila:', error);
  }
}


async function deleteRecommendation(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/recommendations/${id}`);
    console.log('Priporočilo je bilo izbrisano:', response.data);
  } catch (error) {
    console.error('Napaka pri brisanju priporočila:', error);
  }
}

// test funkcij
(async function() {
    await getSettings(1123);
    await addSettings({ userId: 1123, language: 'en', theme: 'dark', notificationsEnabled: true, privacy: 'high' });
    await updateSettings(1, { language: 'sl', theme: 'light', notificationsEnabled: true, privacy: 'low' });
    await deleteSettings(1);
  
    await getRecommendations(1123);  
    await addRecommendation({ userId: 1123, recommendation: 'Increase exercise frequency', createdAt: '2025-03-26' });
    await updateRecommendation(1, { recommendation: 'Drink more water daily' });
    await deleteRecommendation(1);
})();
