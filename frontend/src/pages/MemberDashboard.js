import React, { useEffect, useState } from "react";

const MemberDashboard = () => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("token"); // 🔑 Récupération du token
                if (!token) {
                    setError("⛔ Accès refusé. Veuillez vous connecter.");
                    return;
                }

                const response = await fetch("https://mlm-app-jhc.fly.dev/api/auth/member/dashboard", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("⛔ Accès refusé ou erreur serveur.");
                }

                const data = await response.json();
                setMessage(data.message);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>👤 Tableau de bord Membre</h2>
            {error ? <p style={{ color: "red" }}>{error}</p> : <p>{message}</p>}
        </div>
    );
};

export default MemberDashboard;