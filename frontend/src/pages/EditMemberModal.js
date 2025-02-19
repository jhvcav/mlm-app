import React, { useState } from "react";
import "./MemberModals.css"; // 📌 Ajoute un style si nécessaire

const EditMemberModal = ({ member, onClose, onSave }) => {
    const [formData, setFormData] = useState({ ...member });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const response = await fetch(`https://mlm-app-jhc.fly.dev/api/members/${member.email}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("✅ Membre modifié avec succès !");
            onSave(formData); // Met à jour la liste sans recharger la page
            onClose();
        } else {
            alert("❌ Erreur lors de la modification.");
        }
    };

    if (!member) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>✏️ Modifier Membre</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    <input type="email" name="email" value={formData.email} disabled /> {/* Email non modifiable */}
                    <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} />
                    <input type="text" name="address" value={formData.address || ""} onChange={handleChange} />
                    
                    <button type="submit" className="btn-confirm">💾 Enregistrer</button>
                    <button type="button" onClick={onClose} className="btn-cancel">❌ Annuler</button>
                </form>
            </div>
        </div>
    );
};

export default EditMemberModal;