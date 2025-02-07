const bcrypt = require('bcryptjs');

const motDePasseFournit = "admin123";
const hashStocké = "$2a$10$MxZfvsNTzMFPKo8igNaJBuCkRva82Bpb5vYDL3wNjpgKHFKiKV3BW"; // Remplace par le hash dans MongoDB

bcrypt.compare(motDePasseFournit, hashStocké, (err, result) => {
    if (err) console.error("❌ Erreur bcrypt :", err);
    else console.log("📌 Résultat de la comparaison :", result);
});