export const handleEditMember = (member, setEditData, setShowEditModal) => {
    setEditData({ ...member, password: '' });
    setShowEditModal(true);
};

export const handleViewMember = (member, setSelectedDetail, setShowDetailModal) => {
    setSelectedDetail(member);
    setShowDetailModal(true);
};

export const handleDeleteMember = async (memberEmail, fetchMembers) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le membre ${memberEmail} ?`)) {
        return;
    }

    try {
        const response = await fetch(`https://mlm-app-jhc.fly.dev/api/members/email/${memberEmail}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Échec de la suppression.");
        }

        alert(`✅ Membre ${memberEmail} supprimé avec succès.`);
        fetchMembers(); // 🔄 Rafraîchir la liste après suppression
    } catch (err) {
        alert(`❌ Erreur : ${err.message}`);
    }
};