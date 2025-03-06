import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WalletEnr = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const wallet = location.state ? location.state.wallet : null;

    // ✅ États pour les champs modifiables
    const [walletName, setWalletName] = useState(wallet ? wallet.walletName : "");
    const [publicAddress, setPublicAddress] = useState(wallet ? wallet.publicAddress : "");
    const [encryptedPassword, setEncryptedPassword] = useState(wallet ? wallet.encryptedPassword : "");
    const [secretPhrase, setSecretPhrase] = useState(wallet ? wallet.secretPhrase : "");

    // ✅ Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const url = `https://mlm-app-jhc.fly.dev/api/wallets/${wallet._id}`;

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    walletName,
                    publicAddress,
                    encryptedPassword,
                    secretPhrase
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur lors de la mise à jour du wallet.");
            }

            alert("✅ Wallet mis à jour avec succès !");
            navigate("/Wallets-page"); // ✅ Retour à la liste des wallets après modification
        } catch (error) {
            alert(`❌ Erreur : ${error.message}`);
        }
    };

    return (
        <div style={containerStyle}>
            <h1 style={{ textAlign: "center" }}>📝 Enregistrer un Wallet</h1>

            {wallet ? (
                <form onSubmit={handleSubmit} style={formStyle}>
                    <label style={labelStyle}>📌 Nom du Wallet :</label>
                    <input 
                        type="text" 
                        value={walletName} 
                        onChange={(e) => setWalletName(e.target.value)} 
                        required
                        style={inputStyle}
                    />

                    <label style={labelStyle}>🔗 Adresse Publique :</label>
                    <input 
                        type="text" 
                        value={publicAddress} 
                        onChange={(e) => setPublicAddress(e.target.value)} 
                        required
                        style={inputStyle}
                    />

                    <label style={labelStyle}>🔑 Mot de Passe :</label>
                    <input 
                        type="text" 
                        value={encryptedPassword} 
                        onChange={(e) => setEncryptedPassword(e.target.value)} 
                        placeholder="Laissez vide si inchangé"
                        style={inputStyle}
                    />

                    <label style={labelStyle}>🛡️ Phrase Secrète :</label>
                    <textarea 
                        value={secretPhrase} 
                        onChange={(e) => setSecretPhrase(e.target.value)} 
                        placeholder="Laissez vide si inchangé"
                        style={textareaStyle}
                    />

                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <button type="submit" style={saveButtonStyle}>💾 Enregistrer</button>
                        <button 
                            type="button" 
                            onClick={() => navigate("/Wallets-page")}
                            style={cancelButtonStyle}
                        >
                            ❌ Annuler
                        </button>
                    </div>
                </form>
            ) : (
                <p style={{ color: "red", textAlign: "center" }}>❌ Aucun wallet sélectionné.</p>
            )}
        </div>
    );
};

// ✅ Styles CSS
const containerStyle = {
    maxWidth: "500px",  // ✅ Réduction de la largeur (avant 600px)
    margin: "50px auto",  // ✅ Descend le container (ajout de marge en haut)
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
};

const formStyle = {
    display: "flex",
    flexDirection: "column"
};

const labelStyle = {
    marginTop: "10px",
    fontWeight: "bold"
};

const inputStyle = {
    width: "100%",  // ✅ Réduction de la largeur pour éviter qu'il touche les bords
    padding: "10px",
    margin: "5px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxSizing: "border-box" // ✅ Empêche le padding d'affecter la largeur
};

const saveButtonStyle = {
    padding: "10px 20px",
    margin: "5px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#28a745",
    color: "white",
    fontSize: "16px"
};

const cancelButtonStyle = {
    padding: "10px 20px",
    margin: "5px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#dc3545",
    color: "white",
    fontSize: "16px"
};

const textareaStyle = {
    padding: "10px",
    margin: "5px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    height: "80px", // ✅ Hauteur augmentée
    resize: "vertical" // ✅ Permet à l'utilisateur d'agrandir si besoin
};

export default WalletEnr;