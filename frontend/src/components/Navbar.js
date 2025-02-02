import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li><Link to="/">🏠 Accueil</Link></li>
                <li><Link to="/members-form">👤 Ajouter un membre</Link></li>
                <li><Link to="/members-table">📋 Liste des membres</Link></li>
                <li><Link to="/products">🛍️ Produits</Link></li>
                <li><Link to="/wallets">💳 Wallets</Link></li>
                <li><Link to="/progress">📈 Progression</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;