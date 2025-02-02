import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MembersTable.css';

const MembersTable = () => {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);

    useEffect(() => {
        fetch("https://mlm-app.onrender.com/api/members")
            .then(res => res.json())
            .then(data => setMembers(data))
            .catch(err => console.error("Erreur chargement des membres :", err));
    }, []);

    const handleEdit = (member) => {
        // Sauvegarde les données du membre dans localStorage
        localStorage.setItem("selectedMember", JSON.stringify(member));
        // Redirection vers le formulaire
        navigate("/members-form");
    };

    return (
        <div className="table-container">
            <h2>📋 Liste des Membres</h2>
            <table>
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Produits souscrits</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map(member => (
                        <tr key={member._id}>
                            <td>{member.firstName}</td>
                            <td>{member.name}</td>
                            <td>{member.email}</td>
                            <td>
                                {member.products.length > 0 
                                    ? member.products.map(product => <span key={product}>{product}</span>).join(", ")
                                    : "Aucun"}
                            </td>
                            <td>
                                <button onClick={() => handleEdit(member)}>Modifier</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MembersTable;