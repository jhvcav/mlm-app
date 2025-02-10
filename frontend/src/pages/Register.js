import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error] = useState('');
    const [password, setPassword] = useState('');
    const [success] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
    
        const response = await fetch("http://mlm-app-jhc.fly.dev/api/auth/register/member", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName,
                name,
                email,
                password,
                phone, // Ajout du champ manquant
            }),
        });
    
        const data = await response.json();
        if (response.ok) {
            alert("✅ Inscription réussie !");
            navigate("/login");
        } else {
            alert("❌ Erreur : " + data.error);
        }
    };

    return (
        <div className="register-container">
            <h2>📝 Inscription</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleRegister}>
                <input 
                    type="text" 
                    placeholder="Prénom" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Nom" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
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
                <input 
                    type="text" 
                    placeholder="Téléphone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                />
                <button type="submit">S'inscrire</button>
            </form>
        </div>
    );
};

export default Register;