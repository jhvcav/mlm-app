import React from "react";
import "./TableauStyle.css"; // Import du CSS amélioré

const TableauAdmins = ({ admins, onEdit, onDelete, onView }) => {
    return (
        <div className="table-container">
            <h3>👨‍💼 Liste des Administrateurs</h3>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.length > 0 ? (
                        admins.map(admin => (
                            <tr key={admin.email}>
                                <td>{admin.firstName}</td>
                                <td>{admin.lastName || admin.name}</td>
                                <td>{admin.email}</td>
                                <td className="action-buttons">
                                    <button className="edit-btn" onClick={() => onEdit(admin)}>✏️ Modifier</button>
                                    <button className="view-btn" onClick={() => onView(admin)}>👁️ Voir</button>
                                    <button className="delete-btn" onClick={() => onDelete(admin.email)}>🗑️ Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="empty-message">⚠️ Aucun administrateur trouvé</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableauAdmins;