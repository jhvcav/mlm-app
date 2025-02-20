import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Ajout du fichier CSS pour le style

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError("");
        try {
            const response = await fetch("https://mlm-app-jhc.fly.dev/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(`❌ Erreur: ${data.error || "Échec de connexion"}`);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("✅ Connexion réussie !");

            if (data.user.role === "superadmin") {
                navigate("/superadmin-dashboard");
            } else if (data.user.role === "admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/member-dashboard");
            }

        } catch (err) {
            setError("❌ Erreur réseau, veuillez réessayer.");
        }
    };

    const handlePasswordReset = async () => {
        if (!resetEmail) {
            alert("❌ Veuillez entrer votre email.");
            return;
        }

        try {
            const response = await fetch("https://mlm-app-jhc.fly.dev/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: resetEmail }),
            });

            const data = await response.json();
            alert(data.message || "Un lien de réinitialisation a été envoyé !");
            setShowResetDialog(false);
        } catch (err) {
            alert("❌ Erreur lors de l'envoi du lien de réinitialisation.");
        }
    };

    return (
        <div className="login-page">
            {/* ✅ Barre en haut avec le titre "Espace Membres RMR-M" */}
            <div className="login-header">
                <h1>Espace Membres RMR-M</h1>
            </div>

            {/* ✅ Boîte de connexion centrée */}
            <div className="login-container">
                <div className="login-box">
                    <h2 className="login-title">🔑 Connexion</h2> {/* Titre boite de dialogue connexion */}
                    {error && <p className="error">{error}</p>}
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="login-input"
                        />
                        <input 
                            type="password" 
                            placeholder="Mot de passe" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="login-input"
                        />
                        <button type="button" onClick={handleLogin} className="login-button">
                            🚀 Se connecter
                        </button>
                    </form>
                    <button className="forgot-password" onClick={() => setShowResetDialog(true)}>
                        🔄 Mot de passe oublié ?
                    </button>
                </div>
            </div>

            {/* ✅ Boîte de dialogue pour la réinitialisation du mot de passe */}
            {showResetDialog && (
                <div className="reset-dialog">
                    <div className="reset-box">
                        <h3>🔄 Réinitialisation du mot de passe</h3>
                        <input 
                            type="email" 
                            placeholder="Votre email" 
                            value={resetEmail} 
                            onChange={(e) => setResetEmail(e.target.value)} 
                            required
                            className="login-input"
                        />
                        <button onClick={handlePasswordReset} className="login-button">📩 Envoyer</button>
                        <button onClick={() => setShowResetDialog(false)} className="cancel-button">❌ Annuler</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;