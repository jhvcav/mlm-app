import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [members, setMembers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    // ✅ Modifier un administrateur
    const handleEditAdmin = async (adminId) => {
        const firstName = prompt("Modifier le prénom de l'admin :");
        const lastName = prompt("Modifier le nom de l'admin :");
        const email = prompt("Modifier l'email de l'admin :");

        if (!firstName || !lastName || !email) {
            alert("❌ Tous les champs sont obligatoires !");
            return;
        }

        try {
            const response = await fetch(`https://mlm-app.onrender.com/api/auth/admin/${adminId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Échec de la modification de l'admin.");
            }

            alert("✅ Informations de l'admin mises à jour !");
            setAdmins(admins.map(admin => admin._id === adminId ? { ...admin, firstName, lastName, email } : admin));
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    // ✅ Voir les détails d'un administrateur
    const handleViewAdminDetails = async (adminId) => {
        try {
            const response = await fetch(`https://mlm-app.onrender.com/api/auth/admin/${adminId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Impossible d'afficher les détails de l'admin.");
            }

            alert(`📌 Détails de l'admin:\n${JSON.stringify(data, null, 2)}`);
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    // ✅ Supprimer un administrateur
    const handleDeleteAdmin = async (adminId) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet administrateur ?")) return;

        try {
            const response = await fetch(`https://mlm-app.onrender.com/api/auth/admin/${adminId}`, { method: "DELETE" });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Échec de la suppression de l'admin.");
            }

            alert("✅ Administrateur supprimé !");
            setAdmins(admins.filter(admin => admin._id !== adminId));
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>🛠️ Tableau de bord Administrateur</h2>
            <p>Bienvenue, Admin ! Gérez les membres, administrateurs et transactions ici.</p>

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
                                        <button onClick={() => handleDeleteAdmin(member._id)} style={{ backgroundColor: "red", color: "white", marginRight: "5px" }}>🗑️ Supprimer</button>
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
                                        <button onClick={() => handleEditAdmin(admin._id)} style={{ backgroundColor: "orange", color: "white", marginRight: "5px" }}>✏️ Modifier</button>
                                        <button onClick={() => handleViewAdminDetails(admin._id)} style={{ backgroundColor: "blue", color: "white", marginRight: "5px" }}>🔍 Détails</button>
                                        <button onClick={() => handleDeleteAdmin(admin._id)} style={{ backgroundColor: "red", color: "white" }}>🗑️ Supprimer</button>
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