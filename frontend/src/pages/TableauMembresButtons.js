import React from "react";

const TableauMembresButtons = ({ member, onEdit, onView, onDelete }) => {
    return (
        <td>
            <button className="edit-btn" onClick={() => onEdit(member)}>📝 Modifier</button>
            <button className="view-btn" onClick={() => onView(member)}>👁️ Voir Détails</button>
            <button className="delete-btn" onClick={() => onDelete(member)}>🗑️ Supprimer</button>
        </td>
    );
};

export default TableauMembresButtons;