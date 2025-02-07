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

    useEffect(() => {
        // Récupérer la liste des admins
        fetch('https://mlm-app.onrender.com/api/auth/admins')
            .then(res => res.json())
            .then(data => setAdmins(data))
            .catch(err => console.error(err));

        // Récupérer la liste des membres
        fetch('https://mlm-app.onrender.com/api/auth/members')
            .then(res => res.json())
            .then(data => setMembers(data))
            .catch(err => console.error(err));
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
            setAdmins([...admins, data]);
            setShowAdminForm(false);
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
                    <input type="text" placeholder="Prénom" onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })} required />
                    <input type="text" placeholder="Nom" onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })} required />
                    <input type="email" placeholder="Email" onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} required />
                    <input type="password" placeholder="Mot de passe" onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} required />
                    <button onClick={handleAddAdmin}>✅ Créer Admin</button>
                    <button onClick={() => setShowAdminForm(false)} style={{ backgroundColor: "red" }}>❌ Annuler</button>
                </div>
            )}

            {/* Liste des Admins */}
            <h3>👨‍💼 Liste des Administrateurs</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map(admin => (
                        <tr key={admin._id}>
                            <td>{admin.firstName} {admin.lastName}</td>
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
        </div>
    );
};

export default AdminDashboard;