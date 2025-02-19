import { useNavigate } from "react-router-dom";

const TableauMembres = ({ members, onDelete }) => {
    const navigate = useNavigate();

    return (
        <div className="table-container">
            <h3>👥 Liste des Membres</h3>
            <table className="styled-table">
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
                    {members.length > 0 ? (
                        members.map(member => (
                            <tr key={member.email}>
                                <td>{member.firstName}</td>
                                <td>{member.lastName || member.name}</td>
                                <td>{member.email}</td>
                                <td>{member.phone || "Non renseigné"}</td>
                                <td className="action-buttons">
                                    <button className="view-btn" onClick={() => navigate(`/member/${member._id}`)}>👁️ Voir</button>
                                    <button className="delete-btn" onClick={() => onDelete(member.email)}>🗑️ Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="empty-message">⚠️ Aucun membre trouvé</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableauMembres;