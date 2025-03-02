import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditAffiliate.css"; // ✅ Import du CSS

const EditAffiliate = () => {
    const { affiliateId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const user = JSON.parse(localStorage.getItem("user"));

    const [affiliate, setAffiliate] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        country: "",
        sponsorId: "",
        createdat: Date.now()
    });

    const [sponsors, setSponsors] = useState([]);

    useEffect(() => {
        fetch(`https://mlm-app-jhc.fly.dev/api/auth/members/${affiliateId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setAffiliate(data))
            .catch(err => console.error("❌ Erreur chargement affilié :", err));
    }, [affiliateId, token]);

    useEffect(() => {
        fetch(`https://mlm-app-jhc.fly.dev/api/members/${user._id}/affiliates`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const filteredSponsors = data.filter(member => member._id !== affiliateId);
                    if (user) {
                        filteredSponsors.unshift(user);
                    }
                    setSponsors(filteredSponsors);
                }
            })
            .catch(err => console.error("❌ Erreur chargement sponsors :", err));
    }, [affiliateId, token, user]);

    const handleChange = (e) => {
        setAffiliate({ ...affiliate, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!affiliate.firstName || !affiliate.lastName) {
            alert("⚠️ Remplissez au moins le prénom et le nom.");
            return;
        }

        try {
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/members/${affiliateId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(affiliate)
            });

            if (response.ok) {
                alert("✅ Modifications enregistrées !");
                navigate(-1);
            } else {
                alert("❌ Erreur lors de la mise à jour.");
            }
        } catch (error) {
            alert("❌ Erreur API : " + error.message);
        }
    };

    return (
        <div className="edit-affiliate-container">
            <h2 className="edit-affiliate-title">✏️ Modifier l'affilié</h2>

            <div className="edit-affiliate-form">
                <label className="edit-affiliate-label">Prénom :</label>
                <input type="text" name="firstName" value={affiliate.firstName} onChange={handleChange} className="edit-affiliate-input" />

                <label className="edit-affiliate-label">Nom :</label>
                <input type="text" name="lastName" value={affiliate.lastName} onChange={handleChange} className="edit-affiliate-input" />

                <label className="edit-affiliate-label">Email :</label>
                <input type="email" name="email" value={affiliate.email} disabled className="edit-affiliate-input" />

                <label className="edit-affiliate-label">Téléphone :</label>
                <input type="text" name="phone" value={affiliate.phone} onChange={handleChange} className="edit-affiliate-input" />

                <label className="edit-affiliate-label">Adresse :</label>
                <input type="text" name="address" value={affiliate.address} onChange={handleChange} className="edit-affiliate-input" />

                <label className="edit-affiliate-label">Pays :</label>
                <input type="text" name="country" value={affiliate.country} onChange={handleChange} className="edit-affiliate-input" />

                <label className="edit-affiliate-label">Sponsor :</label>
                <select name="sponsorId" value={affiliate.sponsorId} onChange={handleChange} className="edit-affiliate-select">
                    <option value="">Aucun sponsor</option>
                    {sponsors.map(sponsor => (
                        <option key={sponsor._id} value={sponsor._id}>
                            {sponsor.firstName} {sponsor.lastName}
                        </option>
                    ))}
                </select>

                <div className="edit-affiliate-buttons">
                    <button onClick={handleSave} className="btn-save">💾 Enregistrer</button>
                    <button onClick={() => navigate(-1)} className="btn-cancel">❌ Annuler</button>
                </div>
            </div>
        </div>
    );
};

export default EditAffiliate;