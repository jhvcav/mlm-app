import React from 'react';
import './ModalInscription.css';

const ModalInscription = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // ✅ Ne pas afficher le modal si isOpen = false

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Inscription d'un nouvel utilisateur</h2>
                <form>
                    <input type="text" name="firstName" placeholder="Prénom" required />
                    <input type="text" name="lastName" placeholder="Nom" required />
                    <input type="email" name="email" placeholder="Email" required />
                    <input type="password" name="password" placeholder="Mot de passe" required />
                    <select name="role" required>
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