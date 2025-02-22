import React, { useState, useEffect } from "react";

const HistoriqueActivites = ({ memberId }) => { // ✅ Ajout de memberId en paramètre
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        if (!memberId) {
            console.error("❌ Erreur : memberId est indéfini !");
            return;
        }

        const fetchActivities = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`https://mlm-app-jhc.fly.dev/api/members/${memberId}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) {
                    alert("❌ Erreur récupération de l'historique");
                    return;
                }

                const data = await response.json();
                setActivities(data.activityLog || []); // ✅ Assure que `activityLog` est bien pris en compte
            } catch (error) {
                alert("❌ Erreur serveur lors du chargement de l'historique.");
            }
        };

        fetchActivities();
    }, [memberId]); // ✅ Ajout de `memberId` comme dépendance

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