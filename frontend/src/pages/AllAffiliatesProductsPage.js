import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AllAffiliatesProductsPage.css";

const AllAffiliatesProductsPage = () => {
    const [allMembers, setAllMembers] = useState([]); // 🔹 Liste complète des membres
    const [filteredMembers, setFilteredMembers] = useState([]); // 🔹 Liste filtrée selon le rôle
    const [selectedMember, setSelectedMember] = useState(null); // 🔹 Membre sélectionné
    const [memberProducts, setMemberProducts] = useState([]); // 🔹 Produits souscrits
    const [isModalOpen, setIsModalOpen] = useState(false); // 🔹 Contrôle l'affichage de la fenêtre modale
    const [userRole, setUserRole] = useState(""); // 🔹 Stocke le rôle de l'utilisateur
    const [userId, setUserId] = useState(""); // 🔹 Stocke l'ID de l'utilisateur connecté
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // ✅ Récupérer les infos utilisateur (rôle + ID)
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.role && user._id) {
            setUserRole(user.role);
            setUserId(user._id);
        } else {
            alert("⛔ Accès refusé !");
            navigate("/"); // 🔹 Redirection si pas d'info utilisateur
        }
    }, [navigate]);

    // ✅ Récupérer la liste des affiliés
    useEffect(() => {
        const fetchMembers = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch("https://mlm-app-jhc.fly.dev/api/members", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error("⛔ Erreur lors de la récupération des affiliés.");
                }

                const data = await response.json();
                console.log("✅ Membres récupérés :", data);
                setAllMembers(data);
            } catch (error) {
                console.error("❌ Erreur API :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    // ✅ Filtrer les membres affichés selon le rôle
    useEffect(() => {
        if (userRole === "superadmin" || userRole === "admin") {
            setFilteredMembers(allMembers); // 🔹 Les admins voient tout
        } else {
            // 🔹 Les membres voient uniquement leur réseau (directs + indirects)
            const userNetwork = getUserNetwork(userId, allMembers);
            setFilteredMembers(userNetwork);
        }
    }, [userRole, userId, allMembers]);

    // ✅ Fonction pour récupérer le réseau MLM d'un utilisateur (directs + indirects)
    const getUserNetwork = (userId, members) => {
        let network = [];
        const getAffiliates = (sponsorId) => {
            const affiliates = members.filter(member => member.sponsorId === sponsorId);
            network = [...network, ...affiliates];
            affiliates.forEach(affiliate => getAffiliates(affiliate._id)); // 🔄 Cherche en profondeur
        };
        getAffiliates(userId);
        return network;
    };

    // ✅ Récupérer les produits souscrits d'un membre
    const fetchMemberProducts = async (member) => {
        setSelectedMember(member);
        setIsModalOpen(true);
        setMemberProducts([]); // 🔹 Réinitialisation avant chargement

        try {
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/products/subscribed/${member._id}`);
            const data = await response.json();
            setMemberProducts(data);
        } catch (error) {
            console.error("❌ Erreur lors du chargement des produits :", error);
        }
    };

    return (
        <div className="all-affiliates-container">
            <h1>📜 Liste des Affiliés et Produits Souscrits</h1>

            {loading ? (
                <p>⏳ Chargement...</p>
            ) : (
                <table className="affiliates-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map((member) => (
                            <tr key={member._id}>
                                <td>{member.firstName} {member.lastName}</td>
                                <td>{member.email}</td>
                                <td>
                                    <button className="btn-view-products" onClick={() => fetchMemberProducts(member)}>
                                        📦 Voir Produits
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <button className="btn-back" onClick={() => navigate(-1)}>🔙 Retour</button>

            {/* ✅ Fenêtre modale pour afficher les produits souscrits */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>📦 Produits souscrits de {selectedMember?.firstName} {selectedMember?.lastName}</h3>
                        {memberProducts.length > 0 ? (
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Montant investi</th>
                                        <th>Date de souscription</th>
                                        <th>Durée</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {memberProducts.map((product) => (
                                        <tr key={product._id}>
                                            <td>{product.name}</td>
                                            <td>{product.amountInvested} USDT</td>
                                            <td>{new Date(product.subscriptionDate).toLocaleDateString()}</td>
                                            <td>{product.duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>⛔ Aucun produit souscrit.</p>
                        )}
                        <button className="btn-close" onClick={() => setIsModalOpen(false)}>❌ Fermer</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllAffiliatesProductsPage;