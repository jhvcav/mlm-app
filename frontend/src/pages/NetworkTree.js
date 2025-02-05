import React, { useState, useEffect } from 'react';
import '../styles.css'; // Assurez-vous d'avoir les styles nécessaires

// Fonction pour organiser les membres sous forme d'arbre
const buildNetworkTree = (members) => {
    let membersMap = new Map();

    // Créer une entrée pour chaque membre avec ses enfants
    members.forEach(member => {
        membersMap.set(member._id, { ...member, children: [] });
    });

    let tree = [];

    // Construire la hiérarchie des membres
    members.forEach(member => {
        if (member.sponsorId && membersMap.has(member.sponsorId)) {
            membersMap.get(member.sponsorId).children.push(membersMap.get(member._id));
        } else {
            tree.push(membersMap.get(member._id)); // Membres sans sponsor (racines)
        }
    });

    return tree;
};

const NetworkTree = () => {
    const [, setMembers] = useState([]);
    const [tree, setTree] = useState([]);
    const [expandedNodes, setExpandedNodes] = useState(new Set()); // Pour stocker les niveaux ouverts

    useEffect(() => {
        fetch("https://mlm-app.onrender.com/api/members")
            .then(res => res.json())
            .then(data => {
                setMembers(data);
                setTree(buildNetworkTree(data));
            })
            .catch(err => console.error("❌ Erreur chargement du réseau :", err));
    }, []);

    // Fonction pour basculer l'affichage des enfants
    const toggleExpand = (id) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    // Fonction récursive pour afficher l'arbre avec des blocs et des boutons d'expansion
    const renderTree = (node) => {
        return (
            <li key={node._id} className="network-node">
                <div className="node-box">
                    <p>{node.firstName} {node.name}</p>
                    <span className="node-email">📧 {node.email}</span>
                    {node.children.length > 0 && (
                        <button className="expand-btn" onClick={() => toggleExpand(node._id)}>
                            {expandedNodes.has(node._id) ? "➖" : "➕"}
                        </button>
                    )}
                </div>
                {expandedNodes.has(node._id) && node.children.length > 0 && (
                    <ul className="network-children">
                        {node.children.map(child => renderTree(child))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <div className="network-tree-container">
            <h2>🌳 Arbre du Réseau</h2>
            {tree.length > 0 ? (
                <ul className="network-tree">
                    {tree.map(member => renderTree(member))}
                </ul>
            ) : (
                <p>Aucun membre trouvé.</p>
            )}
        </div>
    );
};

export default NetworkTree;