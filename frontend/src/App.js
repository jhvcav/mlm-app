import { HashRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import Inscription from "./pages/Inscription";
import Navbar from "./components/Navbar";
import MemberDetailsPage from './pages/MemberDetailsPage';
import AdminDetailsPage from './pages/AdminDetailsPage';

// ✅ Middleware pour protéger les routes selon le rôle
const PrivateRoute = ({ element, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
        return <Navigate to="/login" />;
    }

    return element;
};

// ✅ Composant qui gère l'affichage de la Navbar
const AppContent = () => {
    const location = useLocation(); // 🔹 Récupère l'URL actuelle

    return (
        <>
            {/* ✅ Affiche la Navbar sauf sur la page de connexion */}
            {location.pathname !== "/login" && <Navbar />}

            <div className="container">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/inscription" element={<Inscription />} />
                    <Route path="/superadmin-dashboard" element={<PrivateRoute element={<SuperAdminDashboard />} allowedRoles={["superadmin"]} />} />
                    <Route path="/admin-dashboard" element={<PrivateRoute element={<AdminDashboard />} allowedRoles={["admin", "superadmin"]} />} />
                    <Route path="/member-dashboard" element={<PrivateRoute element={<MemberDashboard />} allowedRoles={["member", "admin", "superadmin"]} />} />
                    <Route path="/member/:memberId" element={<MemberDetailsPage />} />
                    <Route path="/admin/:adminId" element={<AdminDetailsPage />} />
                </Routes>
            </div>
        </>
    );
};

// ✅ Le composant `Router` englobe tout pour éviter les erreurs
const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;