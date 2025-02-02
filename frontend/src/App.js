import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import MembersPage from './pages/MembersPage';
import ProductsPage from './pages/ProductsPage';
import WalletsPage from './pages/WalletsPage';
import ProgressPage from './pages/ProgressPage';
import MembersForm from './pages/MembersForm';
import MembersTable from './pages/MembersTable';
import Dashboard from "./pages/Dashboard"; // Import du Dashboard

import './styles.css';

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/members" element={<MembersPage />} />
                    <Route path="/members-form" element={<MembersForm />} />
                    <Route path="/members-table" element={<MembersTable />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/wallets" element={<WalletsPage />} />
                    <Route path="/progress" element={<ProgressPage />} />
                    <Route path="/" element={<h1 className="welcome">Bienvenue sur l'application MLM</h1>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;