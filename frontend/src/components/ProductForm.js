import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MembersPage from './pages/MembersPage';
import ProductsPage from './pages/ProductsPage';
import WalletsPage from './pages/WalletsPage';
import ProgressPage from './pages/ProgressPage';
import './styles.css';

const App = () => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/">Accueil</Link></li>
                        <li><Link to="/members">Membres</Link></li>
                        <li><Link to="/products">Produits</Link></li>
                        <li><Link to="/wallets">Wallets</Link></li>
                        <li><Link to="/progress">Progression</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/members" element={<MembersPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/wallets" element={<WalletsPage />} />
                    <Route path="/progress" element={<ProgressPage />} />
                    <Route path="/" element={<h1>Bienvenue sur l'application MLM</h1>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;