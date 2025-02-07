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
            const response = await fetch("https://mlm-app.onrender.com/api/auth/login/admin", {
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