import React from "react";
import TableauMembresButtons from "./TableauMembresButtons";
import { handleEditMember, handleViewMember, handleDeleteMember } from "./TableauMembresFunctions";

const TableauMembres = ({ members, setEditData, setShowEditModal, setSelectedDetail, setShowDetailModal, fetchMembers }) => {
    // 🔹 Filtrer uniquement les membres (role: "member")
    const memberList = members.filter(member => !member.role || member.role === "member");

    // 🔍 Vérification console (debug)
    console.log("📌 Membres avant filtrage :", members);
    console.log("📌 Membres après filtrage :", memberList);

    return (
        <div>
            <h3>👥 Liste des Membres</h3>

            {/* ✅ Données brutes des Membres (Debug) */}
            <div style={{ backgroundColor: "#f8f8f8", padding: "10px", border: "1px solid #ddd" }}>
                <h4>📋 Données brutes des Membres (Debug - Avant Filtrage)</h4>
                {members ? <pre>{JSON.stringify(members, null, 2)}</pre> : <p>⚠️ Aucune donnée reçue</p>}

                <h4>📋 Membres après Filtrage (Debug)</h4>
                {memberList.length > 0 ? (
                    <pre>{JSON.stringify(memberList, null, 2)}</pre>
                ) : <p>⚠️ Aucun membre trouvé</p>}
            </div>

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