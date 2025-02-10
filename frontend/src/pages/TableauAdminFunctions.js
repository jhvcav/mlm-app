export const handleEditAdmin = (admin, setEditData, setShowEditModal) => {
    setEditData({ ...admin, password: '' });
    setShowEditModal(true);
};

export const handleViewAdmin = (admin, setSelectedDetail, setShowDetailModal) => {
    setSelectedDetail(admin);
    setShowDetailModal(true);
};

export const handleDeleteAdmin = async (admin, fetchAdmins) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${admin.firstName} ?`)) {
        return;
    }

    try {
        const response = await fetch(`https://mlm-app-jhc.fly.dev/api/auth/admins/${admin.email}`, { method: "DELETE" });

        if (!response.ok) {
            throw new Error("Échec de la suppression.");
        }

        alert("✅ Suppression réussie !");
        await fetchAdmins();
    } catch (err) {
        alert(`Erreur: ${err.message}`);
    }
};