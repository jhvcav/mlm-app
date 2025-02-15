// HistoriqueActivites.js
import React, { useEffect, useState } from 'react';

const HistoriqueActivites = () => {
    const [activites, setActivites] = useState([]);

    useEffect(() => {
        const fetchActivites = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('https://mlm-app-jhc.fly.dev/api/activities', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setActivites(data);
            } else {
                console.error("Erreur lors de la récupération des activités.");
            }
        };

        fetchActivites();
    }, []);

    return (
        <div>
            <h2>Historique des Activités</h2>
            {activites.length > 0 ? (
                <ul>
                    {activites.map((activite, index) => (
                        <li key={index}>{activite.description}</li>
                    ))}
                </ul>
            ) : (
                <p>Aucune activité récente.</p>
            )}
        </div>
    );
};

export default HistoriqueActivites;