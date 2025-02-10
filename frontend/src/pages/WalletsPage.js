import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WalletsPage.css';

const API_URL = "https://mlm-app-jhc.fly.dev/api/wallets";

const WalletsPage = () => {
    const [wallets, setWallets] = useState([]);
    const [selectedWalletId, setSelectedWalletId] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const navigate = useNavigate();

    // Charger la liste des wallets
    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setWallets(data))
            .catch(err => console.error("❌ Erreur chargement des wallets :", err));
    }, []);

    // Fonction pour vérifier le mot de passe du wallet sélectionné
    const checkPassword = async () => {
        if (!selectedWalletId) {
            alert("❌ Veuillez sélectionner un wallet !");
            return;
        }
        if (!enteredPassword) {
            alert("❌ Veuillez entrer un mot de passe !");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/verify-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletId: selectedWalletId, passwordToCheck: enteredPassword })
            });

            const data = await response.json();
            if (response.ok) {
                alert("✅ Mot de passe correct !");
            } else {
                alert("❌ Mot de passe incorrect !");
            }
        } catch (error) {
            console.error("❌ Erreur lors de la vérification du mot de passe :", error);
            alert("❌ Erreur interne du serveur.");
        }
    };

    return (
        <div className="wallets-container">
            <h2>💰 Liste des Wallets</h2>

            {/* Bouton pour ajouter un Wallet */}
            <button onClick={() => navigate('/wallets-form')} className="add-wallet-btn">
                ➕ Ajouter un Wallet
            </button>

            {/* Tableau des wallets */}
            <table className="wallets-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Adresse Publique</th>
                        <th>Propriétaire</th>
                    </tr>
                </thead>
                <tbody>
                    {wallets.length > 0 ? (
                        wallets.map(wallet => (
                            <tr key={wallet._id}>
                                <td>{wallet.walletName}</td>
                                <td>{wallet.publicAddress}</td>
                                <td>{wallet.ownerId ? `${wallet.ownerId.firstName} ${wallet.ownerId.name}` : "Aucun"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">Aucun wallet enregistré.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Vérification du mot de passe */}
            {wallets.length > 0 && (
                <div className="wallet-verification">
                    <h3>🔑 Vérifier votre wallet</h3>

                    {/* Sélectionner un wallet */}
                    <select onChange={(e) => setSelectedWalletId(e.target.value)} value={selectedWalletId}>
                        <option value="">-- Sélectionnez un wallet --</option>
                        {wallets.map(wallet => (
                            <option key={wallet._id} value={wallet._id}>
                                {wallet.walletName} ({wallet.publicAddress})
                            </option>
                        ))}
                    </select>

                    {/* Champ de saisie du mot de passe */}
                    <input
                        type="password"
                        placeholder="Entrez votre mot de passe"
                        value={enteredPassword}
                        onChange={(e) => setEnteredPassword(e.target.value)}
                    />
                    
                    {/* Bouton de vérification */}
                    <button onClick={checkPassword}>✅ Vérifier</button>
                </div>
            )}
        </div>
    );
};

export default WalletsPage;