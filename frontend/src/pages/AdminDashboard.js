import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [admins, setAdmins] = useState([]);
    const [members, setMembers] = useState([]);
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [newPassword, setNewPassword] = useState(""); // 🔑 Champ pour modifier le mot de passe
    const [newAdmin, setNewAdmin] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        fetchAdmins();
        fetchMembers();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await fetch('https://mlm-app.onrender.com/api/auth/admins');
            const data = await response.json();
            setAdmins(data);
        } catch (err) {
            console.error("Erreur lors du chargement des administrateurs :", err);
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await fetch('https://mlm-app.onrender.com/api/auth/members');
            const data = await response.json();
            setMembers(data);
        } catch (err) {
            console.error("Erreur lors du chargement des membres :", err);
        }
    };

    // ✅ Ajout d'un nouvel administrateur
    const handleAddAdmin = async () => {
        const { firstName, lastName, email, password } = newAdmin;

        if (!firstName || !lastName || !email || !password) {
            alert("❌ Tous les champs sont obligatoires !");
            return;
        }

        try {
            const response = await fetch("https://mlm-app.onrender.com/api/auth/register/admin", {
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

            // Rafraîchir la liste des admins après ajout
            fetchAdmins();
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    const handleEditAdmin = (admin) => {
        setSelectedAdmin(admin);
        setNewPassword(""); // Réinitialiser le champ mot de passe
        setShowEditModal(true);
    };

    const handleViewAdmin = (admin) => {
        setSelectedAdmin(admin);
        setShowDetailModal(true);
    };

    const handleUpdateAdmin = async () => {
        try {
            const updatedAdmin = { ...selectedAdmin };
            if (newPassword) {
                updatedAdmin.password = newPassword; // 🔑 Ajout de la mise à jour du mot de passe
            }

            const response = await fetch(`https://mlm-app.onrender.com/api/auth/admin/${selectedAdmin._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedAdmin),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Échec de la mise à jour.");

            alert("✅ Administrateur mis à jour !");
            setShowEditModal(false);
            fetchAdmins();
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>🛠️ Tableau de bord Administrateur</h2>

            <button 
                className="add-admin-button" 
                onClick={() => setShowAdminForm(true)}
            >
                 ➕ Inscrire un Administrateur
            </button>

            {showAdminForm && (
                <div className="modal">
                    <h3>Créer un Administrateur</h3>
                    <input type="text" placeholder="Prénom" value={newAdmin.firstName} onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })} required />
                    <input type="text" placeholder="Nom" value={newAdmin.lastName} onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })} required />
                    <input type="email" placeholder="Email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} required />
                    <input type="password" placeholder="Mot de passe" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} required />
                    <button onClick={handleAddAdmin}>✅ Créer Admin</button>
                    <button onClick={() => setShowAdminForm(false)} className="cancel-btn">❌ Annuler</button>
                </div>
            )}

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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showEditModal && selectedAdmin && (
                <div className="modal">
                    <h3>Modifier l'Administrateur</h3>
                    <input type="text" value={selectedAdmin.firstName} onChange={(e) => setSelectedAdmin({ ...selectedAdmin, firstName: e.target.value })} placeholder="Prénom" />
                    <input type="text" value={selectedAdmin.lastName} onChange={(e) => setSelectedAdmin({ ...selectedAdmin, lastName: e.target.value })} placeholder="Nom" />
                    <input type="email" value={selectedAdmin.email} onChange={(e) => setSelectedAdmin({ ...selectedAdmin, email: e.target.value })} placeholder="Email" />

                    {/* ✅ Ajout du champ pour modifier le mot de passe */}
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nouveau mot de passe (optionnel)" />

                    <button onClick={handleUpdateAdmin}>✅ Enregistrer</button>
                    <button onClick={() => setShowEditModal(false)} className="cancel-btn">❌ Annuler</button>
                </div>
            )}

            {showDetailModal && selectedAdmin && (
                <div className="modal">
                    <h3>Détails de l'Administrateur</h3>
                    <p><strong>Nom :</strong> {selectedAdmin.firstName} {selectedAdmin.lastName}</p>
                    <p><strong>Email :</strong> {selectedAdmin.email}</p>
                    <button onClick={() => setShowDetailModal(false)} className="cancel-btn">❌ Fermer</button>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;