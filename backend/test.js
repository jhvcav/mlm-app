const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mlm-app";

const createAdmin = async () => {
    try {
        await mongoose.connect(mongoURI);

        const email = "admin@example.com";
        const password = "admin123";

        // Vérifier si l'admin existe déjà
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            console.log("✅ Un administrateur existe déjà avec cet email.");
            return;
        }

        // Créer un admin sans hashage
        const newAdmin = new Admin({
            firstName: "Super",
            lastName: "Admin",
            email: email,
            password: password,
            role: "admin"
        });

        await newAdmin.save();
        console.log("✅ Administrateur ajouté avec succès !");
    } catch (err) {
        console.error("❌ Erreur lors de l'ajout de l'administrateur :", err);
    } finally {
        mongoose.connection.close();
    }
};

// Exécute la fonction
createAdmin();