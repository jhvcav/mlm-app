import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [user, setUser] = useState(null);

    // ✅ Charger l'utilisateur au montage du composant
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li><Link to="/">🏠 Accueil</Link></li>
                <li><Link to="/auth/members">👥 Membres</Link></li>
                <li><Link to="/members-form">👤 Ajouter un membre</Link></li>
                <li><Link to="/members-table">📋 Liste des membres</Link></li>
                <li><Link to="/products">🛍️ Produits</Link></li>
                <li><Link to="/wallets">💳 Wallets</Link></li>
                <li><Link to="/progress">📈 Progression</Link></li>

                {/* 🔥 Afficher uniquement si le Super Admin est connecté */}
                {user && user.role === "superadmin" && (
                    <li><Link to="/superadmin-dashboard">⚡ Super Admin</Link></li>
                )}

                {user && user.role === "member" && (
                    <li><Link to="/member-dashboard">👤 Tableau de bord Membre</Link></li>
                )}

                <li>
                    <button onClick={() => { 
                        localStorage.clear(); 
                        window.location.href = "/login"; 
                    }}>
                        🚪 Déconnexion
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;