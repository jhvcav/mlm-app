import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from './pages/Login';
import RegisterAdmin from './pages/RegisterAdmin';
import MembersPage from './pages/MembersPage';

// ✅ Middleware pour protéger les routes selon le rôle
const PrivateRoute = ({ element, role }) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || (role && user.role !== role)) {
        return <Navigate to="/login" />;
    }

    return element;
};

const App = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <Router>
            <Navbar />
            <div className="container">
                <Routes>
                    {/* ✅ Page de connexion */}
                    <Route path="/login" element={<Login />} />

                    {/* ✅ Redirection automatique vers login si non connecté */}
                    <Route path="/" element={<Navigate to="/login" />} />

                    {/* ✅ Routes protégées */}
                    <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} role="member" />} />
                    <Route path="/admin-dashboard" element={<PrivateRoute element={<AdminDashboard />} role="admin" />} />
                    <Route path="/members" element={<PrivateRoute element={<MembersPage />} role="admin" />} />
                    <Route path="/register-admin" element={<PrivateRoute element={<RegisterAdmin />} role="admin" />} />
                </Routes>

                {/* ✅ Afficher l'inscription admin SEULEMENT si c'est un Admin connecté */}
                {user && user.role === "admin" && (
                    <div className="admin-panel">
                        <Link to="/register-admin" className="btn-admin">⚙️ Inscription Admin</Link>
                        <Link to="/members" className="btn-admin">📋 Gérer les membres</Link>
                    </div>
                )}
            </div>
        </Router>
    );
};

export default App;