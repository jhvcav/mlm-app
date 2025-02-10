import React from 'react';

const MemberModals = ({
    showEditModal, setShowEditModal, editData, setEditData, handleSaveChanges,
    showDetailModal, setShowDetailModal, selectedDetail
}) => {
    return (
        <>
            {/* ✅ Modale de modification d'un membre */}
            {showEditModal && editData && (
                <div className="modal">
                    <h3>Modifier Membre</h3>
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
                        type="text" 
                        value={editData.phone || ''} 
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })} 
                        placeholder="Numéro de téléphone" 
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

            {/* ✅ Modale pour voir les détails d'un membre */}
            {showDetailModal && selectedDetail && (
                <div className="modal">
                    <h3>Détails du Membre</h3>
                    <p><strong>Prénom :</strong> {selectedDetail.firstName}</p>
                    <p><strong>Nom :</strong> {selectedDetail.lastName}</p>
                    <p><strong>Email :</strong> {selectedDetail.email}</p>
                    <p><strong>Téléphone :</strong> {selectedDetail.phone || "Non renseigné"}</p>
                    <button onClick={() => setShowDetailModal(false)}>❌ Fermer</button>
                </div>
            )}
        </>
    );
};

export default MemberModals;