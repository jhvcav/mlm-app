import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MemberDetailsPage.css"; // ✅ Ajout du fichier CSS

const MemberDetailsPage = () => {
    const { memberId } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchMemberDetails = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`https://mlm-app-jhc.fly.dev/api/members/${memberId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) {
                    alert("❌ Erreur lors de la récupération des détails du membre.");
                    return;
                }

                const data = await response.json();
                setMember(data);
                setFormData(data);
            } catch (error) {
                alert("❌ Erreur technique, impossible de charger les données.");
            }
        };

        if (memberId) fetchMemberDetails();
    }, [memberId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/members/${memberId}`, {
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

    if (!member) return <p>Chargement des informations...</p>;

    return (
        <div className="member-details-container">
            <h1>👤 Détails du Membre</h1>
            <form className="member-form">
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
                    <input type="email" name="email" value={formData.email || ""} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Téléphone :</label>
                    <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Adresse :</label>
                    <input type="text" name="address" value={formData.address || ""} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Pays :</label>
                    <input type="text" name="country" value={formData.country || ""} onChange={handleChange} />
                </div>

                <div className="form-group">
                <label htmlFor="role">Rôle :</label>
                <select 
                    id="role" 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange} 
                    className="member-role"
                >
                    <option value="member">Membre</option>
                    <option value="admin">Administrateur</option>
                    <option value="superadmin">Super Administrateur</option>
                </select>
                </div>

                <div className="button-container">
                    <button type="button" className="btn-save" onClick={handleSave}>💾 Enregistrer</button>
                    <button type="button" className="btn-cancel" onClick={() => navigate("/member-dashboard")}>❌ Annuler</button>
                </div>
            </form>
        </div>
    );
};

export default MemberDetailsPage;