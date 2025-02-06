import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (role) => {
        setError('');
        const endpoint = role === "admin" ? "/api/auth/login/admin" : "/api/auth/login/member";

        if (!email || !password) {
            setError("❌ Veuillez remplir tous les champs.");
            return;
        }

        if (!endpoint) {
            setError("❌ Problème avec l'URL de connexion.");
            return;
        }

        try {
            console.log("🔍 Vérification des valeurs envoyées :", { endpoint, email, password });

            const response = await fetch(`https://mlm-app.onrender.com${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const text = await response.text();
            console.log("📩 Réponse brute du serveur :", text);

            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                setError("❌ Réponse invalide du serveur.");
                console.error("❌ Erreur JSON :", err);
                return;
            }

            if (!response.ok) {
                console.error("❌ Erreur de connexion :", data);
                alert(`❌ Erreur: ${data.error || "Échec de connexion"}`);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("✅ Connexion réussie !");
            navigate(role === "admin" ? "/admin-dashboard" : "/dashboard");
        } catch (err) {
            setError("❌ Erreur réseau : " + err.message);
            console.error("❌ Erreur réseau :", err);
        }
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
                <div className='login-button'>
                    <button type="button" onClick={() => handleLogin("member")}>👤 Connexion Membre</button>
                    <button type="button" onClick={() => handleLogin("admin")}>🛠️ Connexion Admin</button>
                    <button type="button" onClick={() => navigate("/register-admin")}>
                    🛠️ Inscription Admin
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;