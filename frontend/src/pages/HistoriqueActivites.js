import React, { useState, useEffect } from "react";

const HistoriqueActivites = ({ memberId }) => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`https://mlm-app-jhc.fly.dev/api/auth/members/${memberId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) {
                    alert("❌ Erreur récupération de l'historique");
                    return;
                }

                const data = await response.json();
                setActivities(data.activityLog || []);

                // ✅ Vérification sur tablette
                alert("📜 Logs récupérés : " + JSON.stringify(data.activityLog));

            } catch (error) {
                alert("❌ Erreur serveur lors du chargement des activités.");
            }
        };

        fetchActivities();
    }, [memberId]);

    return (
        <div className="historique-container">
            <h3>📜 Historique des Activités</h3>
            {activities.length > 0 ? (
                <ul>
                    {activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                    ))}
                </ul>
            ) : (
                <p>⚠️ Aucune activité enregistrée.</p>
            )}
        </div>
    );
};

export default HistoriqueActivites;