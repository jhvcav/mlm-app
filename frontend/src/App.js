import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MembersPage from './pages/MembersPage';
import ProductsPage from './pages/ProductsPage';
import WalletsPage from './pages/WalletsPage';
import ProgressPage from './pages/ProgressPage';
import MembersForm from './pages/MembersForm';
import MembersTable from './pages/MembersTable';
import Dashboard from "./pages/Dashboard";
import WalletForm from './pages/WalletForm';
import NetworkTree from './pages/NetworkTree';
import NetworkTable from './pages/NetworkTable';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminRegister from './pages/AdminRegister';

import './styles.css';

// ✅ Middleware pour protéger les routes selon le rôle
const PrivateRoute = ({ element, role }) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || (role && user.role !== role)) {
        return <Navigate to="/login" />;
    }

    return element;
};

// ✅ Page d'accueil avec boutons "Connexion" et "Inscription"
const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1>Bienvenue sur l'application MLM</h1>
            <div className="auth-buttons">
                <button onClick={() => navigate("/login")}>🔑 Se connecter</button>
                <button onClick={() => navigate("/register")}>📝 S'inscrire</button>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="container">
                
                {/* ✅ Barre de navigation rapide vers le réseau */}
                <nav className="network-navigation">
                    <Link to="/network" className="network-btn">📋 Tableau du Réseau</Link>
                    <Link to="/network-tree" className="network-btn">🌳 Arbre du Réseau</Link>
                </nav>

                <Routes>
                    {/* ✅ Page d'accueil */}
                    <Route path="/" element={<Home />} />

                    {/* ✅ Page de connexion et inscription */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* ✅ Routes protégées accessibles uniquement aux membres */}
                    <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} role="member" />} />
                    <Route path="/members" element={<PrivateRoute element={<MembersPage />} role="member" />} />
                    <Route path="/members-form" element={<PrivateRoute element={<MembersForm />} role="member" />} />
                    <Route path="/members-table" element={<PrivateRoute element={<MembersTable />} role="member" />} />
                    <Route path="/products" element={<PrivateRoute element={<ProductsPage />} role="member" />} />
                    <Route path="/wallets" element={<PrivateRoute element={<WalletsPage />} role="member" />} />
                    <Route path="/progress" element={<PrivateRoute element={<ProgressPage />} role="member" />} />
                    <Route path="/wallets-form" element={<PrivateRoute element={<WalletForm />} role="member" />} />
                    <Route path="/network" element={<PrivateRoute element={<NetworkTable />} role="member" />} />
                    <Route path="/network-tree" element={<PrivateRoute element={<NetworkTree />} role="member" />} />

                    {/* ✅ Route pour l'inscription des administrateurs (seulement pour admin) */}
                    <Route path="/register-admin" element={<PrivateRoute element={<AdminRegister />} role="admin" />} />

                    {/* ✅ Route pour le dashboard admin (uniquement admin) */}
                    <Route path="/admin-dashboard" element={<PrivateRoute element={<AdminDashboard />} role="admin" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;