import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MemberDetailsPage.css"; // ✅ Fichier CSS

const MemberDetailsPage = () => {
    const { memberId } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [formData, setFormData] = useState({});
    const [sponsors, setSponsors] = useState([]);

    useEffect(() => {
        const fetchMemberDetails = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`https://mlm-app-jhc.fly.dev/api/auth/members/${memberId}`, {
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

useEffect(() => {
    const fetchSponsors = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("https://mlm-app-jhc.fly.dev/api/members", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) {
                alert("❌ Erreur lors de la récupération des sponsors.");
                return;
            }

            const data = await response.json();
            setSponsors(data);
        } catch (error) {
            alert("❌ Erreur technique, impossible de charger les sponsors.");
        }
    };

    fetchSponsors();
}, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Mise à jour du formulaire
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    
        // Si l'utilisateur sélectionne un sponsor, met à jour le champ affichant le nom du sponsor
        if (name === "sponsorId") {
            const selectedSponsor = sponsors.find(s => s._id === value);
            if (selectedSponsor) {
                setFormData(prevState => ({
                    ...prevState,
                    sponsorName: selectedSponsor.firstName + " " + selectedSponsor.lastName
                }));
            }
        }
    };

    // ✅ Fonction de sauvegarde des modifications
    const handleSave = async () => {
        const token = localStorage.getItem("token");
    
        try {
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/members/${memberId}`, {
                method: "PUT",
                headers: { 
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(formData)
            });
    
            if (response.ok) {
                alert("✅ Informations mises à jour !");
                
                // ✅ Recharge les données mises à jour après la sauvegarde
                const updatedMember = await response.json();
                setMember(updatedMember.member);
                setFormData(updatedMember.member);
            } else {
                alert("❌ Erreur lors de la mise à jour.");
            }
        } catch (error) {
            alert("❌ Problème technique.");
        }
    };

    // ✅ Supprimer le membre
    const handleDelete = async () => {
        if (!window.confirm("❌ Êtes-vous sûr de vouloir supprimer ce membre ?")) return;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/auth/members/${member.email}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                alert("✅ Membre supprimé avec succès !");
                navigate(-1); // Retour à la page précédente
            } else {
                alert("❌ Erreur lors de la suppression.");
            }
        } catch (error) {
            alert("❌ Problème technique.");
        }
    };

     // ✅ Voir l'historique des activités
     const handleViewHistory = () => {
        navigate(`/member/${memberId}/history`);
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
                    <label>Sponsor actuel :</label>
                    <input
                        type="text" 
                        value={
                            sponsors.find(s => s._id === formData.sponsorId) 
                            ? `${sponsors.find(s => s._id === formData.sponsorId).firstName} ${sponsors.find(s => s._id === formData.sponsorId).lastName}`
                            : "Aucun"
                        } 
                        disabled
                    />
                </div>          

                {/* ✅ Modification du Sponsor */}
                <div className="form-group">
                    <label>Sponsor :</label>
                    <select 
                        name="sponsorId"
                        value={formData.sponsorId || ""}
                        onChange={handleChange}
                        className="member-sponsor"
                    >
                        <option value="">Sélectionner un sponsor</option>
                        {sponsors.map((sponsor) => (
                            <option key={sponsor._id} value={sponsor._id}>
                                {sponsor.firstName} {sponsor.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="button-container">
                    <button type="button" className="btn-save" onClick={handleSave}>💾 Enregistrer</button>
                    <button type="button" className="btn-history" onClick={handleViewHistory}>📜 Historique</button>
                    <button type="button" className="btn-delete" onClick={handleDelete}>❌ Supprimer</button>
                    <button type="button" className="btn-cancel" onClick={() => navigate("/superadmin-dashboard")}>❌ Retour</button>
                </div>
            </form>
        </div>
    );
};

export default MemberDetailsPage;
