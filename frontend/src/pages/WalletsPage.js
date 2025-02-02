import React, { useState, useEffect } from 'react';

const API_URL = "https://mlm-app.onrender.com/api/wallets";

const WalletsPage = () => {
    const [wallets, setWallets] = useState([]);
    const [formData, setFormData] = useState({ name: '', address: '', password: '', secretPhrase: '' });

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setWallets(data))
            .catch(err => console.error("❌ Erreur chargement des wallets :", err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Wallet ajouté !');
            setFormData({ name: '', address: '', password: '', secretPhrase: '' });
            fetch(API_URL)
                .then(res => res.json())
                .then(data => setWallets(data));
        } else {
            alert("❌ Erreur lors de l'ajout du wallet");
        }
    };

    return (
        <div>
            <h2>Ajouter un Wallet</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Nom du Wallet" onChange={handleChange} required />
                <input type="text" name="address" placeholder="Adresse Publique" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Mot de passe (chiffré)" onChange={handleChange} required />
                <input type="text" name="secretPhrase" placeholder="Phrase secrète (optionnelle)" onChange={handleChange} />
                <button type="submit">Enregistrer</button>
            </form>

            <h2>Liste des Wallets</h2>
            <ul>
                {wallets.map(wallet => (
                    <li key={wallet._id}>
                        {wallet.name} - {wallet.address}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WalletsPage;