import React from "react";
import TableauMembresButtons from "./TableauMembresButtons";
import { handleEditMember, handleViewMember, handleDeleteMember } from "./TableauMembresFunctions";

const TableauMembres = ({ members, setEditData, setShowEditModal, setSelectedDetail, setShowDetailModal, fetchMembers }) => {
    // 🔹 Filtrer uniquement les membres (role: "member")
    const memberList = members.filter(member => member.role === "member");

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
                    {memberList.length > 0 ? (
                        memberList.map(member => (
                            <tr key={member.email}>
                                <td>{member.firstName}</td>
                                <td>{member.name}</td>
                                <td>{member.email}</td>
                                <td>{member.phone}</td>
                                <td>
                                    <TableauMembresButtons 
                                        member={member} 
                                        onEdit={() => handleEditMember(member, setEditData, setShowEditModal)}
                                        onView={() => handleViewMember(member, setSelectedDetail, setShowDetailModal)}
                                        onDelete={() => handleDeleteMember(member.email, fetchMembers)} // ✅ Supprime un membre
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>Aucun membre trouvé</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableauMembres;