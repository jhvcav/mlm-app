import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SponsoredMembersPage.css"; // ✅ Fichier CSS

const SponsoredMembersPage = () => {
    const [sponsoredMembers, setSponsoredMembers] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchSponsoredMembers = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`https://mlm-app-jhc.fly.dev/api/members/sponsored/${user._id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) {
                    alert("❌ Erreur lors de la récupération des affiliés.");
                    return;
                }

                const data = await response.json();
                setSponsoredMembers(data);
            } catch (error) {
                alert("❌ Erreur technique.");
            }
        };

        if (user && user._id) {
            fetchSponsoredMembers();
        } else {
            alert("❌ Impossible de récupérer les affiliés.");
        }
    }, [user]);

    return (
        <div className="sponsored-members-container">
            <h1>👥 Liste des Membres Affiliés</h1>
            {sponsoredMembers.length > 0 ? (
                <ul>
                    {sponsoredMembers.map((member) => (
                        <li key={member._id}>{member.firstName} {member.lastName} - {member.email}</li>
                    ))}
                </ul>
            ) : (
                <p>⚠️ Aucun affilié trouvé.</p>
            )}
            <button className="btn-back" onClick={() => navigate(-1)}>🔙 Retour</button>
            <button className="btn-all-affiliates" onClick={() => navigate("/all-affiliates-products")}>📜 Voir tous les affiliés et produits souscrits</button>
        </div>
    );
};

export default SponsoredMembersPage;