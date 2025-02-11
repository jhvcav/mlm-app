export const handleEditAdmin = (admin, setEditData, setShowEditModal) => {
    setEditData({ ...admin, password: '' });
    setShowEditModal(true);
};

export const handleViewAdmin = (admin, setSelectedDetail, setShowDetailModal) => {
    setSelectedDetail(admin);
    setShowDetailModal(true);
};

export const handleDeleteAdmin = async (adminEmail, fetchAdmins) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'administrateur ${adminEmail} ?`)) {
        return;
    }

    try {
        const response = await fetch(`https://mlm-app-jhc.fly.dev/api/members/admins/email/${adminEmail}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Échec de la suppression.");
        }

        alert(`✅ Administrateur ${adminEmail} supprimé avec succès.`);
        fetchAdmins(); // 🔄 Rafraîchir la liste après suppression
    } catch (err) {
        alert(`❌ Erreur : ${err.message}`);
    }
};