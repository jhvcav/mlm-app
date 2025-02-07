import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [members, setMembers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [error, setError] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("https://mlm-app.onrender.com/api/auth/admin/dashboard", {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || "Erreur lors de la récupération des données.");
                    return;
                }

                setStats(data.stats);
                setMembers(data.members);
                setAdmins(data.admins);
                setWallets(data.wallets);
            } catch (err) {
                setError("❌ Erreur réseau, veuillez réessayer.");
            }
        };

        fetchDashboardData();
    }, []);

    // ✅ Fonction pour réinitialiser un mot de passe
    const resetPassword = async (id) => {
        if (!newPassword) {
            alert("❌ Veuillez entrer un nouveau mot de passe.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`https://mlm-app.onrender.com/api/auth/reset-password/${id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(`❌ Erreur: ${data.error || "Échec de la réinitialisation"}`);
                return;
            }

            alert("✅ Mot de passe réinitialisé avec succès !");
            setNewPassword('');
            setSelectedMember(null);
        } catch (err) {
            alert("❌ Erreur réseau.");
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>🛠️ Tableau de Bord Administrateur</h2>
            {error && <p className="error">{error}</p>}

            {stats ? (
                <div>
                    <h3>📊 Statistiques</h3>
                    <ul>
                        <li>👥 Membres : {stats.totalMembers}</li>
                        <li>👨‍💼 Administrateurs : {stats.totalAdmins}</li>
                        <li>💰 Wallets créés : {stats.totalWallets}</li>
                        <li>📦 Produits : {stats.totalProducts}</li>
                    </ul>

                    <h3>👥 Liste des Membres</h3>
                    <ul>
                        {members.map(member => (
                            <li key={member._id}>
                                {member.firstName} {member.lastName} - {member.email} 
                                <button onClick={() => setSelectedMember(member)}>🔑 Réinitialiser mot de passe</button>
                            </li>
                        ))}
                    </ul>

                    <h3>🔒 Administrateurs</h3>
                    <ul>
                        {admins.map(admin => (
                            <li key={admin._id}>
                                {admin.firstName} {admin.lastName} - {admin.email}
                            </li>
                        ))}
                    </ul>

                    <h3>💰 Wallets</h3>
                    <ul>
                        {wallets.map(wallet => (
                            <li key={wallet._id}>
                                {wallet.walletName} - {wallet.publicAddress} (Membre: {wallet.ownerId})
                            </li>
                        ))}
                    </ul>

                    {selectedMember && (
                        <div className="reset-password-form">
                            <h3>🔑 Réinitialiser le mot de passe</h3>
                            <p>Utilisateur : {selectedMember.firstName} {selectedMember.lastName}</p>
                            <input 
                                type="password" 
                                placeholder="Nouveau mot de passe" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                            />
                            <button onClick={() => resetPassword(selectedMember._id)}>✅ Confirmer</button>
                            <button onClick={() => setSelectedMember(null)}>❌ Annuler</button>
                        </div>
                    )}
                </div>
            ) : (
                <p>⏳ Chargement des données...</p>
            )}
        </div>
    );
};

export default AdminDashboard;