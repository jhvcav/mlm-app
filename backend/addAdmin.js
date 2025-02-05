const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin'); // Assure-toi que ton modèle Admin est bien importé

const mongoURI = "mongodb://127.0.0.1:27017/mlm"; // Mets l'URL de ta base de données

const createAdmin = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

        const email = "admin@mlm.com";
        const password = "admin123";

        // Vérifie si l'admin existe déjà
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            console.log("✅ Un administrateur existe déjà avec cet email.");
            return;
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'admin
        const newAdmin = new Admin({
            firstName: "Admin",
            lastName: "MLM",
            email: email,
            password: hashedPassword,
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