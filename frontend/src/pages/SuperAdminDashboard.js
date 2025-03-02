import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [members, setMembers] = useState([]);

    // ✅ Fonction pour naviguer vers AdminDetailsPage.js ou MemberDetailsPage.js
    const handleEdit = (userId, role) => {
        if (role === "admin") {
            navigate(`/admin/${userId}`);  // Redirige vers AdminDetailsPage.js
        } else {
            navigate(`/member/${userId}`); // Redirige vers MemberDetailsPage.js
        }
    };

    useEffect(() => {
        const fetchAdmins = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch("https://mlm-app-jhc.fly.dev/api/auth/admins", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setAdmins(data);
            } else {
                console.error("⛔ Erreur chargement des administrateurs.");
            }
        };

        const fetchMembers = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch("https://mlm-app-jhc.fly.dev/api/members", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setMembers(data);
            } else {
                console.error("⛔ Erreur chargement des membres.");
            }
        };

        fetchAdmins();
        fetchMembers();
    }, []);

    return (
        <div className="superadmin-dashboard">
            <h1 className="dashboard-title">🏆 Tableau de bord Super Admin</h1>
            <p className="dashboard-message">Bienvenue sur votre espace de gestion.</p>

            <div className="admin-buttons">
                <button onClick={() => navigate("/member-dashboard")} className="btn-dashboard-user">
                    👤 Tableau de bord User
                </button>
                <button onClick={() => navigate("/inscription")} className="btn-add-user">
                    ➕ Inscrire un utilisateur
                </button>
            </div>

            <h2 className="section-title">🛠️ Administrateurs</h2>
            <div className="card-container">
                {admins.map((admin) => (
                    <div key={admin._id} className="user-card">
                        <h3>{admin.firstName} {admin.lastName}</h3>
                        <p>📧 {admin.email}</p>
                        <p>🆔 {admin._id}</p>
                        <div className="card-buttons">
                            <button className="btn-edit" onClick={() => handleEdit(admin._id, "admin")}>
                                ✏️ Modifier
                            </button>
                            <button className="btn-delete">❌ Supprimer</button>
                            <button className="btn-view">👁️ Voir</button>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="section-title">👥 Membres</h2>
            <div className="card-container">
                {members.map((member) => (
                    <div key={member._id} className="user-card">
                        <h3>{member.firstName} {member.lastName}</h3>
                        <p>📧 {member.email}</p>
                        <p>🆔 {member._id}</p>
                        <div className="card-buttons">
                            <button className="btn-edit" onClick={() => handleEdit(member._id, "member")}>
                                ✏️ Modifier
                            </button>
                            <button className="btn-delete">❌ Supprimer</button>
                            <button className="btn-view">👁️ Voir</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;