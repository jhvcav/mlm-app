import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HistoriqueActivites from './MemberHistoriqueActivite';
import TableauAdmins from './TableauAdmins';
import TableauMembres from './TableauMembres';
import ModalInscription from './ModalInscription';
import './SuperAdminDashboard.css';
import TestModal from './TestModal';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [members, setMembers] = useState([]);

    // 🔹 Récupération des administrateurs
    useEffect(() => {
        const fetchAdmins = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch("https://mlm-app-jhc.fly.dev/api/admins", {
                headers: { "Authorization": `Bearer ${token}` }
            });
    
            if (response.ok) {
                const data = await response.json();
                
                // 🔍 DEBUG : Affichage de la réponse API
                document.body.innerHTML += `<pre>📡 Réponse API Admins : ${JSON.stringify(data, null, 2)}</pre>`;
                
                setAdmins(data);
            } else {
                console.error("⛔ Erreur chargement des administrateurs.");
                document.body.innerHTML += `<p style="color: red;">❌ Erreur chargement des administrateurs.</p>`;
            }
        };
        fetchAdmins();
    }, []);

    // 🔹 Récupération des membres
    useEffect(() => {
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
        fetchMembers();
    }, []);

    return (
        <div className="superadmin-dashboard">
            <h1 className="dashboard-title">🏆 Tableau de bord Super Admin</h1>
            <p className="dashboard-message">Bienvenue sur votre espace de gestion.</p>

            {/* ✅ Boutons d'accès */}
            <div className="admin-buttons">
                <button onClick={() => navigate('/admin-list')} className="btn-admin">👨‍💼 Liste des Admins</button>
                <button onClick={() => navigate('/member-list')} className="btn-members">👥 Liste des Membres</button>
                <button onClick={() => {
                    alert("🟢 Bouton cliqué !");
                    setIsModalOpen(true);
                }} className="btn-add-user">
                    ➕ Inscrire un utilisateur
                </button>
                <button onClick={() => setIsTestModalOpen(true)} className="btn-test-modal">🛠 Tester Ouverture Modale</button>
            </div>

            {/* ✅ Historique des activités */}
            <div className="activity-section">
                <HistoriqueActivites />
            </div>

            {/* ✅ Liste des administrateurs */}
            <div className="admin-table">
                <TableauAdmins admins={admins} />
            </div>

            {/* ✅ Liste des membres */}
            <div className="member-table">
                <TableauMembres members={members} />
            </div>

            {/* ✅ Fenêtre Modale pour Inscription */}
            {isModalOpen && <ModalInscription isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}

            {/* ✅ Fenêtre Modale de Test */}
            <TestModal isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)} />
        </div>
    );
};

export default SuperAdminDashboard;