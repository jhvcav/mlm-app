import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import TableauAdmins from './TableauAdmins';
import TableauMembres from './TableauMembres';
import DashboardButtons from './DashboardButtons';
import AdminModals from "./AdminModals";
import MemberModals from "./MemberModals";

const AdminDashboard = () => {
    const [admins, setAdmins] = useState([]);
    const [members, setMembers] = useState([]);
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [newAdmin, setNewAdmin] = useState({ firstName: '', lastName: '', email: '', password: '' });

    // ✅ Charger la liste des administrateurs et membres au démarrage
    useEffect(() => {
        fetchAdmins();
        fetchMembers();
    }, []);

    // ✅ Fonction pour récupérer les administrateurs
    const fetchAdmins = async () => {
        try {
            const response = await fetch('https://mlm-app-jhc.fly.dev/api/auth/admins');
            const data = await response.json();
            setAdmins(data);
        } catch (err) {
            console.error("Erreur lors du chargement des administrateurs :", err);
        }
    };

    // ✅ Fonction pour récupérer les membres
    const fetchMembers = async () => {
        try {
            const response = await fetch('https://mlm-app-jhc.fly.dev/api/members');
            const data = await response.json();
            setMembers(data);
        } catch (err) {
            console.error("Erreur lors du chargement des membres :", err);
        }
    };

    // ✅ Ajouter un administrateur
    const handleAddAdmin = async () => {
        try {
            const response = await fetch("https://mlm-app-jhc.fly.dev/api/auth/register/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAdmin),
            });

            if (!response.ok) {
                throw new Error("Échec de l'ajout de l'administrateur.");
            }

            alert("✅ Administrateur ajouté avec succès !");
            setShowAddAdminModal(false);
            setNewAdmin({ firstName: '', lastName: '', email: '', password: '' });
            fetchAdmins();
        } catch (err) {
            alert(`Erreur: ${err.message}`);
        }
    };

    // ✅ Modifier un Admin ou un Membre
    const handleEdit = (data) => {
        setEditData({ ...data });
        setShowEditModal(true);
    };

    // ✅ Voir les détails
    const handleViewDetails = (data) => {
        setSelectedDetail(data);
        setShowDetailModal(true);
    };

    // ✅ Supprimer un Admin ou un Membre avec confirmation
    const handleDelete = async (data) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${data.firstName} ?`)) {
            return;
        }

        const url = data.role ? `https://mlm-app-jhc.fly.dev/api/auth/admins/${data.email}` : `https://mlm-app-jhc.fly.dev/api/members/${data.email}`;

        try {
            const response = await fetch(url, { method: "DELETE" });

            if (!response.ok) {
                throw new Error("Échec de la suppression.");
            }

            alert("✅ Suppression réussie !");
            fetchAdmins();
            fetchMembers();
        } catch (err) {
            alert(`Erreur: ${err.message}`);
        }
    };

    // ✅ Enregistrer les modifications
    const handleSaveChanges = async () => {
        let url = editData.role ? `https://mlm-app-jhc.fly.dev/api/auth/admins/${editData.email}` : `https://mlm-app-jhc.fly.dev/api/members/${editData.email}`;

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            });

            if (!response.ok) {
                throw new Error("Échec de la mise à jour.");
            }

            alert("✅ Mise à jour effectuée !");
            fetchAdmins();
            fetchMembers();
            setShowEditModal(false);
        } catch (err) {
            alert(`Erreur: ${err.message}`);
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>🛠️ Tableau de bord Admin</h2>
            <DashboardButtons onAddAdmin={() => setShowAddAdminModal(true)} />

            {/* ✅ Liste des Administrateurs */}
            <TableauAdmins 
                admins={admins}
                setEditData={setEditData}
                setShowEditModal={setShowEditModal}
                setSelectedDetail={setSelectedDetail}
                setShowDetailModal={setShowDetailModal}
                fetchAdmins={fetchAdmins}
                handleEdit={handleEdit}
                handleViewDetails={handleViewDetails}
                handleDelete={handleDelete}
            />

            {/* ✅ Liste des Membres */}
            <TableauMembres 
                members={members}
                setEditData={setEditData}
                setShowEditModal={setShowEditModal}
                setSelectedDetail={setSelectedDetail}
                setShowDetailModal={setShowDetailModal}
                fetchMembers={fetchMembers}
                handleEdit={handleEdit}
                handleViewDetails={handleViewDetails}
                handleDelete={handleDelete}
            />

            {/* ✅ Modales Admin */}
            <AdminModals
                showAddAdminModal={showAddAdminModal}
                setShowAddAdminModal={setShowAddAdminModal}
                newAdmin={newAdmin}
                setNewAdmin={setNewAdmin}
                handleAddAdmin={handleAddAdmin}
                showEditModal={showEditModal}
                setShowEditModal={setShowEditModal}
                editData={editData}
                setEditData={setEditData}
                handleSaveChanges={handleSaveChanges}
                showDetailModal={showDetailModal}
                setShowDetailModal={setShowDetailModal}
                selectedDetail={selectedDetail}
            />

            {/* ✅ Modales Membres */}
            <MemberModals
                showEditModal={showEditModal}
                setShowEditModal={setShowEditModal}
                editData={editData}
                setEditData={setEditData}
                handleSaveChanges={handleSaveChanges}
                showDetailModal={showDetailModal}
                setShowDetailModal={setShowDetailModal}
                selectedDetail={selectedDetail}
            />
        </div>
    );
};

export default AdminDashboard;