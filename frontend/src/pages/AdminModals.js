import React from 'react';

const AdminModals = ({
    showAddAdminModal, setShowAddAdminModal, newAdmin, setNewAdmin, handleAddAdmin,
    showEditModal, setShowEditModal, editData, setEditData, handleSaveChanges,
    showDetailModal, setShowDetailModal, selectedDetail
}) => {
    return (
        <>
            {/* ✅ Modale d'ajout d'un administrateur */}
            {showAddAdminModal && (
                <div className="modal">
                    <h3>Ajouter un Administrateur</h3>
                    <input 
                        type="text" 
                        placeholder="Prénom" 
                        value={newAdmin.firstName} 
                        onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="Nom" 
                        value={newAdmin.lastName} 
                        onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })} 
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={newAdmin.email} 
                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} 
                    />
                    <input 
                        type="password" 
                        placeholder="Mot de passe" 
                        value={newAdmin.password} 
                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} 
                    />
                    <button onClick={handleAddAdmin}>✅ Enregistrer</button>
                    <button onClick={() => setShowAddAdminModal(false)}>❌ Annuler</button>
                </div>
            )}

            {/* ✅ Modale de modification d'un administrateur */}
            {showEditModal && editData && (
                <div className="modal">
                    <h3>Modifier Administrateur</h3>
                    <input 
                        type="text" 
                        value={editData.firstName} 
                        onChange={(e) => setEditData({ ...editData, firstName: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        value={editData.lastName} 
                        onChange={(e) => setEditData({ ...editData, lastName: e.target.value })} 
                    />
                    <input 
                        type="email" 
                        value={editData.email} 
                        readOnly 
                    />
                    <input 
                        type="password" 
                        placeholder="Nouveau mot de passe (optionnel)" 
                        onChange={(e) => setEditData({ ...editData, password: e.target.value })} 
                    />
                    <button onClick={handleSaveChanges}>✅ Enregistrer</button>
                    <button onClick={() => setShowEditModal(false)}>❌ Annuler</button>
                </div>
            )}

            {/* ✅ Modale pour voir les détails d'un administrateur */}
            {showDetailModal && selectedDetail && (
                <div className="modal">
                    <h3>Détails de l'Administrateur</h3>
                    <p><strong>Prénom :</strong> {selectedDetail.firstName}</p>
                    <p><strong>Nom :</strong> {selectedDetail.lastName}</p>
                    <p><strong>Email :</strong> {selectedDetail.email}</p>
                    <button onClick={() => setShowDetailModal(false)}>❌ Fermer</button>
                </div>
            )}
        </>
    );
};

export default AdminModals;