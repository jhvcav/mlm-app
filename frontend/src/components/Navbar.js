import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return null;  // ✅ Ne pas afficher la barre si aucun utilisateur n'est connecté
    }

    const handleLogout = () => {
        localStorage.clear();  // 🧹 Supprime les données locales
        window.location.href = "/#/login";  // 🔄 Redirection vers la page de connexion
    };

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li><Link to="/">🏠 Accueil</Link></li>

                {user.role === "superadmin" && (
                    <li><Link to="/#/superadmin-dashboard">🔑 Super Admin</Link></li>
                )}

                {user.role === "admin" && (
                    <li><Link to="/#/admin-dashboard">⚙️ Admin</Link></li>
                )}

                {user.role === "member" && (
                    <li><Link to="/#/member-dashboard">👤 Membre</Link></li>
                )}

                <li><Link to="/#/products">🛍️ Produits</Link></li>
                <li><Link to="/#/wallets">💳 Wallets</Link></li>
                <li><Link to="/#/progress">📈 Progression</Link></li>

                {/* ✅ Bouton Déconnexion */}
                <li><button onClick={handleLogout}>🚪 Déconnexion</button></li>
            </ul>
        </nav>
    );
};

export default Navbar;