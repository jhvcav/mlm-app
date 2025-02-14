import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css"; // ✅ Ajout du fichier CSS

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError('');
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

            // 🔄 Redirection en fonction du rôle
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

    return (
        <div className="login-container">
            <div className="login-box">
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
            </div>
        </div>
    );
};

export default Login;