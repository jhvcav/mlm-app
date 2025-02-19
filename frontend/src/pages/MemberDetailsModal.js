import React from "react";
import "./MemberModals.css"; // 📌 Ajoute un style si nécessaire

const MemberDetailsModal = ({ member, onClose }) => {
    if (!member) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>👤 Détails du Membre</h2>
                <p><strong>Prénom :</strong> {member.firstName}</p>
                <p><strong>Nom :</strong> {member.lastName || member.name}</p>
                <p><strong>Email :</strong> {member.email}</p>
                <p><strong>Téléphone :</strong> {member.phone || "Non renseigné"}</p>
                <p><strong>Adresse :</strong> {member.address || "Non renseignée"}</p>
                <p><strong>Rôle :</strong> {member.role}</p>
                <p><strong>Date d'inscription :</strong> {new Date(member.createdAt).toLocaleString()}</p>

                <button className="btn-cancel" onClick={onClose}>❌ Fermer</button>
            </div>
        </div>
    );
};

export default MemberDetailsModal;