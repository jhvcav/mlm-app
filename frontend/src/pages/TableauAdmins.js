import React from "react";
import TableauAdminButtons from "./TableauAdminButtons";
import { handleEditAdmin, handleViewAdmin, handleDeleteAdmin } from "./TableauAdminFunctions";

const TableauAdmins = ({ admins, setEditData, setShowEditModal, setSelectedDetail, setShowDetailModal, fetchAdmins }) => {
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
                    {admins.map(admin => (
                        <tr key={admin.email}>
                            <td>{admin.firstName}</td>
                            <td>{admin.lastName}</td>
                            <td>{admin.email}</td>
                            <TableauAdminButtons 
                                admin={admin} 
                                onEdit={() => handleEditAdmin(admin, setEditData, setShowEditModal)}
                                onView={() => handleViewAdmin(admin, setSelectedDetail, setShowDetailModal)}
                                onDelete={() => handleDeleteAdmin(admin, fetchAdmins)}
                            />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableauAdmins;