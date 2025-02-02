import React, { useState, useEffect } from 'react';

const API_URL = "https://mlm-app.onrender.com/api/products";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({ name: '', price: '', duration: '', commission: '', level: '' });

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("❌ Erreur chargement des produits :", err));
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
            alert('Produit ajouté !');
            setFormData({ name: '', price: '', duration: '', commission: '', level: '' });
            fetch(API_URL)
                .then(res => res.json())
                .then(data => setProducts(data));
        } else {
            alert("❌ Erreur lors de l'ajout du produit");
        }
    };

    return (
        <div>
            <h2>Ajouter un produit</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Nom" onChange={handleChange} required />
                <input type="number" name="price" placeholder="Prix" onChange={handleChange} required />
                <input type="text" name="duration" placeholder="Durée" onChange={handleChange} required />
                <input type="text" name="commission" placeholder="Commission" onChange={handleChange} required />
                <input type="text" name="level" placeholder="Niveau MLM" onChange={handleChange} required />
                <button type="submit">Enregistrer</button>
            </form>

            <h2>Liste des produits</h2>
            <ul>
                {products.map(product => (
                    <li key={product._id}>{product.name} - {product.price} USDT</li>
                ))}
            </ul>
        </div>
    );
};

export default ProductsPage;