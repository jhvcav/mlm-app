import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import Navbar from "./components/Navbar";
import { Link } from "react-router-dom"; // 🔹 Ajouté pour la navigation interne

// ✅ Middleware pour protéger les routes selon le rôle
const PrivateRoute = ({ element, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
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

                    {/* ✅ Routes protégées avec vérification des rôles */}
                    <Route 
                        path="/superadmin-dashboard" 
                        element={<PrivateRoute element={<SuperAdminDashboard />} allowedRoles={["superadmin"]} />} 
                    />
                    <Route 
                        path="/admin-dashboard" 
                        element={<PrivateRoute element={<AdminDashboard />} allowedRoles={["admin", "superadmin"]} />} 
                    />
                    <Route 
                        path="/member-dashboard" 
                        element={<PrivateRoute element={<MemberDashboard />} allowedRoles={["member", "admin", "superadmin"]} />} 
                    />
                </Routes>

                {/* ✅ Afficher les options Admin SEULEMENT si c'est un Admin connecté */}
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