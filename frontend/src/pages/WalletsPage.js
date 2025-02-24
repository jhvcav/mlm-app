import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './WalletsPage.css';

const WalletsPage = () => {
    let { memberId } = useParams();
    const navigate = useNavigate();
    const [wallets, setWallets] = useState([]);

    // 🔹 Si `memberId` est `undefined`, essayer de le récupérer depuis `localStorage`
    if (!memberId) {
        memberId = localStorage.getItem("memberId");
    }

    // 🔹 Vérification de `memberId` et de l’URL
    alert("🔗 URL actuelle : " + window.location.href);
    alert("🆔 ID du membre récupéré : " + memberId);

    useEffect(() => {
        if (!memberId) {
            alert("❌ Aucun ID membre trouvé !");
            return;
        }

        const API_URL = `https://mlm-app-jhc.fly.dev/api/wallets/member/${memberId}`;
        alert("📡 Requête envoyée à : " + API_URL);

        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                alert("✅ Données reçues de l'API : " + JSON.stringify(data));
                setWallets(data);
            })
            .catch(err => alert("❌ Erreur chargement des wallets : " + err));
    }, [memberId]);

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
        </div>
    );
};

export default WalletsPage;