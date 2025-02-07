import React, { useState } from 'react';

const RegisterAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async () => {
        setError('');
        setSuccess('');
        try {
            const response = await fetch("https://mlm-app.onrender.com/api/auth/register/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Échec de l'inscription");
                return;
            }

            setSuccess("✅ Administrateur créé avec succès !");
        } catch (err) {
            setError("❌ Erreur réseau, veuillez réessayer.");
        }
    };

    return (
        <div className="register-container">
            <h2>🛠️ Inscription Admin</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
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
            <button type="button" onClick={handleRegister}>📝 Créer un Admin</button>
        </div>
    );
};

export default RegisterAdmin;