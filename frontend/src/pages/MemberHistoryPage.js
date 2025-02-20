import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MemberHistoryPage.css"; // ✅ Ajoute un fichier CSS pour le style

const MemberHistoryPage = () => {
    const { memberId } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchMemberHistory = async () => {
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
                setMember(data);
                setHistory(data.activityLog || []);
            } catch (error) {
                alert("❌ Erreur serveur lors du chargement de l'historique.");
            }
        };

        if (memberId) fetchMemberHistory();
    }, [memberId]);

    return (
        <div className="history-container">
            <h1>📜 Historique des Activités</h1>
            {member && (
                <h2>{member.firstName} {member.lastName} ({member.email})</h2>
            )}
            {history.length > 0 ? (
                <ul className="history-list">
                    {history.map((entry, index) => (
                        <li key={index}>{entry}</li>
                    ))}
                </ul>
            ) : (
                <p className="no-history">⚠️ Aucune activité enregistrée.</p>
            )}
            <button className="btn-back" onClick={() => navigate("/member-dashboard")}>⬅️ Retour</button>
        </div>
    );
};

export default MemberHistoryPage;