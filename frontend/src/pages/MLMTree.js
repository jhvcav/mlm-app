import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';

const MLMTree = () => {
    const [treeData, setTreeData] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [memberProducts, setMemberProducts] = useState([]); // ✅ Stocke les produits souscrits
    const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Contrôle l'affichage de la fenêtre modale

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setUserRole(user.role);
            setUserId(user._id);
        }

        // 🔄 Charger la liste des produits dynamiquement
        fetch("https://mlm-app-jhc.fly.dev/api/products")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("❌ Erreur chargement des produits :", err));

        // 🔄 Charger tous les membres
        fetch("https://mlm-app-jhc.fly.dev/api/members")
            .then(res => res.json())
            .then(data => {
                if (selectedProduct) {
                    filterTreeByProduct(data, selectedProduct, user);
                } else {
                    const root = buildTree(data, user);
                    setTreeData(root);
                }
            })
            .catch(err => console.error("❌ Erreur chargement des membres :", err));
    }, [selectedProduct]);

    // ✅ Fonction pour filtrer l'arbre selon le produit sélectionné
    const filterTreeByProduct = async (members, productId, user) => {
        try {
            console.log("🔍 Produit sélectionné :", productId);
    
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/products/subscribed/${productId}`);
            const subscribedMembers = await response.json();
            
            console.log("📌 Membres ayant souscrit :", subscribedMembers);
    
            if (!Array.isArray(subscribedMembers) || subscribedMembers.length === 0) {
                console.warn("⚠️ Aucun membre n'a souscrit à ce produit !");
                setTreeData(null);
                return;
            }
    
            const subscribedIds = new Set(subscribedMembers.map(member => member._id));
    
            const filteredMembers = members.filter(member => subscribedIds.has(member._id));
    
            console.log("✅ Membres filtrés :", filteredMembers);
    
            if (filteredMembers.length === 0) {
                console.warn("⚠️ Aucun membre filtré !");
                setTreeData(null);
                return;
            }
    
            const root = buildTree(filteredMembers, user);
            console.log("🌳 Arbre généré :", root);
            setTreeData(root);
        } catch (error) {
            console.error("❌ Erreur lors du filtrage des membres :", error);
        }
    };

    // ✅ Fonction pour construire l'arbre
    const buildTree = (members, user) => {
        if (!Array.isArray(members) || members.length === 0) return null;
    
        const memberMap = {};
        members.forEach(member => {
            memberMap[member._id] = {
                name: `${member.firstName} ${member.lastName}`,
                children: [],
                memberId: member._id,
                sponsorId: member.sponsorId,
                fullDetails: {  
                    email: member.email || "Non spécifié",
                    phone: member.phone || "Non spécifié",
                    createdAt: member.createdAt ? new Date(member.createdAt).toLocaleString() : "Inconnue",
                }
            };
        });
    
        let rootNodes = [];
    
        if (user.role === "superadmin") {
            // 🚀 Trouver tous les membres sans sponsor comme points d'entrée
            rootNodes = members.filter(member => !member.sponsorId).map(member => memberMap[member._id]);
        } else {
            rootNodes = [memberMap[user._id] || null].filter(node => node !== null);
        }
    
        // 🌳 Construire l'arbre
        members.forEach(member => {
            if (member.sponsorId && memberMap[member.sponsorId] && member.sponsorId !== member._id) {
                memberMap[member.sponsorId].children.push(memberMap[member._id]);
            }
        });
    
        return rootNodes.length === 1 ? rootNodes[0] : { name: "Superadmin", children: rootNodes };
    };

    // ✅ Fonction pour charger les produits souscrits du membre sélectionné
    const fetchMemberProducts = async (memberId) => {
        try {
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/products/subscribed/${memberId}`);
            const data = await response.json();
            setMemberProducts(data);
            setIsModalOpen(true); // ✅ Ouvre la fenêtre modale après chargement des produits
        } catch (error) {
            console.error("❌ Erreur chargement des produits du membre :", error);
        }
    };

    // ✅ Styles des nœuds (agrandir cercles et texte)
    const nodeStyles = {
        nodeSvgShape: {
            shape: "circle",
            shapeProps: {
                r: 25, 
                fill: "lightblue",
                stroke: "black",
                strokeWidth: 2
            }
        },
        labels: {
            fontSize: "16px",
            fontWeight: "bold"
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>🌳 Arbre du Réseau MLM</h2>

            {treeData ? (
                <div style={{ width: '100%', height: '500px', border: '1px solid red', marginTop: '20px' }}>
                    <Tree 
                        data={treeData} 
                        orientation="vertical" 
                        translate={{ x: 300, y: 50 }} 
                        zoomable 
                        collapsible 
                        separation={{ siblings: 1, nonSiblings: 2 }} 
                        nodeSize={{ x: 250, y: 120 }}
                        styles={nodeStyles} 
                        onNodeClick={(node) => setSelectedMember(node)}
                    />
                </div>
            ) : (
                <p>⏳ Chargement des données...</p>
            )}

            {/* ✅ Vérification avant d'afficher les détails du membre sélectionné */}
            {selectedMember && selectedMember.data && selectedMember.data.fullDetails && (
                <div style={{ padding: '10px', border: '1px solid #ccc', marginTop: '20px' }}>
                    <h3>👤 Détails du Membre</h3>
                    <p><strong>🆔 :</strong> {selectedMember.data.memberId}</p>
                    <p><strong>Nom :</strong> {selectedMember.data.name}</p>
                    <p><strong>Email :</strong> {selectedMember.data.fullDetails.email}</p>
                    <p><strong>Téléphone :</strong> {selectedMember.data.fullDetails.phone}</p>
                    <p><strong>Date de création :</strong> {selectedMember.data.fullDetails.createdAt}</p>
        
                    {/* ✅ Conteneur des boutons avec espace */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button onClick={() => fetchMemberProducts(selectedMember.data.memberId)}>📦 Voir Produits</button>
                        <button onClick={() => setSelectedMember(null)}>❌ Fermer</button>
                    </div>
                </div>
            )}

            {/* ✅ Fenêtre modale pour afficher les produits souscrits */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white', padding: '20px', border: '1px solid #ccc', boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
                    zIndex: 1000
                }}>
                    <h3>📦 Produits souscrits</h3>
                    {memberProducts.length > 0 ? (
                        <ul>
                            {memberProducts.map(product => (
                                <li key={product._id}>{product.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>⛔ Aucun produit souscrit.</p>
                    )}
                    <button onClick={() => setIsModalOpen(false)}>❌ Fermer</button>
                </div>
            )}
        </div>
    );
};

export default MLMTree;