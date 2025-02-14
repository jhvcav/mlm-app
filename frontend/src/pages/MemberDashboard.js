import React from "react";
import { useNavigate } from "react-router-dom";

const MemberDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    return (
        <div style={{ padding: "20px" }}>
            <h2>👤 Tableau de bord Membre</h2>
            <p>👤 Bienvenue sur le tableau de bord du Membre !</p>

            <div>
                <button onClick={() => navigate("/member-detail")} style={{ margin: "10px", padding: "10px" }}>
                    📋 Détail profil
                </button>
                <button onClick={() => navigate("/member-historique")} style={{ margin: "10px", padding: "10px" }}>
                    🕒 Historique activités
                </button>
            </div>
        </div>
    );
};

export default MemberDashboard;