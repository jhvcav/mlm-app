import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import du fichier CSS pour le style

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');
        try {
            const response = await fetch("https://mlm-app-jhc.fly.dev/api/auth/login/admins", {
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
            navigate("/admin-dashboard");
        } catch (err) {
            setError("❌ Erreur réseau, veuillez réessayer.");
        }
    };

    const handleBypassAdmin = () => {
        alert("⚠️ Mode Accès direct activé !");
        localStorage.setItem("token", "fake-admin-token");
        localStorage.setItem("user", JSON.stringify({ id: "admin-bypass", email: "admin@example.com", role: "admin" }));
        navigate("/admin-dashboard");
    };

    return (
        <>
            {/* 🚀 Barre d'entête en haut */}
            <div className="header">Application de la communauté RMR-M</div>
    
            {/* 🌟 Conteneur principal */}
            <div className="login-wrapper">
                <div className="login-container">
                    <h2>🔑 Connexion</h2>
                    {error && <p className="error">{error}</p>}
                    <form className="login-form" onSubmit={(e) => e.preventDefault()}>
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
                        <button className="login-button" type="button" onClick={handleLogin}>🚀 Se connecter</button>
                    </form>
    
                    {/* 🚀 Bouton d'accès direct à l'espace admin */}
                    <button className="admin-access-button" type="button" onClick={handleBypassAdmin}>
                        ⚠️ Accès direct Admin (Test)
                    </button>
                </div>
            </div>
        </>
    );
};

export default Login;