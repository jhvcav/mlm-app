import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return (
        <nav className="navbar">
            <ul className="nav-list">

                <li><Link to="/">🏠 Accueil</Link></li>
                <li><Link to="/members">👥 Membres</Link></li>
                <li><Link to="/members-form">👤 Ajouter un membre</Link></li>
                <li><Link to="/members-table">📋 Liste des membres</Link></li>
                <li><Link to="/products">🛍️ Produits</Link></li>
                <li><Link to="/wallets">💳 Wallets</Link></li>
                <li><Link to="/progress">📈 Progression</Link></li>
                {user && user.role === "admin" && (
                    <li><Link to="/register-admin">➕ Ajouter Admin</Link></li>
                )}
                <li><button onClick={() => { localStorage.clear(); window.location.href = "/login"; }}>🚪 Déconnexion</button></li>
            </ul>
        </nav>
    );
};

export default Navbar;