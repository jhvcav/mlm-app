import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [admins, setAdmins] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ✅ Récupérer les administrateurs et les membres
    useEffect(() => {
        const fetchAdminsAndMembers = async () => {
            try {
                const [adminsRes, membersRes] = await Promise.all([
                    fetch('https://mlm-app.onrender.com/api/auth/admins'),
                    fetch('https://mlm-app.onrender.com/api/auth/members')
                ]);

                const adminsData = await adminsRes.json();
                const membersData = await membersRes.json();

                if (!adminsRes.ok) throw new Error(adminsData.error || "Erreur récupération admins.");
                if (!membersRes.ok) throw new Error(membersData.error || "Erreur récupération membres.");

                setAdmins(adminsData);
                setMembers(membersData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminsAndMembers();
    }, []);

    // ✅ Ajouter un administrateur
    const handleAddAdmin = async () => {
        const firstName = prompt("Entrez le prénom de l'admin :");
        const lastName = prompt("Entrez le nom de l'admin :");
        const email = prompt("Entrez l'email de l'admin :");
        const password = prompt("Entrez un mot de passe :");

        if (!firstName || !lastName || !email || !password) {
            alert("❌ Tous les champs sont obligatoires !");
            return;
        }

        try {
            const response = await fetch("https://mlm-app.onrender.com/api/auth/register/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Échec de l'ajout de l'admin.");

            alert("✅ Administrateur ajouté avec succès !");
            setAdmins([...admins, data]); 
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    // ✅ Modifier un administrateur
    const handleEditAdmin = async (adminId) => {
        const newEmail = prompt("Nouvel email de l'admin :");
        if (!newEmail) return;

        try {
            const response = await fetch(`https://mlm-app.onrender.com/api/auth/admin/${adminId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: newEmail }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Échec de la modification.");

            alert("✅ Administrateur modifié !");
            setAdmins(admins.map(admin => admin._id === adminId ? { ...admin, email: newEmail } : admin));
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    // ✅ Supprimer un administrateur
    const handleDeleteAdmin = async (adminId) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet administrateur ?")) return;

        try {
            const response = await fetch(`https://mlm-app.onrender.com/api/auth/admin/${adminId}`, {
                method: "DELETE"
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Échec de la suppression.");

            alert("✅ Administrateur supprimé !");
            setAdmins(admins.filter(admin => admin._id !== adminId));
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    // ✅ Modifier le mot de passe d'un admin
    const handleChangeAdminPassword = async (adminId) => {
        const newPassword = prompt("Entrez le nouveau mot de passe de l'admin :");
        if (!newPassword) return;

        try {
            const response = await fetch(`https://mlm-app.onrender.com/api/auth/admin/${adminId}/password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: newPassword }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Échec de la mise à jour du mot de passe.");

            alert("✅ Mot de passe de l'admin mis à jour !");
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>🛠️ Tableau de bord Administrateur</h2>
            <p>Bienvenue, Admin ! Gérez les administrateurs et les membres ici.</p>

            {/* ✅ Bouton pour ajouter un administrateur */}
            <button onClick={handleAddAdmin} style={{ marginBottom: "10px", backgroundColor: "#28a745", color: "white", padding: "10px", borderRadius: "5px" }}>
                ➕ Ajouter un Administrateur
            </button>

            {/* ✅ Tableau des administrateurs */}
            <h3>📋 Liste des Administrateurs</h3>
            {loading ? <p>⏳ Chargement...</p> : error ? <p className="error">{error}</p> : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Mot de passe</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map(admin => (
                            <tr key={admin._id}>
                                <td>{admin.firstName}</td>
                                <td>{admin.lastName}</td>
                                <td>{admin.email}</td>
                                <td>{admin.password}</td>
                                <td>
                                    <button onClick={() => handleEditAdmin(admin._id)}>✏️ Modifier</button>
                                    <button onClick={() => handleChangeAdminPassword(admin._id)}>🔑 Modifier MDP</button>
                                    <button onClick={() => handleDeleteAdmin(admin._id)}>🗑️ Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* ✅ Tableau des membres (affichage des mots de passe pour validation) */}
            <h3>📋 Liste des Membres</h3>
            {loading ? <p>⏳ Chargement...</p> : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Mot de passe</th>
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
                                <td>{member.password}</td>
                                <td>
                                    <button onClick={() => handleChangeAdminPassword(member._id)}>🔑 Modifier MDP</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminDashboard;