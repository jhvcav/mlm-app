import React, { useEffect, useState } from "react";

const MemberHistoriqueActivite = () => {
    const [historique, setHistorique] = useState([]);

    useEffect(() => {
        const fetchHistorique = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch("https://mlm-app-jhc.fly.dev/api/auth/member/historique", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                console.error("⛔ Erreur lors de la récupération de l'historique.");
                return;
            }

            const data = await response.json();
            setHistorique(data.historique);
        };

        fetchHistorique();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>🕒 Historique des Activités</h2>
            {historique.length === 0 ? (
                <p>📭 Aucun historique trouvé.</p>
            ) : (
                <ul>
                    {historique.map((entry, index) => (
                        <li key={index}>📌 {entry}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MemberHistoriqueActivite;