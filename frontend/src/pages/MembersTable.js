import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MembersTable.css';

const MembersTable = () => {
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate('/login'); // Rediriger si l'utilisateur n'est pas connecté
            return;
        }

        fetch("https://mlm-app-jhc.fly.dev/api/auth/member/profile", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setMembers([data]); // Afficher uniquement les infos du membre connecté
        })
        .catch(err => {
            console.error("❌ Erreur chargement des membres :", err);
            localStorage.removeItem("token"); // Supprimer le token corrompu
            navigate('/login'); // Rediriger vers la connexion
        });
    }, [navigate]);

    // ✅ Fonction pour modifier un membre
    const handleEdit = (member) => {
        localStorage.setItem("selectedMember", JSON.stringify(member));
        navigate('/members-form');
    };

    // ✅ Fonction pour supprimer un membre
    const handleDelete = async (memberId) => {
        if (window.confirm("❌ Êtes-vous sûr de vouloir supprimer ce membre ?")) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`https://mlm-app-jhc.fly.dev/api/auth//members/${memberId}`, {
                    method: 'DELETE',
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error("Erreur lors de la suppression du membre.");
                }

                alert("✅ Membre supprimé avec succès !");
                setMembers([]);
                localStorage.removeItem("token");
                navigate('/login');
            } catch (error) {
                console.error("❌ Erreur suppression :", error);
                alert("❌ Impossible de supprimer ce membre.");
            }
        }
    };

    // ✅ Fonction pour afficher les détails du membre
    const handleShowMemberDetails = (member) => {
        const detailsWindow = window.open("", "_blank", "width=500,height=650");
        if (detailsWindow) {
            detailsWindow.document.write(`
                <html>
                <head>
                    <title>👤 Détails du Membre</title>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; text-align: center; }
                        .card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); text-align: left; width: 90%; margin: auto; }
                        .card h3 { text-align: center; color: #007bff; }
                        .info { margin-bottom: 10px; font-size: 16px; }
                        .close-btn { display: block; width: 100%; margin-top: 15px; background-color: #dc3545; color: white; padding: 10px; border: none; cursor: pointer; border-radius: 5px; text-align: center; }
                        .close-btn:hover { background-color: #c82333; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h3>👤 Détails du Membre</h3>
                        <p class="info"><strong>ID Membre :</strong> ${member.memberId}</p>
                        <p class="info"><strong>Prénom :</strong> ${member.firstName}</p>
                        <p class="info"><strong>Nom :</strong> ${member.name}</p>
                        <p class="info"><strong>Email :</strong> ${member.email}</p>
                        <p class="info"><strong>Téléphone :</strong> ${member.phone}</p>
                        <p class="info"><strong>Adresse :</strong> ${member.address || "Non renseignée"}</p>
                        <p class="info"><strong>Pays :</strong> ${member.country || "Non renseigné"}</p>
                        <p class="info"><strong>Ville :</strong> ${member.city || "Non renseignée"}</p>
                        <p class="info"><strong>Date d'inscription :</strong> ${member.registrationDate || "Non spécifiée"}</p>
                        <p class="info"><strong>Sponsor :</strong> ${member.sponsorId || "Aucun"}</p>
                        <button class="close-btn" onclick="window.close()">❌ Fermer</button>
                    </div>
                </body>
                </html>
            `);
        }
    };

    return (
        <div className="table-container">
            <h2>📋 Liste des Membres</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID Membre</th>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {members.length > 0 ? (
                        members.map(member => (
                            <tr key={member._id}>
                                <td>{member.memberId}</td>
                                <td>{member.firstName}</td>
                                <td>{member.name}</td>
                                <td>{member.email}</td>
                                <td>{member.phone}</td>
                                <td className="action-buttons">
                                    <button className="edit-btn" onClick={() => handleEdit(member)}>✏️ Modifier</button>
                                    <button className="details-btn" onClick={() => handleShowMemberDetails(member)}>👁️ Voir Détails</button>
                                    <button className="delete-btn" onClick={() => handleDelete(member._id)}>🗑️ Supprimer</button>
                                    <button className="network-btn" onClick={() => navigate(`/network-tree/${member._id}`)}>🌳 Voir Réseau</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Aucune donnée disponible.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MembersTable;