import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WalletForm = () => {
    const [members, setMembers] = useState([]); // Liste des membres
    const [selectedMember, setSelectedMember] = useState(""); // Membre sélectionné
    const [walletData, setWalletData] = useState({
        walletName: '',
        publicAddress: '',
        encryptedPassword: '',
        secretPhrase: ''
    });

    const navigate = useNavigate();

    // Charger la liste des membres pour la sélection
    useEffect(() => {
        fetch('https://mlm-app.onrender.com/api/members')
            .then(res => res.json())
            .then(data => setMembers(data))
            .catch(err => console.error("❌ Erreur lors du chargement des membres :", err));
    }, []);

    const handleChange = (e) => {
        setWalletData({ ...walletData, [e.target.name]: e.target.value });
    };

    const handleMemberChange = (e) => {
        setSelectedMember(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedMember) {
            alert("❌ Veuillez sélectionner un membre !");
            return;
        }

        const response = await fetch('https://mlm-app.onrender.com/api/wallets/add-wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ memberId: selectedMember, ...walletData })
        });

        if (response.ok) {
            alert('✅ Wallet ajouté avec succès !');
            navigate('/wallets'); // Retour à la liste des wallets
        } else {
            alert("❌ Erreur lors de l'ajout du wallet.");
        }
    };

    return (
        <div className="form-container">
            <h2>Ajouter un Wallet</h2>
            <form onSubmit={handleSubmit} className="wallet-form">
                <label>Sélectionner un membre :</label>
                <select name="member" onChange={handleMemberChange} required>
                    <option value="">-- Sélectionner un membre --</option>
                    {members.map(member => (
                        <option key={member._id} value={member._id}>
                            {member.firstName} {member.name} ({member.email})
                        </option>
                    ))}
                </select>

                <input type="text" name="walletName" placeholder="Nom du Wallet" value={walletData.walletName} onChange={handleChange} required />
                <input type="text" name="publicAddress" placeholder="Adresse Publique" value={walletData.publicAddress} onChange={handleChange} required />
                <input type="password" name="encryptedPassword" placeholder="Mot de passe (chiffré)" value={walletData.encryptedPassword} onChange={handleChange} required />
                <input type="text" name="secretPhrase" placeholder="Phrase secrète (optionnel)" value={walletData.secretPhrase} onChange={handleChange} />
                
                <button type="submit">Enregistrer</button>
            </form>
        </div>
    );
};

export default WalletForm;