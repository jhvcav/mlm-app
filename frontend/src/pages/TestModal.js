import React from "react";
import "./TestModal.css"; // Fichier CSS à créer pour le style

const TestModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // Si la modale est fermée, ne rien afficher

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>✅ Modale de test</h2>
                <p>Cette modale fonctionne correctement !</p>
                <button className="btn-close" onClick={onClose}>❌ Fermer</button>
            </div>
        </div>
    );
};

export default TestModal;