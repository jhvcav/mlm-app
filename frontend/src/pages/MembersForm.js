import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [admins, setAdmins] = useState([]);
    const [members, setMembers] = useState([]);
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [newAdmin, setNewAdmin] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    // ✅ Fonction pour modifier un administrateur
    const handleEditAdmin = (admin) => {
        console.log("Modification de l'admin :", admin);
        setSelectedAdmin(admin);
        setShowEditModal(true);
    };

    // ✅ Fonction pour voir les détails d'un administrateur
    const handleViewAdmin = (admin) => {
        console.log("Affichage des détails de l'admin :", admin);
        setSelectedAdmin(admin);
        setShowDetailModal(true);
    };

    // ✅ Fonction pour supprimer un administrateur
    const handleDeleteAdmin = async (adminId) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet administrateur ?")) {
            return;
        }

        try {
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/auth/admins/${adminId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Échec de la suppression de l'administrateur.");
            }

            alert("✅ Administrateur supprimé avec succès !");
            fetchAdmins(); // Rafraîchit la liste après suppression
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

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
            const response = await fetch('https://mlm-app-jhc.fly.dev/api/auth/members');
            const data = await response.json();
            setMembers(data);
        } catch (err) {
            console.error("Erreur lors du chargement des membres :", err);
        }
    };

    useEffect(() => {
        fetchAdmins();
        fetchMembers();
    }, []);

    // ✅ Fonction pour ajouter un administrateur
    const handleAddAdmin = async () => {
        const { firstName, lastName, email, password } = newAdmin;

        if (!firstName || !lastName || !email || !password) {
            alert("❌ Tous les champs sont obligatoires !");
            return;
        }

        try {
            const response = await fetch("https://mlm-app-jhc.fly.dev/api/auth/register/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAdmin),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Échec de l'ajout de l'administrateur.");
            }

            alert("✅ Administrateur ajouté avec succès !");
            setShowAdminForm(false);
            setNewAdmin({ firstName: '', lastName: '', email: '', password: '' });

            fetchAdmins(); // Rafraîchir la liste des admins
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>🛠️ Tableau de bord Administrateur</h2>

            <button className="add-admin-button" onClick={() => setShowAdminForm(true)}>
                ➕ Inscrire un Administrateur
            </button>

            {/* ✅ Formulaire d'ajout d'admin */}
            {showAdminForm && (
                <div className="modal">
                    <h3>Créer un Administrateur</h3>
                    <input type="text" placeholder="Prénom" value={newAdmin.firstName} onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })} required />
                    <input type="text" placeholder="Nom" value={newAdmin.lastName} onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })} required />
                    <input type="email" placeholder="Email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} required />
                    <input type="password" placeholder="Mot de passe" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} required />
                    <button onClick={handleAddAdmin} className="create-admin-btn">✅ Créer Admin</button>
                    <button onClick={() => setShowAdminForm(false)} className="cancel-admin-btn">❌ Annuler</button>
                </div>
            )}

            {/* ✅ Liste des Administrateurs */}
            <h3>👨‍💼 Liste des Administrateurs</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map(admin => (
                        <tr key={admin._id}>
                            <td>{admin.firstName}</td>
                            <td>{admin.lastName}</td>
                            <td>{admin.email}</td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEditAdmin(admin)}>📝 Modifier</button>
                                <button className="view-btn" onClick={() => handleViewAdmin(admin)}>👁️ Voir Détails</button>
                                <button className="delete-btn" onClick={() => handleDeleteAdmin(admin._id)}>🗑️ Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ✅ Modale pour voir les détails */}
            {showDetailModal && selectedAdmin && (
                <div className="modal">
                    <h3>Détails de l'Administrateur</h3>
                    <p>Prénom : {selectedAdmin.firstName}</p>
                    <p>Nom : {selectedAdmin.lastName}</p>
                    <p>Email : {selectedAdmin.email}</p>
                    <button onClick={() => setShowDetailModal(false)}>❌ Fermer</button>
                </div>
            )}

            {/* ✅ Modale pour modifier un admin */}
            {showEditModal && selectedAdmin && (
                <div className="modal">
                    <h3>Modifier l'Administrateur</h3>
                    <p>Prénom : {selectedAdmin.firstName}</p>
                    <p>Nom : {selectedAdmin.lastName}</p>
                    <p>Email : {selectedAdmin.email}</p>
                    <button onClick={() => setShowEditModal(false)}>❌ Fermer</button>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;