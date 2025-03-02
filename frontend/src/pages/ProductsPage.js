import React, { useState, useEffect } from 'react';
import './ProductsPage.css';

const ProductsPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        amountInvested: '',
        subscriptionDate: '',
        duration: '',
        yield: '',
        description: ''
    });

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Nombre de produits affichés par page

    useEffect(() => {
        fetch("https://mlm-app-jhc.fly.dev/api/products")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("❌ Erreur chargement des produits :", err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = formData._id ? 'PUT' : 'POST';
        const url = formData._id 
            ? `https://mlm-app-jhc.fly.dev/api/products/${formData._id}`
            : 'https://mlm-app-jhc.fly.dev/api/products';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert(formData._id ? '✅ Produit modifié !' : '✅ Produit ajouté !');
            setFormData({ name: '', amountInvested: '',subscriptionDate: '', duration: '', yield: '', description: '' });
            window.location.reload();
        } else {
            alert("❌ Erreur lors de l'enregistrement.");
        }
    };

    const handleEdit = (product) => {
        if (!product._id) {
            console.error("Erreur : ID du produit introuvable.");
            return;
        }
    
        setFormData(product);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (productId) => {
        if (window.confirm("❌ Supprimer ce produit ?")) {
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/products/${productId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert("✅ Produit supprimé !");
                setProducts(products.filter(product => product._id !== productId));
            } else {
                alert("❌ Erreur lors de la suppression.");
            }
        }
    };

    // Pagination : Calcul des éléments à afficher
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    // Changement de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="products-container">
            <h2>📦 Gestion des Produits</h2>

            {/* Formulaire d'ajout/modification */}
            <form onSubmit={handleSubmit} className="product-form">
                <input type="text" name="name" placeholder="Nom du produit" value={formData.name} onChange={handleChange} required />
                <input type="number" name="amountInvested" placeholder="Montant investit (€)" value={formData.price} onChange={handleChange} required />
                <input type="date" name="subscriptionDate" placeholder="Date de souscription" value={formData.subscriptionDate} onChange={handleChange} required />
                <input type="number" name="duration" placeholder="Durée (mois)" value={formData.duration} onChange={handleChange} />
                <input type="number" name="yeld" placeholder="Rendement (%)" value={formData.yield} onChange={handleChange} />
                <textarea name="description" placeholder="Description du produit" value={formData.description} onChange={handleChange} rows="3"></textarea>

                <button type="submit" className="btn-enregistrer">
                    {formData._id ? '✏️ Modifier' : '💾 Enregistrer'}
                </button>
            </form>

            {/* Liste des produits */}
            <h3>📜 Produits enregistrés</h3>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Montant investit(€)</th>
                        <th>Date de souscription</th>
                        <th>Durée investissement(mois)</th>
                        <th>Rendement(%)</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map(product => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.amountInvested}€</td>
                            <td>{product.subscriptionDate}</td>
                            <td>{product.duration}mois</td>
                            <td>{product.yield}%</td>
                            <td>{product.description}</td>
                            <td>
                                <button className="btn-edit" onClick={() => handleEdit(product)}>✏️ Modifier</button>
                                <button className="btn-delete" onClick={() => handleDelete(product._id)}>🗑️ Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
                {Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, i) => (
                    <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductsPage;