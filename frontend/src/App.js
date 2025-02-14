import { HashRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import Navbar from "./components/Navbar";

// ✅ Middleware pour protéger les routes selon le rôle
const PrivateRoute = ({ element, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
        return <Navigate to="/login" />;
    }

    return element;
};

// ✅ Composant qui vérifie si on est sur la page de connexion
const Layout = ({ children }) => {
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    return (
        <div className="app-container">
            {!isLoginPage && <Navbar />}
            {isLoginPage && <header className="login-header">Espace membres RMR-M</header>}
            <div className="container">{children}</div>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <Layout>
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
            </Layout>
        </Router>
    );
};

export default App;