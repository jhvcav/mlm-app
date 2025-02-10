import React from "react";
import TableauMembresButtons from "./TableauMembresButtons";
import { handleEditMember, handleViewMember, handleDeleteMember } from "./TableauMembresFunctions";

const TableauMembres = ({ members, setEditData, setShowEditModal, setSelectedDetail, setShowDetailModal, fetchMembers }) => {
    return (
        <div>
            <h3>👥 Liste des Membres</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map(member => (
                        <tr key={member.email}>
                            <td>{member.firstName}</td>
                            <td>{member.lastName}</td>
                            <td>{member.email}</td>
                            <td>{member.phone}</td>
                            <TableauMembresButtons 
                                member={member} 
                                onEdit={() => handleEditMember(member, setEditData, setShowEditModal)}
                                onView={() => handleViewMember(member, setSelectedDetail, setShowDetailModal)}
                                onDelete={() => handleDeleteMember(member, fetchMembers)}
                            />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableauMembres;