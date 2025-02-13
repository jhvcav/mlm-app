import React, { useState, useEffect } from "react";

const permissionsList = [
    { key: "canCreateAdmin", label: "Créer des Admins" },
    { key: "canCreateMember", label: "Créer des Membres" },
    { key: "canDeleteUser", label: "Supprimer un Membre" },
    { key: "canEditUser", label: "Modifier un Membre" },
    { key: "canAccessSuperAdminDashboard", label: "Accès au Dashboard Super Admin" },
    { key: "canAccessAdminDashboard", label: "Accès au Dashboard Admin" }
];

const ManagePermissions = ({ userId, currentPermissions, onPermissionsUpdated }) => {
    const [permissions, setPermissions] = useState(currentPermissions || {});

    useEffect(() => {
        setPermissions(currentPermissions);
    }, [currentPermissions]);

    // ✅ Fonction pour mettre à jour une permission
    const handlePermissionChange = (key) => {
        setPermissions((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // ✅ Fonction pour sauvegarder les permissions
    const savePermissions = async () => {
        try {
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/members/update-permissions/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ permissions }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Échec de la mise à jour des permissions.");
            }

            alert("✅ Permissions mises à jour avec succès !");
            onPermissionsUpdated(); // 🔄 Rafraîchir les données
        } catch (err) {
            alert(`❌ Erreur : ${err.message}`);
        }
    };

    return (
        <div>
            <h2>🔧 Gérer les permissions</h2>
            {permissionsList.map((perm) => (
                <label key={perm.key} style={{ display: "block", marginBottom: "8px" }}>
                    <input
                        type="checkbox"
                        checked={permissions[perm.key] || false}
                        onChange={() => handlePermissionChange(perm.key)}
                    /> 
                    {perm.label}
                </label>
            ))}
            <button onClick={savePermissions} style={{ marginTop: "10px", padding: "8px 12px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>
                💾 Sauvegarder
            </button>
        </div>
    );
};

export default ManagePermissions;