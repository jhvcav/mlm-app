import React from "react";
import { useNavigate } from "react-router-dom";
import "./TableauAdmin.css"; // ✅ Ajout du fichier CSS

const TableauAdmins = ({ admins }) => {
    const navigate = useNavigate();

    return (
        <div className="table-container">
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th className="actions-column">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.length > 0 ? (
                        admins.map((admin) => (
                            <tr key={admin._id}>
                                <td>{admin.firstName}</td>
                                <td>{admin.lastName}</td>
                                <td>{admin.email}</td>
                                <td>{admin.role}</td>
                                <td className="actions-cell">
                                    <button 
                                        className="btn-action"
                                        onClick={() => navigate(`/admin/${admin._id}`)}
                                    >
                                        ⚙️ Actions
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="empty-message">Aucun administrateur trouvé.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableauAdmins;