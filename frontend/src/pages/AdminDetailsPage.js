import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminDetailsPage.css"; // ✅ Fichier CSS

const AdminDetailsPage = () => {
    const { adminId } = useParams();
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchAdminDetails = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`https://mlm-app-jhc.fly.dev/api/auth/admin/${adminId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) {
                    alert("❌ Erreur lors de la récupération des détails de l'admin.");
                    return;
                }

                const data = await response.json();
                setAdmin(data);
                setFormData(data);
            } catch (error) {
                alert("❌ Erreur technique, impossible de charger les données.");
            }
        };

        if (adminId) fetchAdminDetails();
    }, [adminId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/auth/admin/${adminId}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("✅ Informations mises à jour !");
                navigate("/superadmin-dashboard");
            } else {
                alert("❌ Erreur lors de la mise à jour.");
            }
        } catch (error) {
            alert("❌ Problème technique.");
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem("token");

        if (window.confirm("❌ Êtes-vous sûr de vouloir supprimer cet administrateur ?")) {
            try {
                const response = await fetch(`https://mlm-app-jhc.fly.dev/api/auth/admin/${adminId}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    alert("✅ Administrateur supprimé !");
                    navigate("/superadmin-dashboard");
                } else {
                    alert("❌ Erreur lors de la suppression.");
                }
            } catch (error) {
                alert("❌ Problème technique.");
            }
        }
    };

    if (!admin) return <p>Chargement des informations...</p>;

    return (
        <div className="admin-details-container">
            <h1>👤 Détails de l'Admin</h1>
            <form className="admin-form">
                <div className="form-group">
                    <label>Prénom :</label>
                    <input type="text" name="firstName" value={formData.firstName || ""} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Nom :</label>
                    <input type="text" name="lastName" value={formData.lastName || ""} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Email :</label>
                    <input type="email" name="email" value={formData.email || ""} disabled />
                </div>

                <div className="form-group">
                    <label>Téléphone :</label>
                    <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} />
                </div>

                <div className="button-container">
                    <button type="button" className="btn-save" onClick={handleSave}>💾 Enregistrer</button>
                    <button type="button" className="btn-delete" onClick={handleDelete}>🗑️ Supprimer</button>
                    <button type="button" className="btn-history" onClick={() => navigate(`/admin-history/${adminId}`)}>📜 Historique</button>
                    <button type="button" className="btn-cancel" onClick={() => navigate("/superadmin-dashboard")}>❌ Retour</button>
                </div>
            </form>
        </div>
    );
};

export default AdminDetailsPage;