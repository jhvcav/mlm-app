import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [members, setMembers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ✅ Récupérer la liste des membres et des administrateurs
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const [membersRes, adminsRes] = await Promise.all([
                    fetch('https://mlm-app.onrender.com/api/auth/members'),
                    fetch('https://mlm-app.onrender.com/api/auth/admins')
                ]);

                const membersData = await membersRes.json();
                const adminsData = await adminsRes.json();

                if (!membersRes.ok || !adminsRes.ok) {
                    throw new Error("Erreur lors de la récupération des utilisateurs.");
                }

                setMembers(membersData);
                setAdmins(adminsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // ✅ Ajouter un membre
    const handleAddMember = async () => {
        const firstName = prompt("Entrez le prénom du membre :");
        const lastName = prompt("Entrez le nom du membre :");
        const email = prompt("Entrez l'email du membre :");
        const phone = prompt("Entrez le téléphone du membre :");
        const password = prompt("Entrez un mot de passe :");

        if (!firstName || !lastName || !email || !phone || !password) {
            alert("❌ Tous les champs sont obligatoires !");
            return;
        }

        try {
            const response = await fetch("https://mlm-app.onrender.com/api/auth/register/member", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, phone, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Échec de l'ajout du membre.");
            }

            alert("✅ Membre ajouté avec succès !");
            setMembers([...members, data]); // Mise à jour dynamique
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

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

            if (!response.ok) {
                throw new Error(data.error || "Échec de l'ajout de l'admin.");
            }

            alert("✅ Administrateur ajouté avec succès !");
            setAdmins([...admins, data]); // Mise à jour dynamique
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    // ✅ Supprimer un utilisateur (Admin ou Membre)
    const handleDeleteUser = async (userId, isAdmin) => {
        if (!window.confirm(`Voulez-vous vraiment supprimer cet utilisateur ?`)) return;

        try {
            const url = isAdmin 
                ? `https://mlm-app.onrender.com/api/auth/admin/${userId}` 
                : `https://mlm-app.onrender.com/api/auth/member/${userId}`;

            const response = await fetch(url, { method: "DELETE" });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Échec de la suppression.");
            }

            alert("✅ Utilisateur supprimé !");
            isAdmin
                ? setAdmins(admins.filter(admin => admin._id !== userId))
                : setMembers(members.filter(member => member._id !== userId));

        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    // ✅ Réinitialiser le mot de passe
    const handleResetPassword = async (userId, isAdmin) => {
        const newPassword = prompt("Entrez un nouveau mot de passe :");

        if (!newPassword) {
            alert("❌ Vous devez entrer un mot de passe !");
            return;
        }

        try {
            const url = isAdmin 
                ? `https://mlm-app.onrender.com/api/auth/reset-password/admin/${userId}` 
                : `https://mlm-app.onrender.com/api/auth/reset-password/member/${userId}`;

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Échec de la réinitialisation.");
            }

            alert("✅ Mot de passe réinitialisé avec succès !");
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>🛠️ Tableau de bord Administrateur</h2>
            <p>Bienvenue, Admin ! Gérez les membres, administrateurs et transactions ici.</p>

            <button onClick={handleAddMember} className="btn-action">➕ Ajouter un Membre</button>
            <button onClick={handleAddAdmin} className="btn-action">➕ Ajouter un Admin</button>

            {loading ? <p>⏳ Chargement des utilisateurs...</p> : error ? <p className="error">{error}</p> : (
                <>
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
                                        <button onClick={() => handleResetPassword(member._id, false)}>🔑 Réinitialiser</button>
                                        <button onClick={() => handleDeleteUser(member._id, false)}>🗑️ Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3>🔑 Liste des Administrateurs</h3>
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
                                        <button onClick={() => handleResetPassword(admin._id, true)}>🔑 Réinitialiser</button>
                                        <button onClick={() => handleDeleteUser(admin._id, true)}>🗑️ Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;