import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MembersForm.css';

const MembersForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        sponsorId: '',
        products: []
    });

    const [products, setProducts] = useState([]);
    const [members, setMembers] = useState([]);

    // Charger la liste des produits disponibles
    useEffect(() => {
        fetch("https://mlm-app.onrender.com/api/products")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("❌ Erreur chargement des produits :", err));
    }, []);

    // Charger la liste des membres (pour la sélection du sponsor)
    useEffect(() => {
        fetch("https://mlm-app.onrender.com/api/members")
            .then(res => res.json())
            .then(data => setMembers(data))
            .catch(err => console.error("❌ Erreur chargement des membres :", err));
    }, []);

    // Charger les données du membre sélectionné depuis localStorage
    useEffect(() => {
        const savedMember = localStorage.getItem("selectedMember");
        if (savedMember) {
            setFormData(JSON.parse(savedMember));
            localStorage.removeItem("selectedMember"); // Efface après chargement
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Gestion du sélecteur de produits
    const handleProductChange = (e) => {
        const selectedProducts = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, products: selectedProducts });
    };

    // Gestion du sélecteur de sponsor
    const handleSponsorChange = (e) => {
        const sponsorId = e.target.value;
        setFormData({ ...formData, sponsorId: sponsorId !== "" ? sponsorId : null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérification des champs obligatoires
        if (!formData.firstName || !formData.name || !formData.email) {
            alert("❌ Prénom, Nom et Email sont obligatoires !");
            return;
        }

        // Création de l'objet à envoyer (évite `sponsorId: ""`)
        const dataToSend = {
            ...formData,
            sponsorId: formData.sponsorId && formData.sponsorId.trim() !== "" ? formData.sponsorId : null
        };

        console.log("🔎 Données envoyées :", dataToSend);

        const method = formData._id ? 'PUT' : 'POST';
        const url = formData._id 
            ? `https://mlm-app.onrender.com/api/members/${formData._id}`
            : 'https://mlm-app.onrender.com/api/members';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error("❌ Erreur API :", errorMessage);
                alert("❌ Erreur lors de l'enregistrement : " + errorMessage);
                return;
            }

            alert(formData._id ? '✅ Membre modifié avec succès !' : '✅ Membre ajouté avec succès !');
            navigate('/members-table');
        } catch (error) {
            console.error("❌ Erreur Fetch :", error);
            alert("❌ Erreur réseau ou problème de connexion à l'API.");
        }
    };

    return (
        <div className="form-container">
            <h2>{formData._id ? '✏️ Modifier un membre' : '➕ Ajouter un membre'}</h2>
            <form onSubmit={handleSubmit} className="member-form">
                <input type="text" name="firstName" placeholder="Prénom" value={formData.firstName} onChange={handleChange} required />
                <input type="text" name="name" placeholder="Nom" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleChange} required />
                <input type="text" name="address" placeholder="Adresse" value={formData.address} onChange={handleChange} />

                {/* Sélecteur du sponsor */}
                <label>🧑‍🤝‍🧑 Parrain :</label>
                <select name="sponsorId" value={formData.sponsorId || ""} onChange={handleSponsorChange}>
                    <option value="">Aucun</option>
                    {members.map(member => (
                        <option key={member._id} value={member._id}>
                            {member.firstName} {member.name} ({member.email})
                        </option>
                    ))}
                </select>

                {/* Sélecteur des produits */}
                <label>📦 Produits souscrits :</label>
                <select multiple value={formData.products} onChange={handleProductChange}>
                    {products.map(product => (
                        <option key={product._id} value={product._id}>
                            {product.name} - {product.price}€
                        </option>
                    ))}
                </select>

                <button type="submit">{formData._id ? '✅ Modifier' : '💾 Enregistrer'}</button>
                <button type="button" onClick={() => navigate('/members-table')}>📋 Voir la liste des membres</button>
            </form>
        </div>
    );
};

export default MembersForm;