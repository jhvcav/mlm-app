import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddAffiliates.css"; // ✅ Correction du nom du fichier CSS

const AddAffiliates = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
        sponsorId: ""
    });

    const [sponsors, setSponsors] = useState([]);

    useEffect(() => {
        const fetchSponsors = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch("https://mlm-app-jhc.fly.dev/api/members", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setSponsors(data);
            } else {
                alert("❌ Erreur lors de la récupération des sponsors.");
            }
        };

        fetchSponsors();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
    
        try {
            const response = await fetch("https://mlm-app-jhc.fly.dev/api/members/member/register", { // ✅ Nouvelle URL corrigée
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
    
            if (response.ok) {
                alert("✅ Affilié enregistré avec succès !");
                navigate("/affiliates"); // ✅ Rediriger après inscription
            } else {
                alert("❌ Erreur lors de l'inscription.");
            }
        } catch (error) {
            alert("❌ Erreur technique.");
        }
    };

    const handleCancel = () => {
        navigate("/member-dashboard"); // ✅ Redirige vers le Dashboard
    };

    return (
        <div className="add-affiliate-container">
            <h1>👥 Enregistrer un Affilié</h1>
            <form className="add-affiliate-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Prénom :</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Nom :</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Email :</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Téléphone :</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Pays :</label>
                    <input type="text" name="country" value={formData.country} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Sponsor :</label>
                    <input type="text" name="sponsorId" value={formData.sponsorId} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Sponsor :</label>
                    <select name="sponsorId" value={formData.sponsorId} onChange={handleChange} required>
                        <option value="">Sélectionner un sponsor</option>
                        {sponsors.map((sponsor) => (
                            <option key={sponsor._id} value={sponsor._id}>
                                {sponsor.firstName} {sponsor.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="button-container">
                    <button type="submit" className="btn-save" onClick={handleSubmit}>💾 Enregistrer</button>
                    <button type="button" className="btn-cancel" onClick={handleCancel}>❌ Annuler</button>
                </div>
            </form>
        </div>
    );
};

export default AddAffiliates;