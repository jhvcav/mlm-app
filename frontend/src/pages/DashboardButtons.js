import React from "react";

const DashboardButtons = ({ onAddAdmin }) => {
    return (
        <button className="add-admin-button" onClick={onAddAdmin}>
            ➕ Inscrire un Administrateur
        </button>
    );
};

export default DashboardButtons;