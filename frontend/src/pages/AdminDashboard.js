import React, { useState, useEffect } from "react";
import ManagePermissions from "../components/ManagePermissions";

const AdminDashboard = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [newMember, setNewMember] = useState({ firstName: "", lastName: "", email: "", password: "", role: "member" });

    useEffect(() => {
        fetchUsers();
    }, []);

    // ✅ Fonction pour récupérer la liste des membres
    const fetchUsers = async () => {
        try {
            const response = await fetch("https://mlm-app-jhc.fly.dev/api/members");
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error("❌ Erreur lors du chargement des membres :", err);
        }
    };

    // ✅ Fonction pour inscrire un membre (Admin ou Membre)
    const handleRegisterMember = async () => {
        try {
            const response = await fetch("https://mlm-app-jhc.fly.dev/api/members/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMember),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Échec de l'inscription.");
            }

            alert("✅ Membre inscrit avec succès !");
            setNewMember({ firstName: "", lastName: "", email: "", password: "", role: "member" });
            fetchUsers();
        } catch (err) {
            alert(`❌ Erreur : ${err.message}`);
        }
    };

    return (
        <div>
            <h1>📋 Tableau de bord Super Admin</h1>

            {/* 📌 Formulaire d'inscription d'un membre */}
            <h2>➕ Inscrire un nouveau membre</h2>
            <input type="text" placeholder="Prénom" value={newMember.firstName} onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })} />
            <input type="text" placeholder="Nom" value={newMember.lastName} onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })} />
            <input type="email" placeholder="Email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} />
            <input type="password" placeholder="Mot de passe" value={newMember.password} onChange={(e) => setNewMember({ ...newMember, password: e.target.value })} />
            <select value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}>
                <option value="member">Membre</option>
                <option value="admin">Administrateur</option>
            </select>
            <button onClick={handleRegisterMember}>✅ Inscrire</button>

            {/* 📌 Liste des membres */}
            <h2>👥 Liste des Membres</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => setSelectedUser(user)}>⚙️ Gérer Permissions</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 📌 Interface de gestion des permissions */}
            {selectedUser && (
                <div>
                    <h3>🔹 Modifier les permissions pour {selectedUser.firstName} {selectedUser.lastName}</h3>
                    <ManagePermissions 
                        userId={selectedUser._id} 
                        currentPermissions={selectedUser.permissions || {}} 
                        onPermissionsUpdated={fetchUsers} 
                    />
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;