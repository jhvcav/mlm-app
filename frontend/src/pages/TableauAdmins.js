import React from "react";
import TableauAdminButtons from "./TableauAdminButtons";
import { handleEditAdmin, handleViewAdmin, handleDeleteAdmin } from "./TableauAdminFunctions";

const TableauAdmins = ({ admins, setEditData, setShowEditModal, setSelectedDetail, setShowDetailModal, fetchAdmins }) => {
    // 🔍 Filtrer les administrateurs uniquement
    const filteredAdmins = admins.filter(admin => admin.role === "admin");

    return (
        <div>
            <h3>👨‍💼 Liste des Administrateurs</h3>
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
                    {filteredAdmins.length > 0 ? (
                        filteredAdmins.map(admin => (
                            <tr key={admin.email}>
                                <td>{admin.firstName}</td>
                                <td>{admin.lastName}</td>
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
                            <td colSpan="4" style={{ textAlign: "center" }}>Aucun administrateur trouvé</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableauAdmins;