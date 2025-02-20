import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate(); // ✅ Redirection fluide

    const handleLogout = () => {
        localStorage.clear();  // 🧹 Supprime les données locales
        navigate("/login");  // 🔄 Redirection vers la page de connexion
    };

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li><Link to="/">🏠 Accueil</Link></li>

                {user && user.role === "superadmin" && (
                    <li><Link to="/superadmin-dashboard">🔑 Super Admin</Link></li>
                )}

                {user && user.role === "admin" && (
                    <li><Link to="/admin-dashboard">⚙️ Admin</Link></li>
                )}

                {user && user.role === "member" && (
                    <li><Link to="/member-dashboard">👤 Membre</Link></li>
                )}

                <li className="nav-item affiliates" onClick={() => navigate("/sponsored-members")}>
                👥 Membres Affiliés
                </li>

                <li><Link to="/products">🛍️ Produits</Link></li>
                <li><Link to="/wallets">💳 Wallets</Link></li>
                <li><Link to="/progress">📈 Progression</Link></li>

                {/* ✅ Bouton Déconnexion amélioré */}
                <li>
                    <button className="logout-btn" onClick={handleLogout}>
                        🚪 Déconnexion
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;