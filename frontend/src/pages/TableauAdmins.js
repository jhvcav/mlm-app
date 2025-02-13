import React from "react";
import TableauAdminButtons from "./TableauAdminButtons";
import { handleEditAdmin, handleViewAdmin, handleDeleteAdmin } from "./TableauAdminFunctions";

const TableauAdmins = ({ admins, setEditData, setShowEditModal, setSelectedDetail, setShowDetailModal, fetchAdmins }) => {
    // 🔍 Vérification console
    console.log("📡 Liste des admins reçue :", admins);

    return (
        <div>
            <h3>👨‍💼 Liste des Administrateurs</h3>

            {/* 🔍 Debug - Affiche les données brutes des admins */}
            <div style={{ backgroundColor: "#f8f8f8", padding: "10px", border: "1px solid #ddd", marginBottom: "15px" }}>
                <h4>📋 Données brutes des Admins (Debug)</h4>
                <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {JSON.stringify(admins, null, 2)}
                </pre>
            </div>

            <table border="1">
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {admins && admins.length > 0 ? (
                        admins.map(admin => (
                            <tr key={admin.email}>
                                <td>{admin.firstName}</td>
                                <td>{admin.name || admin.lastName}</td>
                                <td>{admin.email}</td>
                                <td>
                                    <TableauAdminButtons 
                                        admin={admin} 
                                        onEdit={() => handleEditAdmin(admin, setEditData, setShowEditModal)}
                                        onView={() => handleViewAdmin(admin, setSelectedDetail, setShowDetailModal)}
                                        onDelete={() => handleDeleteAdmin(admin.email, fetchAdmins)}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center", color: "red" }}>
                                ⚠️ Aucun administrateur trouvé
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableauAdmins;