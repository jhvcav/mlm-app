import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get("token");

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            setError("❌ Veuillez remplir tous les champs.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("❌ Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await fetch("https://mlm-app-jhc.fly.dev/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword })
            });

            const data = await response.json();
            alert(data.message || "✅ Mot de passe réinitialisé avec succès !");
            navigate("/login");
        } catch (err) {
            setError("❌ Erreur lors de la réinitialisation.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>🔄 Réinitialiser votre mot de passe</h2>
                {error && <p className="error">{error}</p>}
                <input 
                    type="password" 
                    placeholder="Nouveau mot de passe" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    className="login-input"
                />
                <input 
                    type="password" 
                    placeholder="Confirmez le mot de passe" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    className="login-input"
                />
                <button onClick={handleResetPassword} className="login-button">✅ Réinitialiser</button>
            </div>
        </div>
    );
};

export default ResetPassword;