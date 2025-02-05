import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MembersForm.css';

const MembersForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        memberId: '',
        firstName: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        registrationDate: new Date().toISOString().split('T')[0], // Date d'inscription par défaut
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

    // Supprimer un membre
    const handleDelete = async () => {
        if (!formData._id) return;
        if (window.confirm("⚠️ Voulez-vous vraiment supprimer ce membre et ses données ?")) {
            try {
                await fetch(`https://mlm-app.onrender.com/api/members/${formData._id}`, {
                    method: 'DELETE'
                });
                alert("🗑️ Membre supprimé avec succès !");
                navigate('/members-table');
            } catch (error) {
                alert("❌ Erreur lors de la suppression.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Vérification des champs obligatoires
        if (!formData.firstName || !formData.name || !formData.email) {
            alert("❌ Prénom, Nom et Email sont obligatoires !");
            return;
        }
    
        // Nettoyage des données avant l'envoi
        const dataToSend = {
            ...formData,
            sponsorId: formData.sponsorId && formData.sponsorId.trim() !== "" ? formData.sponsorId : null,
            products: Array.isArray(formData.products) ? formData.products.filter(p => p) : []
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
            
            {/* Affichage de l'ID du membre */}
            {formData._id && (
                <p><strong>ID Membre :</strong> {formData.memberId}</p>
            )}

            <form onSubmit={handleSubmit} className="member-form">
                <input type="text" name="firstName" placeholder="Prénom" value={formData.firstName} onChange={handleChange} required />
                <input type="text" name="name" placeholder="Nom" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleChange} required />
                <input type="text" name="address" placeholder="Adresse" value={formData.address} onChange={handleChange} />

                {/* Nouveau champ Pays */}
                <input type="text" name="country" placeholder="Pays" value={formData.country} onChange={handleChange} required />

                {/* Nouveau champ Ville */}
                <input type="text" name="city" placeholder="Ville" value={formData.city} onChange={handleChange} required />

                {/* Nouveau champ Date d'inscription avec sélecteur de calendrier */}
                <label>📅 Date d'inscription :</label>
                <input type="date" name="registrationDate" value={formData.registrationDate} onChange={handleChange} required />

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
                
                {/* Bouton de suppression du membre */}
                {formData._id && (
                    <button type="button" onClick={handleDelete} className="delete-btn">🗑️ Supprimer</button>
                )}

                <button type="button" onClick={() => navigate('/members-table')}>📋 Voir la liste des membres</button>
            </form>
        </div>
    );
};

export default MembersForm;