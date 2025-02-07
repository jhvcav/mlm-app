import React, { useState } from 'react';

const RegisterModal = ({ isOpen, onClose, isAdmin }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');

    // ✅ Gérer le changement des champs du formulaire
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Envoyer le formulaire d'inscription
    const handleRegister = async () => {
        setError('');

        // Vérifier que tous les champs sont remplis
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || (!isAdmin && !formData.phone)) {
            setError("❌ Tous les champs sont obligatoires.");
            return;
        }

        try {
            const url = isAdmin 
                ? "https://mlm-app.onrender.com/api/auth/register/admin" 
                : "https://mlm-app.onrender.com/api/auth/register/member";

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur d'inscription.");
            }

            alert(`✅ ${isAdmin ? "Administrateur" : "Membre"} créé avec succès !`);
            onClose(); // Ferme la modale après succès

        } catch (err) {
            setError(`❌ ${err.message}`);
        }
    };

    return (
        isOpen && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>{isAdmin ? "Créer un Administrateur" : "Créer un Membre"}</h2>
                    {error && <p className="error">{error}</p>}
                    
                    <input type="text" name="firstName" placeholder="Prénom" value={formData.firstName} onChange={handleChange} required />
                    <input type="text" name="lastName" placeholder="Nom" value={formData.lastName} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    {!isAdmin && <input type="tel" name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleChange} required />}
                    <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />

                    <button onClick={handleRegister} className="btn-confirm">🚀 Valider</button>
                    <button onClick={onClose} className="btn-cancel">❌ Annuler</button>
                </div>
            </div>
        )
    );
};

export default RegisterModal;