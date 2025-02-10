export const handleEditMember = (member, setEditData, setShowEditModal) => {
    setEditData({ ...member, password: '' });
    setShowEditModal(true);
};

export const handleViewMember = (member, setSelectedDetail, setShowDetailModal) => {
    setSelectedDetail(member);
    setShowDetailModal(true);
};

export const handleDeleteMember = async (member, fetchMembers) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${member.firstName} ?`)) {
        return;
    }

    try {
        const response = await fetch(`https://mlm-app-jhc.fly.dev/api/auth/members/${member.email}`, { method: "DELETE" });

        if (!response.ok) {
            throw new Error("Échec de la suppression.");
        }

        alert("✅ Suppression réussie !");
        await fetchMembers();
    } catch (err) {
        alert(`Erreur: ${err.message}`);
    }
};