import React, { useState, useEffect } from "react";

const MemberDetail = () => {
    const [member, setMember] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setMember(user);
    }, []);

    if (!member) {
        return <p>⏳ Chargement des informations...</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>📋 Détail du profil</h2>
            <p><strong>👤 Nom :</strong> {member.firstName} {member.lastName}</p>
            <p><strong>📧 Email :</strong> {member.email}</p>
            <p><strong>📞 Téléphone :</strong> {member.phone || "Non renseigné"}</p>
            <p><strong>🎭 Rôle :</strong> {member.role}</p>
            <p><strong>Mot de passe :</strong> {member.password}</p>
        </div>
    );
};

export default MemberDetail;