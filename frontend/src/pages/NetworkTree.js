import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles.css'; // ✅ Assurez-vous d'avoir les styles nécessaires

const buildNetworkTree = (members) => {
    let membersMap = new Map();

    members.forEach(member => {
        membersMap.set(member._id, { ...member, children: [] });
    });

    let tree = [];

    members.forEach(member => {
        if (member.sponsorId && membersMap.has(member.sponsorId)) {
            membersMap.get(member.sponsorId).children.push(membersMap.get(member._id));
        } else {
            tree.push(membersMap.get(member._id));
        }
    });

    return tree;
};

const NetworkTree = () => {
    const navigate = useNavigate();
    const [tree, setTree] = useState([]);
    const [expandedNodes, setExpandedNodes] = useState(new Set());

    useEffect(() => {
        fetch("https://mlm-app-jhc.fly.dev/api/members")
            .then(res => res.json())
            .then(data => {
                setTree(buildNetworkTree(data));
            })
            .catch(err => console.error("❌ Erreur chargement du réseau :", err));
    }, []);

    const toggleExpand = (id) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    const renderTree = (node) => {
        return (
            <li key={node._id} className="network-node">
                <div className="node-box">
                    <p>{node.firstName} {node.lastName}</p>
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

            {/* ✅ Bouton Retour */}
            <button className="btn-back" onClick={() => navigate(-1)}>🔙 Retour</button>
        </div>
    );
};

export default NetworkTree;