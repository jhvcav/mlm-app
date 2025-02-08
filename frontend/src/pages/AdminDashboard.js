import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [admins, setAdmins] = useState([]);
    const [members, setMembers] = useState([]);
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [newAdmin, setNewAdmin] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    // ✅ Fonction pour récupérer les administrateurs
    const fetchAdmins = async () => {
        try {
            const response = await fetch('https://mlm-app.onrender.com/api/auth/admins');
            const data = await response.json();
            setAdmins(data);
        } catch (err) {
            console.error("Erreur lors du chargement des administrateurs :", err);
        }
    };

    // ✅ Fonction pour récupérer les membres
    const fetchMembers = async () => {
        try {
            const response = await fetch('https://mlm-app.onrender.com/api/auth/members');
            const data = await response.json();
            setMembers(data);
        } catch (err) {
            console.error("Erreur lors du chargement des membres :", err);
        }
    };

    // ✅ useEffect pour charger les admins et les membres au montage du composant
    useEffect(() => {
        fetchAdmins();
        fetchMembers();
    }, []);

    // ✅ Gérer l'ajout d'un administrateur
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

            // ✅ Rafraîchir la liste des admins après ajout
            fetchAdmins();
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>🛠️ Tableau de bord Administrateur</h2>

            {/* 🚀 Bouton pour afficher le formulaire d'inscription admin */}
            <button onClick={() => setShowAdminForm(true)} style={{ backgroundColor: "#28a745", color: "white", padding: "10px", borderRadius: "5px" }}>
                ➕ Inscrire un Administrateur
            </button>

            {/* ✅ Formulaire d'ajout d'admin (fenêtre modale) */}
            {showAdminForm && (
                <div className="modal">
                    <h3>Créer un Administrateur</h3>
                    <input 
                        type="text" 
                        placeholder="Prénom" 
                        value={newAdmin.firstName} 
                        onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })} 
                        required 
                    />
                    <input 
                        type="text" 
                        placeholder="Nom" 
                        value={newAdmin.lastName} 
                        onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })} 
                        required 
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={newAdmin.email} 
                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Mot de passe" 
                        value={newAdmin.password} 
                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} 
                        required 
                    />
                    <button onClick={handleAddAdmin}>✅ Créer Admin</button>
                    <button onClick={() => setShowAdminForm(false)} style={{ backgroundColor: "red" }}>❌ Annuler</button>
                </div>
            )}

            {/* Liste des Admins */}
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
                                <button>📝 Modifier</button>
                                <button>👁️ Voir Détails</button>
                                <button>🗑️ Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Liste des Membres */}
            <h3>👥 Liste des Membres</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map(member => (
                        <tr key={member._id}>
                            <td>{member.firstName}</td>
                            <td>{member.lastName}</td>
                            <td>{member.email}</td>
                            <td>{member.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;