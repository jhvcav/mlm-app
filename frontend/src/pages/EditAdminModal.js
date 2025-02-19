import React, { useState } from "react";
import "./ModalStyle.css"; // ✅ Ajoute le CSS pour le style

const EditAdminModal = ({ admin, onClose }) => {
    const [formData, setFormData] = useState({
        firstName: admin.firstName,
        lastName: admin.lastName || "",
        email: admin.email,
        phone: admin.phone || "",
        role: admin.role
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/auth/admins/${admin.email}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("✅ Administrateur mis à jour avec succès !");
                onClose();
            } else {
                alert("❌ Erreur lors de la mise à jour.");
            }
        } catch (error) {
            console.error("❌ Erreur technique :", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>✏️ Modifier Administrateur</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                    <input type="email" name="email" value={formData.email} disabled />
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="admin">Administrateur</option>
                        <option value="superadmin">SuperAdmin</option>
                    </select>
                    <button type="submit" className="btn-confirm">💾 Enregistrer</button>
                    <button type="button" className="btn-cancel" onClick={onClose}>❌ Annuler</button>
                </form>
            </div>
        </div>
    );
};

export default EditAdminModal;