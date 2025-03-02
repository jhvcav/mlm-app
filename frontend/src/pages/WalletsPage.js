import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Importer useNavigate

const WalletsPage = () => {
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const memberId = user ? user._id : null;
    const navigate = useNavigate(); // ✅ Initialiser la navigation

    useEffect(() => {
        if (!memberId) {
            setError("⛔ Impossible de récupérer l'ID du membre.");
            setLoading(false);
            return;
        }

        const fetchWallets = async () => {
            try {
                const token = localStorage.getItem("token"); 
                const url = `https://mlm-app-jhc.fly.dev/api/wallets/member/${memberId}`;

                const response = await fetch(url, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Erreur inconnue lors de la récupération des wallets.");
                }

                if (!data.wallets || !Array.isArray(data.wallets)) {
                    throw new Error("❌ L'API ne renvoie pas un tableau de wallets.");
                }

                setWallets(data.wallets);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWallets();
    }, [memberId]);

    // ✅ Fonction pour naviguer vers WalletForm.js avec les infos du wallet
    const openWalletForm = (wallet) => {
        navigate(`/Wallets-form`, { state: { wallet } });
    };

    return (
        <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
            <h1 style={{ textAlign: "center" }}>💰 Mes Wallets</h1>
            
            <p style={{ fontWeight: "bold", textAlign: "center" }}>
                🔍 ID du membre : {memberId ? memberId : "❌ Aucun ID trouvé"}
            </p>

            {loading && <p style={{ textAlign: "center" }}>⏳ Chargement...</p>}
            {error && <p style={{ color: "red", textAlign: "center" }}>❌ {error}</p>}

            <h2 style={{ textAlign: "center" }}>📌 Liste des Wallets</h2>

            {wallets.length > 0 ? (
                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "20px",
                    backgroundColor: "#f8f9fa"
                }}>
                    <thead>
                        <tr style={{ backgroundColor: "#007bff", color: "white", textAlign: "center" }}>
                            <th style={tableHeaderStyle}>📌 Nom du Wallet</th>
                            <th style={tableHeaderStyle}>🔗 Adresse Publique</th>
                            <th style={tableHeaderStyle}>🔑 Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wallets.map(wallet => (
                            <tr key={wallet._id} style={tableRowStyle}>
                                <td style={tableCellStyle}>{wallet.walletName}</td>
                                <td style={tableCellStyle}>{wallet.publicAddress}</td>
                                <td style={actionCellStyle}>
                                    <button 
                                        onClick={() => openWalletForm(wallet)} 
                                        style={buttonStyle}
                                    >
                                        ✍️ Modifier
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={{ textAlign: "center", color: "red" }}>⚠️ Aucun wallet trouvé pour cet utilisateur.</p>
            )}
        </div>
    );
};

// ✅ Styles pour le tableau
const tableHeaderStyle = {
    padding: "12px",
    textAlign: "center",
    borderBottom: "2px solid white"
};

const tableCellStyle = {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    textAlign: "left"
};

const actionCellStyle = {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    textAlign: "center"
};

const tableRowStyle = {
    backgroundColor: "#ffffff"
};

const buttonStyle = {
    padding: "5px 10px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#28a745",
    color: "white",
    fontSize: "14px"
};

export default WalletsPage;