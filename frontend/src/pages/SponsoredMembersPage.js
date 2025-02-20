import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SponsoredMembersPage.css"; // ✅ Fichier CSS

const SponsoredMembersPage = () => {
    const [sponsoredMembers, setSponsoredMembers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSponsoredMembers = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch("https://mlm-app-jhc.fly.dev/api/members/sponsored", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) {
                    alert("❌ Erreur lors de la récupération des affiliés.");
                    return;
                }

                const data = await response.json();
                setSponsoredMembers(data);
            } catch (error) {
                alert("❌ Erreur serveur lors du chargement des affiliés.");
            }
        };

        fetchSponsoredMembers();
    }, []);

    return (
        <div className="sponsored-members-container">
            <h2>👥 Liste de vos Affiliés</h2>

            {sponsoredMembers.length > 0 ? (
                <table className="sponsored-table">
                    <thead>
                        <tr>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sponsoredMembers.map(member => (
                            <tr key={member._id}>
                                <td>{member.firstName}</td>
                                <td>{member.lastName || "Non renseigné"}</td>
                                <td>{member.email}</td>
                                <td>{member.phone || "Non renseigné"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>⚠️ Vous n'avez aucun affilié pour le moment.</p>
            )}
            
            {/* ✅ Bouton pour revenir au tableau de bord */}
            <button className="btn-back" onClick={() => navigate("/member-dashboard")}>
                ⬅️ Retour au tableau de bord
            </button>
        </div>
    );
};

export default SponsoredMembersPage;