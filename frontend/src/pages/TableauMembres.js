import React from "react";
import { useNavigate } from "react-router-dom";
import "./TableauMembres.css"; // Style du tableau

const TableauMembres = ({ members }) => {
    const navigate = useNavigate();

    return (
        <div className="table-container">
            <h3>👥 Liste des Membres</h3>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Actions</th> {/* ✅ Colonne Actions */}
                    </tr>
                </thead>
                <tbody>
                    {members.length > 0 ? (
                        members.map(member => (
                            <tr key={member.email}>
                                <td>{member.firstName}</td>
                                <td>{member.lastName || member.name}</td>
                                <td>{member.email}</td>
                                <td>{member.phone || "Non renseigné"}</td>
                                <td className="action-buttons">
                                    {/* ✅ Bouton qui ouvre la page MemberDetail */}
                                    <button 
                                        className="action-btn"
                                        onClick={() => navigate(`/member/${member._id}`)}
                                    >
                                        ⚙️ Actions
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="empty-message">⚠️ Aucun membre trouvé</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableauMembres;