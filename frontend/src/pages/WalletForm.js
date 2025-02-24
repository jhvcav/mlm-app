import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WalletForm.css'; // Ajoute un fichier CSS dédié

const WalletForm = () => {
    const [members, setMembers] = useState([]); // Liste des membres
    const [selectedMember, setSelectedMember] = useState(""); // Membre sélectionné
    const [loading, setLoading] = useState(true); // Indicateur de chargement
    const [walletData, setWalletData] = useState({
        walletName: '',
        publicAddress: '',
        encryptedPassword: '',
        secretPhrase: ''
    });

    const navigate = useNavigate();

    // Charger la liste des membres pour la sélection
    useEffect(() => {
        fetch('https://mlm-app-jhc.fly.dev/api/members')
            .then(res => res.json())
            .then(data => {
                setMembers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("❌ Erreur lors du chargement des membres :", err);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        setWalletData({ ...walletData, [e.target.name]: e.target.value });
    };

    const handleMemberChange = (e) => {
        setSelectedMember(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        alert("📤 Tentative d'enregistrement du Wallet..."); // 1️⃣ Vérifier si la fonction est bien exécutée
    
        if (!selectedMember) {
            alert("❌ Veuillez sélectionner un membre !");
            return;
        }
    
        const requestData = { 
            memberId: selectedMember, 
            ...walletData 
        };
    
        alert("📦 Données envoyées : " + JSON.stringify(requestData)); // 2️⃣ Vérifier les données envoyées
    
        try {
            const response = await fetch('https://mlm-app-jhc.fly.dev/api/wallets/add-wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
    
            alert("🔄 Réponse du serveur reçue..."); // 3️⃣ Vérifier si la réponse arrive
    
            const responseData = await response.json(); // Récupérer la réponse JSON du serveur
            alert("📝 Réponse JSON : " + JSON.stringify(responseData));
    
            if (response.ok) {
                alert('✅ Wallet ajouté avec succès !');
                navigate('/wallets'); // Retour à la liste des wallets
            } else {
                alert("❌ Erreur lors de l'ajout du wallet : " + (responseData.error || "Réponse invalide"));
            }
        } catch (error) {
            alert("❌ Erreur réseau : " + error.message); // 5️⃣ Vérifier si c'est un problème réseau
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">💰 Ajouter un Wallet</h2>
            
            <form onSubmit={handleSubmit} className="wallet-form">
                {/* Sélection du membre */}
                <div className="form-group">
                    <label htmlFor="member">👤 Sélectionner un membre :</label>
                    <select name="member" id="member" onChange={handleMemberChange} required>
                        <option value="">-- Sélectionner un membre --</option>
                        {loading ? (
                            <option disabled>Chargement en cours...</option>
                        ) : (
                            members.map(member => (
                                <option key={member._id} value={member._id}>
                                    {member.firstName} {member.name} ({member.email})
                                </option>
                            ))
                        )}
                    </select>
                </div>

                {/* Champs du formulaire */}
                <div className="form-group">
                    <label htmlFor="walletName">🏷️ Nom du Wallet :</label>
                    <input type="text" id="walletName" name="walletName" placeholder="Ex: Wallet Principal" value={walletData.walletName} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="publicAddress">🔗 Adresse Publique :</label>
                    <input type="text" id="publicAddress" name="publicAddress" placeholder="Ex: 0x123..." value={walletData.publicAddress} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="encryptedPassword">🔒 Mot de passe (chiffré) :</label>
                    <input type="password" id="encryptedPassword" name="encryptedPassword" placeholder="••••••" value={walletData.encryptedPassword} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="secretPhrase">🔑 Phrase secrète (optionnel):</label>
                    <input type="text" name="secretPhrase" className="input-secret" placeholder="Phrase secrète (optionnel)" value={walletData.secretPhrase} onChange={handleChange} />
                </div>

                {/* Boutons */}
                <div className="button-group">
                    <button type="submit" className="btn-submit">✅ Enregistrer</button>
                    <button type="button" className="btn-cancel" onClick={() => navigate('/wallets')}>❌ Annuler</button>
                </div>
            </form>
        </div>
    );
};

export default WalletForm;