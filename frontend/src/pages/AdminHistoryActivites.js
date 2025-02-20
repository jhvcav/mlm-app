import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHistoryActivites.css"; // ✅ Fichier CSS pour le style

const AdminHistoryActivites = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const memberId = user ? user._id : null;
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            if (!memberId) return;

            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`https://mlm-app-jhc.fly.dev/api/auth/members/${memberId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) {
                    alert("❌ Erreur récupération de l'historique.");
                    return;
                }

                const data = await response.json();
                setActivities(data.activityLog || []); // ✅ Récupération des logs d'activité
            } catch (error) {
                alert("❌ Erreur serveur lors du chargement de l'historique.");
            }
        };

        fetchActivities();
    }, [memberId]);

    return (
        <div className="admin-history-container">
            <h1>📜 Historique des Activités</h1>
            {activities.length > 0 ? (
                <ul className="activity-list">
                    {activities.map((activity, index) => (
                        <li key={index} className="activity-item">{activity}</li>
                    ))}
                </ul>
            ) : (
                <p>⚠️ Aucune activité enregistrée.</p>
            )}

            <button onClick={() => navigate("/superadmin-dashboard")} className="btn-back">
                ⬅️ Retour au Dashboard
            </button>
        </div>
    );
};

export default AdminHistoryActivites;