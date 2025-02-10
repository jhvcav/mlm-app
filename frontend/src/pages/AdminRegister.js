import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Vérifie si l'utilisateur connecté est un admin
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.role === "admin") {
            setIsAdmin(true);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("https://mlm-app-jhc.fly.dev/api/auth/register/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (response.ok) {
            alert("✅ Administrateur ajouté avec succès !");
            navigate('/dashboard');
        } else {
            alert("❌ " + data.error);
        }
    };

    if (!isAdmin) {
        return <h2>⛔ Accès refusé. Seuls les administrateurs peuvent ajouter d'autres administrateurs.</h2>;
    }

    return (
        <div className="admin-register-container">
            <h2>➕ Ajouter un Administrateur</h2>
            <form onSubmit={handleSubmit} className="admin-form">
                <input type="text" name="firstName" placeholder="Prénom" value={formData.firstName} onChange={handleChange} required />
                <input type="text" name="lastName" placeholder="Nom" value={formData.lastName} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />
                <button type="submit">💾 Enregistrer l'Admin</button>
            </form>
        </div>
    );
};

export default AdminRegister;