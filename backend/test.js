const axios = require('axios');

const API_URL = "https://mlm-app.onrender.com/api/auth/test";

const testAPI = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log("✅ Réponse du serveur :", response.data);
    } catch (error) {
        console.error("❌ Erreur lors du test de l'API :", error.response ? error.response.data : error.message);
    }
};

testAPI();