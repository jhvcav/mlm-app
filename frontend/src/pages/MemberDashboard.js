import React, { useEffect, useState } from "react";

const MemberDashboard = () => {
    const [member, setMember] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMemberData = async () => {
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
                setMember(data.member); // 📊 Stocker les infos du membre
            } catch (err) {
                setError(err.message);
            }
        };

        fetchMemberData();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>👤 Tableau de bord Membre</h2>
            {error ? <p style={{ color: "red" }}>{error}</p> : null}

            {member ? (
                <div>
                    <p><strong>👤 Nom :</strong> {member.firstName} {member.lastName}</p>
                    <p><strong>📧 Email :</strong> {member.email}</p>
                    <p><strong>📞 Téléphone :</strong> {member.phone || "Non renseigné"}</p>
                    <p><strong>🎭 Rôle :</strong> {member.role}</p>
                </div>
            ) : (
                <p>🔄 Chargement des informations...</p>
            )}
        </div>
    );
};

export default MemberDashboard;