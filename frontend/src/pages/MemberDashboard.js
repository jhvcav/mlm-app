import React from "react";
import { useNavigate } from "react-router-dom";
import "./MemberDashboard.css"; // ✅ Ajout du fichier CSS
import "./AddAffiliates.css";

const MemberDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    // ✅ Vérification si l'utilisateur est bien défini
    if (!user || !user._id) {
        return <p className="error-message">❌ Erreur : Aucune information utilisateur trouvée.</p>;
    }

    return (
        <div className="member-dashboard">
            <div className="dashboard-header">
                <h1>👤 Tableau de bord Membre</h1>
                <p className="welcome-message">Bienvenue, <strong>{user.firstName}</strong> ! 🎉</p>
            </div>

            <div className="member-actions">
                <button 
                    onClick={() => navigate(`/member/${user._id}`)} 
                    className="btn-action btn-profile"
                >
                    📋 Voir Profil
                </button>

                {/* ✅ Bouton pour afficher l'historique des activités */}
                <button 
                    onClick={() => navigate(`/member-historique/${user._id}`)} 
                    className="btn-action btn-history"
                >
                    🕒 Historique Activités
                </button>

                {/* ✅ Bouton pour afficher l'arbre du réseau MLM */}
                <button 
                    onClick={() => navigate("/MLM-tree")} 
                    className="btn-action btn-network"
                >
                    🌳 Arbre Réseau
                </button>

                <button 
                    className="btn-add-affiliate" 
                    onClick={() => navigate("/add-affiliate")}
                >
                    ➕ Ajouter un affilié
                </button>
            </div>
        </div>
    );
};

export default MemberDashboard;