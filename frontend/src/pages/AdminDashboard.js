import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [admins, setAdmins] = useState([]);
    const [members, setMembers] = useState([]);
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [newAdmin, setNewAdmin] = useState({ firstName: '', lastName: '', email: '', password: '' });

    // ✅ Récupération des administrateurs
    const fetchAdmins = async () => {
        try {
            const response = await fetch('https://mlm-app-jhc.fly.dev/api/auth/admins');
            const data = await response.json();
            setAdmins(data);
        } catch (err) {
            console.error("Erreur lors du chargement des administrateurs :", err);
        }
    };

    // ✅ Récupération des membres
    const fetchMembers = async () => {
        try {
            const response = await fetch('https://mlm-app-jhc.fly.dev/api/members');
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

        const url = data.role ? `https://mlm-app-jhc.fly.dev/api/auth/admins/${data._id}` : `https://mlm-app-jhc.fly.dev/api/auth/members/${data._id}`;

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
        let url = editData.role ? `https://mlm-app-jhc.fly.dev/api/auth/admins/${editData._id}` : `https://mlm-app-jhc.fly.dev/api/auth/members/${editData._id}`;

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
            <button className="add-admin-button" onClick={() => setShowAddAdminModal(true)}>➕ Inscrire un Administrateur</button>

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
                                <button className="edit-btn" onClick={() => handleEdit(admin)}>📝 Modifier</button>
                                <button className="view-btn" onClick={() => handleViewDetails(admin)}>👁️ Voir Détails</button>
                                <button className="delete-btn" onClick={() => handleDelete(admin)}>🗑️ Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ✅ Liste des Membres */}
            <h3>👥 Liste des Membres</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map(member => (
                        <tr key={member._id}>
                            <td>{member.firstName}</td>
                            <td>{member.lastName}</td>
                            <td>{member.email}</td>
                            <td>{member.phone}</td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEdit(member)}>📝 Modifier</button>
                                <button className="view-btn" onClick={() => handleViewDetails(member)}>👁️ Voir Détails</button>
                                <button className="delete-btn" onClick={() => handleDelete(member)}>🗑️ Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ✅ Modale d'inscription Admin */}
            {showAddAdminModal && (
                <div className="modal">
                    <h3>Ajouter un Administrateur</h3>
                    <input type="text" placeholder="Prénom" value={newAdmin.firstName} onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })} />
                    <input type="text" placeholder="Nom" value={newAdmin.lastName} onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })} />
                    <input type="email" placeholder="Email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} />
                    <input type="password" placeholder="Mot de passe" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} />
                    <button onClick={handleAddAdmin}>✅ Enregistrer</button>
                    <button onClick={() => setShowAddAdminModal(false)}>❌ Annuler</button>
                </div>
            )}

            {/* ✅ Modale de modification */}
            {showEditModal && editData && (
                <div className="modal">
                    <h3>Modifier {editData.role ? "Administrateur" : "Membre"}</h3>
                    <input type="text" value={editData.firstName} onChange={(e) => setEditData({ ...editData, firstName: e.target.value })} />
                    <input type="text" value={editData.lastName} onChange={(e) => setEditData({ ...editData, lastName: e.target.value })} />
                    <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                    <input type="password" placeholder="Nouveau mot de passe (optionnel)" onChange={(e) => setEditData({ ...editData, password: e.target.value })} />
                    <button onClick={handleSaveChanges}>✅ Enregistrer</button>
                    <button onClick={() => setShowEditModal(false)}>❌ Annuler</button>
                </div>
            )}

            {/* ✅ Modale pour voir les détails */}
            {showDetailModal && selectedDetail && (
                <div className="modal">
                    <h3>Détails de {selectedDetail.role ? "l'Administrateur" : "du Membre"}</h3>
                    <p><strong>Prénom :</strong> {selectedDetail.firstName}</p>
                    <p><strong>Nom :</strong> {selectedDetail.lastName}</p>
                    <p><strong>Email :</strong> {selectedDetail.email}</p>
                    {!selectedDetail.role && <p><strong>Téléphone :</strong> {selectedDetail.phone}</p>}
                    <button onClick={() => setShowDetailModal(false)}>❌ Fermer</button>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;