import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NetworkTable.css'; // Assurez-vous que le fichier CSS existe

const NetworkTable = () => {
    const [members, setMembers] = useState([]);

    // Charger la liste des membres depuis l'API
    useEffect(() => {
        fetch("https://mlm-app.onrender.com/api/members")
            .then(res => res.json())
            .then(data => setMembers(data))
            .catch(err => console.error("❌ Erreur chargement des membres :", err));
    }, []);

    return (
        <div className="network-table-container">
            <h2>📋 Tableau du Réseau</h2>

            {/* Lien vers l'arbre du réseau */}
            <Link to="/network-tree" className="tree-link">🌳 Voir l'arbre du réseau</Link>

            {/* Tableau des membres */}
            <table>
                <thead>
                    <tr>
                        <th>ID Membre</th>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>ID Parrain</th>
                    </tr>
                </thead>
                <tbody>
                    {members.length > 0 ? (
                        members.map(member => (
                            <tr key={member._id}>
                                <td>{member._id}</td>
                                <td>{member.firstName}</td>
                                <td>{member.name}</td>
                                <td>{member.email}</td>
                                <td>{member.sponsorId || "Aucun"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">Aucun membre trouvé.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default NetworkTable;