import React from "react";
import "./ModalStyle.css"; // ✅ Ajoute le CSS pour le style

const AdminDetailsModal = ({ admin, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>👁️ Détails Administrateur</h2>
                <p><strong>Prénom :</strong> {admin.firstName}</p>
                <p><strong>Nom :</strong> {admin.lastName || "Non renseigné"}</p>
                <p><strong>Email :</strong> {admin.email}</p>
                <p><strong>Téléphone :</strong> {admin.phone || "Non renseigné"}</p>
                <p><strong>Rôle :</strong> {admin.role === "superadmin" ? "⭐ SuperAdmin" : "🔹 Admin"}</p>
                <button className="btn-cancel" onClick={onClose}>❌ Fermer</button>
            </div>
        </div>
    );
};

export default AdminDetailsModal