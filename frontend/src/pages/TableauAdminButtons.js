import React from "react";

const TableauAdminButtons = ({ admin, onEdit, onView, onDelete }) => {
    return (
        <td>
            <button className="edit-btn" onClick={() => onEdit(admin)}>📝 Modifier</button>
            <button className="view-btn" onClick={() => onView(admin)}>👁️ Voir Détails</button>
            <button className="delete-btn" onClick={() => onDelete(admin)}>🗑️ Supprimer</button>
        </td>
    );
};

export default TableauAdminButtons;