import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TableauAdmins from './TableauAdmins';
import TableauMembres from './TableauMembres';
import './SuperAdminDashboard.css';
import MemberDetailsModal from "./MemberDetailsModal"; // ✅ Import du modal d'édition
import EditMemberModal from "./EditMemberModal"; // ✅ Import du modal d'édition
import EditAdminModal from "./EditAdminModal";
import "./ModalStyle.css";

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [members, setMembers] = useState([]);
    
    // ✅ États pour la gestion des modales (édition et détails)
    const [editData, setEditData] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showMemberDetailsModal, setShowMemberDetailsModal] = useState(false);
    const [showEditMemberModal, setShowEditMemberModal] = useState(false);

    // 🔹 Récupération des administrateurs
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

    // ✅ Fonction pour ouvrir la fenêtre d'inscription
    const openRegistrationWindow = () => {
        const registrationUrl = window.location.origin + "/#/inscription"; // ✅ URL complète pour éviter la redirection vers login
        window.open(
            registrationUrl,
            "InscriptionUtilisateur",
            "width=500,height=650,top=100,left=100"
        );
    };

    // ✅ Fonction pour modifier (Edit) un admin
    const handleEditAdmin = (admin) => {
        document.body.innerHTML += `<p style='color:blue;'>📝 Modifier Admin: ${admin.firstName} ${admin.lastName}</p>`;
        setEditData(admin);
        setShowEditModal(true);
    };

    // ✅ Fonction pour voir les détails d'un admin (comme pour les membres)
    const handleViewAdmin = (admin) => {
        if (admin && admin._id) {
            navigate(`/admin/${admin._id}`);
        } else {
            alert("❌ Impossible de récupérer les détails de cet administrateur.");
        }
    };

    // ✅ Fonction pour supprimer un admin avec message de confirmation
    const handleDeleteAdmin = async (adminEmail) => {
        if (window.confirm("❌ Êtes-vous sûr de vouloir supprimer cet administrateur ?")) {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(`https://mlm-app-jhc.fly.dev/api/auth/admins/${adminEmail}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                const result = await response.json();

                if (response.ok) {
                    alert(`✅ Administrateur ${adminEmail} supprimé avec succès !`);
                    setAdmins(prevAdmins => prevAdmins.filter(admin => admin.email !== adminEmail));
                } else {
                    alert(`❌ Erreur lors de la suppression : ${result.error || "Réponse API inconnue"}`);
                }
            } catch (error) {
                alert(`❌ Erreur technique : ${error.message}`);
            }
        }
    };

    // ✅ Fonction pour modifier un membre
const handleEditMember = (member) => {
    alert(`📝 Modifier Membre : ${member.firstName} ${member.lastName}`);
    setEditData(member);
    setShowEditModal(true);
};

// ✅ Fonction pour voir les détails d'un membre
const handleViewMember = (member) => {
    alert(`👁️ Voir détails Membre : ${member.firstName} ${member.lastName}`);
    setSelectedMember(member);
    setShowMemberDetailsModal(true);
};

// ✅ Fonction pour supprimer un membre
const handleDeleteMember = async (memberEmail) => {
    if (window.confirm("❌ Supprimer ce membre ?")) {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/auth/members/${memberEmail}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            const result = await response.json();

            if (response.ok) {
                alert("✅ Membre supprimé avec succès !");
                setMembers(prevMembers => prevMembers.filter(member => member.email !== memberEmail));
            } else {
                alert(`❌ Erreur suppression : ${result.error || "Réponse API inconnue"}`);
            }
        } catch (error) {
            alert(`❌ Erreur technique : ${error.message}`);
        }
    }
};


const handleSaveMember = (updatedMember) => {
    setMembers(prevMembers =>
        prevMembers.map(m => (m.email === updatedMember.email ? updatedMember : m))
    );
};

    return (
        <div className="superadmin-dashboard">
            <h1 className="dashboard-title">🏆 Tableau de bord Super Admin</h1>
            <p className="dashboard-message">Bienvenue sur votre espace de gestion.</p>

            {/* ✅ Boutons d'accès */}
            <div className="admin-buttons">
                <button onClick={() => navigate('/admin-list')} className="btn-admin">👨‍💼 Liste des Admins</button>
                <button onClick={() => navigate('/member-list')} className="btn-members">👥 Liste des Membres</button>
                {/* ✅ Bouton pour accéder à l'historique sur une autre page */}
                <button onClick={() => navigate("/admin-historique-activites")} className="btn-history">📜 Voir l'historique des activités</button>
                <button onClick={openRegistrationWindow} className="btn-add-user">➕ Inscrire un utilisateur</button>
            </div>

            {/* ✅ Liste des administrateurs */}
            <div className="admin-table">
                <TableauAdmins 
                    admins={admins} 
                    onEdit={handleEditAdmin} 
                    onDelete={handleDeleteAdmin} 
                    onView={handleViewAdmin}
                />
            </div>

            {/* ✅ Liste des membres */}
            <div className="member-table">
                <TableauMembres 
                    members={members} 
                    onEdit={handleEditMember} 
                    onDelete={handleDeleteMember} 
                    onView={handleViewMember} 
                />
            </div>

            {/* ✅ Modal pour Modifier un Admin */}
            {showEditModal && (
                <EditAdminModal 
                    admin={editData} 
                    onClose={() => setShowEditModal(false)}
                />
            )}

            {showMemberDetailsModal && (
                <MemberDetailsModal 
                    member={selectedMember} 
                    onClose={() => setShowMemberDetailsModal(false)} 
                />
            )}

            {showEditMemberModal && (
                <EditMemberModal 
                    member={selectedMember} 
                    onClose={() => setShowEditMemberModal(false)} 
                    onSave={handleSaveMember}
                />
            )}

            {/* ✅ Modales (Ajoute ici les modales d'édition et de détails si elles existent) */}
        </div>
    );
};

export default SuperAdminDashboard;