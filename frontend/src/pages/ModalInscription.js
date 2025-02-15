import React, { useState } from 'react';
import './ModalInscription.css';

const ModalInscription = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'member'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const response = await fetch('https://mlm-app-jhc.fly.dev/api/auth/register', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('✅ Utilisateur inscrit avec succès !');
            onClose();
        } else {
            alert("❌ Erreur lors de l'inscription.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Inscription d'un nouvel utilisateur</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="firstName" placeholder="Prénom" onChange={handleChange} required />
                    <input type="text" name="lastName" placeholder="Nom" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
                    <select name="role" onChange={handleChange} required>
                        <option value="member">Membre</option>
                        <option value="admin">Administrateur</option>
                        <option value="superadmin">Super Administrateur</option>
                    </select>
                    <button type="submit" className="btn-confirm">📩 Inscrire</button>
                    <button type="button" onClick={onClose} className="btn-cancel">❌ Annuler</button>
                </form>
            </div>
        </div>
    );
};

export default ModalInscription;