import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MembersPage from './pages/MembersPage';
import './styles.css';

const App = () => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/">Accueil</Link></li>
                        <li><Link to="/members">Membres</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/members" element={<MembersPage />} />
                    <Route path="/" element={<h1>Bienvenue sur l'application MLM</h1>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;