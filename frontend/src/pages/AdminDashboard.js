import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import MembersForm from './MembersForm';  // ✅ Import du formulaire d'inscription des membres
import MembersTable from './MembersTable';  // ✅ Import du tableau des membres
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [admins, setAdmins] = useState([]);
    const [members, setMembers] = useState([]);
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [showMemberForm, setShowMemberForm] = useState(false);  // ✅ Gestion de l'affichage du formulaire membre
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const [newAdmin, setNewAdmin] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        fetchAdmins();
        fetchMembers();
        
        const token = localStorage.getItem("token");
        let user = null;
        
        try {
            user = JSON.parse(localStorage.getItem("user"));
        } catch (error) {
            console.error("Erreur JSON.parse(user):", error);
        }
    
        if (!token || (token !== "fake-admin-token" && (!user || user.role !== "admin"))) {
            console.warn("🚨 Redirection vers page de connexion !");
            navigate("/");
        }
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

    // ✅ Ajouter un administrateur (aucune modification)
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

            fetchAdmins();
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    // ✅ Ajouter un membre (aucune altération du code existant)
    const handleAddMember = async (newMemberData) => {
        try {
            const response = await fetch("https://mlm-app.onrender.com/api/auth/register/member", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMemberData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Échec de l'ajout du membre.");
            }

            alert("✅ Membre ajouté avec succès !");
            setShowMemberForm(false);
            fetchMembers();
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>🛠️ Tableau de bord Administrateur</h2>

            <div className="nav-buttons">
                <button className="add-admin-button" onClick={() => setShowAdminForm(true)}>
                     ➕ Inscrire un Administrateur
                </button>
                <button className="add-member-button" onClick={() => setShowMemberForm(true)}>
                     ➕ Ajouter un Membre
                </button>
            </div>

            {/* ✅ Formulaire d'ajout d'admin (aucune modification) */}
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

            {/* ✅ Formulaire d'ajout de membre avec le composant MembersForm */}
            {showMemberForm && (
                <div className="modal">
                    <h3>Ajouter un Membre</h3>
                    <MembersForm onAddMember={handleAddMember} />
                    <button onClick={() => setShowMemberForm(false)} className="cancel-btn">❌ Annuler</button>
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
                                <button className="edit-btn">📝 Modifier</button>
                                <button className="view-btn">👁️ Voir Détails</button>
                                <button className="delete-btn">🗑️ Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ✅ Liste des Membres avec le composant MembersTable */}
            <h3>👥 Liste des Membres</h3>
            <MembersTable members={members} />
        </div>
    );
};

export default AdminDashboard;