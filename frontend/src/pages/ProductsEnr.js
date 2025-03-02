import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductsEnr.css"; // Fichier CSS pour le style

const ProductsEnr = () => {
    const [subscribedProducts, setSubscribedProducts] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const memberId = user ? user._id : null;
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!memberId) {
            alert("❌ Erreur : Impossible de récupérer votre ID !");
            return;
        }

        const fetchSubscribedProducts = async () => {
            try {
                const apiUrl = `https://mlm-app-jhc.fly.dev/api/products/subscribed/${memberId}`;
                const response = await fetch(apiUrl, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await response.json();

                if (!response.ok) {
                    alert("❌ Erreur API : " + (data.error || "Réponse invalide"));
                    return;
                }

                setSubscribedProducts(data);
            } catch (error) {
                alert("❌ Erreur lors du chargement des produits souscrits : " + error.message);
            }
        };

        fetchSubscribedProducts();
    }, [memberId, token]);

    const handleEdit = (product) => {
        if (!product || !product._id) {
            alert("❌ Erreur : ID du produit introuvable.");
            return;
        }
    
        navigate(`/product-modifier/${product._id}`);
    };

    const handleDelete = async (productId) => {
        if (!memberId) {
            alert("❌ Erreur : ID du membre introuvable.");
            return;
        }
        if (window.confirm("⚠️ Voulez-vous vraiment supprimer cette souscription ?")) {
            try {
                const response = await fetch(`https://mlm-app-jhc.fly.dev/api/products/unsubscribe/${productId}/${memberId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();
                if (!response.ok) {
                    alert("❌ Erreur API: " + (data.error || "Impossible de supprimer"));
                    return;
                }
                alert("✅ Souscription supprimée avec succès !");
                setSubscribedProducts(subscribedProducts.filter(product => product._id !== productId));
            } catch (error) {
                alert("❌ Erreur lors de la requête API : " + error.message);
            }
        }
    };

    return (
        <div className="products-enr-container">
            <h1>📦 Produits souscrits</h1>
            
            {/* Bouton souscrire placé juste sous le titre */}
            <div className="subscribe-container">
                <button onClick={() => navigate("/products-liste")} className="btn-subscribe">
                    ➕ Souscrire à un produit
                </button>
            </div>

            {subscribedProducts.length === 0 ? (
                <p className="no-products">⚠️ Aucun produit souscrit.</p>
            ) : (
                <div className="cards-container">
                    {subscribedProducts.map(product => (
                        <div key={product._id} className="product-card">
                            <h3>{product.name}</h3>
                            <p><strong>Montant Investi :</strong> {product.amountInvested}€</p>
                            <p>
                                <strong>Date de souscription :</strong>{" "}
                                {new Date(product.subscriptionDate).toLocaleDateString()}
                            </p>
                            <p><strong>Durée :</strong> {product.duration}</p>
                            <p><strong>Rendement :</strong> {product.yeld}%</p>
                            <div className="card-actions">
                                <button onClick={() => handleEdit(product)} className="btn-action btn-edit">
                                    ✏️ Modifier
                                </button>
                                <button onClick={() => handleDelete(product._id)} className="btn-action btn-delete">
                                    ❌ Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductsEnr;