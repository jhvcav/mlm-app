import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ✅ Récupérer la liste des membres
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch('https://mlm-app.onrender.com/api/auth/members');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Impossible de récupérer les membres.");
                }

                setMembers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    // ✅ Ajouter un membre (similaire à la requête API)
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
            setMembers([...members, data]); // Ajout dynamique du nouveau membre
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    // ✅ Supprimer un membre
    const handleDeleteMember = async (memberId) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce membre ?")) return;

        try {
            const response = await fetch(`https://mlm-app.onrender.com/api/auth/member/${memberId}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Échec de la suppression.");
            }

            alert("✅ Membre supprimé !");
            setMembers(members.filter(member => member._id !== memberId));
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    // ✅ Voir l'arbre réseau d'un membre
    const handleViewNetwork = async (memberId) => {
        try {
            const response = await fetch(`https://mlm-app.onrender.com/api/auth/network/${memberId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Impossible d'afficher l'arbre réseau.");
            }

            alert(`📌 Réseau de ${data.firstName} ${data.lastName} :\n${JSON.stringify(data, null, 2)}`);
        } catch (err) {
            alert(`❌ Erreur: ${err.message}`);
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>🛠️ Tableau de bord Administrateur</h2>
            <p>Bienvenue, Admin ! Gérez les membres, produits et transactions ici.</p>

            <button onClick={handleAddMember} style={{ marginBottom: "10px", backgroundColor: "#28a745", color: "white", padding: "10px", borderRadius: "5px" }}>
                ➕ Ajouter un Membre
            </button>

            {loading ? <p>⏳ Chargement des membres...</p> : error ? <p className="error">{error}</p> : (
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
                                    <button onClick={() => handleDeleteMember(member._id)} style={{ backgroundColor: "red", color: "white", marginRight: "5px" }}>🗑️ Supprimer</button>
                                    <button onClick={() => handleViewNetwork(member._id)} style={{ backgroundColor: "blue", color: "white" }}>🌐 Voir Réseau</button>
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