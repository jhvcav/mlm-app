import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MembersTable.css';

const MembersTable = () => {
    const [members, setMembers] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showProductsModal, setShowProductsModal] = useState(false);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const membersPerPage = 5;
    const navigate = useNavigate();

    // Charger la liste des membres
    useEffect(() => {
        fetch("https://mlm-app.onrender.com/api/members")
            .then(res => res.json())
            .then(data => setMembers(data))
            .catch(err => console.error("❌ Erreur chargement des membres :", err));
    }, []);

    // Fonction pour modifier un membre
    const handleEdit = (member) => {
        localStorage.setItem("selectedMember", JSON.stringify(member));
        navigate('/members-form');
    };

    // Fonction pour supprimer un membre
    const handleDelete = async (memberId) => {
        if (window.confirm("❌ Êtes-vous sûr de vouloir supprimer ce membre ?")) {
            try {
                const response = await fetch(`https://mlm-app.onrender.com/api/members/${memberId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error("Erreur lors de la suppression du membre.");
                }

                alert("✅ Membre supprimé avec succès !");
                setMembers(members.filter(member => member._id !== memberId));
            } catch (error) {
                console.error("❌ Erreur suppression :", error);
                alert("❌ Impossible de supprimer ce membre.");
            }
        }
    };

    // Fonction pour afficher les produits souscrits
    const handleShowProducts = (products) => {
        setSelectedProducts(products);
        setShowProductsModal(true);
    };

    // Fonction pour afficher les détails du membre
    const handleShowMemberDetails = (member) => {
        setSelectedMember(member);
        setShowMemberModal(true);
    };

    // Pagination - Calcul des membres affichés
    const indexOfLastMember = currentPage * membersPerPage;
    const indexOfFirstMember = indexOfLastMember - membersPerPage;
    const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

    return (
        <div className="table-container">
            <h2>📋 Liste des Membres</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID Membre</th>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Produits souscrits</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentMembers.map(member => (
                        <tr key={member._id}>
                            <td>{member.memberId}</td>
                            <td>{member.firstName}</td>
                            <td>{member.name}</td>
                            <td>{member.email}</td>
                            <td>{member.phone}</td>
                            <td>
                                <button 
                                    className="view-btn" 
                                    onClick={() => handleShowProducts(member.products)}>
                                    📦 Voir Produits
                                </button>
                            </td>
                            <td className="action-buttons">
                                <button 
                                    className="edit-btn" 
                                    onClick={() => handleEdit(member)}>
                                    ✏️ Modifier
                                </button>
                                <button 
                                    className="details-btn" 
                                    onClick={() => handleShowMemberDetails(member)}>
                                    👁️ Voir Détails
                                </button>
                                <button 
                                    className="delete-btn" 
                                    onClick={() => handleDelete(member._id)}>
                                    🗑️ Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination centrée */}
            <div className="pagination">
                {Array.from({ length: Math.ceil(members.length / membersPerPage) }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? "active" : ""}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Modal pour afficher les détails du membre sous forme de fiche bien structurée */}
            {showMemberModal && (
                <div className="modal">
                    <div className="modal-content member-details">
                        <h3>👤 Détails du Membre</h3>
                        {selectedMember && (
                            <div className="member-info">
                                <p><strong>ID Membre :</strong> {selectedMember.memberId}</p>
                                <p><strong>Prénom :</strong> {selectedMember.firstName}</p>
                                <p><strong>Nom :</strong> {selectedMember.name}</p>
                                <p><strong>Email :</strong> {selectedMember.email}</p>
                                <p><strong>Téléphone :</strong> {selectedMember.phone}</p>
                                <p><strong>Adresse :</strong> {selectedMember.address}</p>
                                <p><strong>Sponsor :</strong> {selectedMember.sponsorId || "Aucun"}</p>
                            </div>
                        )}
                        <button className="close-btn" onClick={() => setShowMemberModal(false)}>❌ Fermer</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MembersTable;