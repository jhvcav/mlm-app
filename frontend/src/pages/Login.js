import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');
        try {
            const response = await fetch("https://mlm-app.onrender.com/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(`❌ Erreur: ${data.error || "Échec de connexion"}`);
                return;
            }

            // Stocker le token et l'utilisateur connecté
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("✅ Connexion réussie !");

            // Rediriger en fonction du rôle
            if (data.user.role === "admin") {
                navigate("/admin-dashboard"); // Dashboard admin
            } else {
                navigate("/dashboard"); // Dashboard membre
            }

        } catch (err) {
            setError("❌ Erreur réseau, veuillez réessayer.");
        }
    };

    // 🚀 Bouton pour bypasser l'authentification et accéder à l'admin
    const handleBypassAdmin = () => {
        alert("⚠️ Mode Accès direct activé ! Ceci est un accès temporaire pour les tests.");
        
        // Stocke un faux token pour simuler la connexion
        localStorage.setItem("token", "fake-admin-token");
        localStorage.setItem("user", JSON.stringify({ id: "admin-bypass", email: "admin@example.com", role: "admin" }));

        // Redirection vers le tableau de bord admin
        navigate("/admin-dashboard");
    };

    return (
        <div className="login-container">
            <h2>🔑 Connexion</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={(e) => e.preventDefault()}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Mot de passe" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="button" onClick={handleLogin}>🚀 Se connecter</button>
            </form>

            {/* 🚀 Bouton d'accès direct à l'espace admin */}
            <button 
                type="button" 
                onClick={handleBypassAdmin} 
                style={{ marginTop: "10px", backgroundColor: "#ff5733", color: "#fff", padding: "10px", borderRadius: "5px", border: "none", cursor: "pointer" }}
            >
                ⚠️ Accès direct Admin (Test)
            </button>
        </div>
    );
};

export default Login;