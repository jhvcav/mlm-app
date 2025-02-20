import React from "react";
import "./TableauStyle.css"; // Style du tableau

const TableauAdmins = ({ admins, onDelete, onView }) => {

    return (
        <div className="table-container">
            <h3>👨‍💼 Liste des Administrateurs</h3>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>  {/* ✅ Nouvelle colonne */}
                        <th className="actions-column">Actions</th> {/* ✅ Pour centrer le Nom de la colonne Action */}
                    </tr>
                </thead>
                <tbody>
                    {admins.length > 0 ? (
                        admins.map(admin => (
                            <tr key={admin.email} className={admin.role === "superadmin" ? "superadmin-row" : ""}>
                                <td>{admin.firstName}</td>
                                <td>{admin.lastName || admin.name}</td>
                                <td>{admin.email}</td>
                                <td>
                                    {admin.role === "superadmin" ? "⭐ SuperAdmin" : "🔹 Admin"} {/* ✅ Affichage rôle */}
                                </td>
                                <td className="action-buttons">
                                    <button className="view-btn" onClick={() => onView(admin)}>👁️ Voir</button>
                                    <button className="delete-btn" onClick={() => onDelete(admin.email)} disabled={!onDelete}>🗑️ Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="empty-message">⚠️ Aucun administrateur trouvé</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableauAdmins;