import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductModifier.css";

const ProductModifier = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        amountInvested: "",
        subscriptionDate: "",
        duration: "",
        yeld: "",
        description: "",
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://mlm-app-jhc.fly.dev/api/products/${productId}`);
                const data = await response.json();

                if (!response.ok) {
                    alert("❌ Erreur API : " + (data.error || "Réponse invalide"));
                    return;
                }

                setProduct(data);
                setFormData({
                    name: data.name,
                    amountInvested: data.amountInvested,
                    subscriptionDate: data.subscriptionDate.split("T")[0],
                    duration: data.duration,
                    yeld: data.yeld,
                    description: data.description,
                });
            } catch (error) {
                alert("❌ Erreur lors du chargement du produit : " + error.message);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/products/${productId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                alert("❌ Erreur API : " + (data.error || "Impossible de modifier"));
                return;
            }

            alert("✅ Produit modifié avec succès !");
            navigate("/products-enr");
        } catch (error) {
            alert("❌ Erreur lors de la modification : " + error.message);
        }
    };

    return (
        <div className="product-modifier-container">
            <h1>✏️ Modifier un produit</h1>

            {product ? (
                <form onSubmit={handleSubmit} className="product-form">
                    <label>📦 Nom :</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                    <label>💰 Montant Investi :</label>
                    <input type="number" name="amountInvested" value={formData.amountInvested} onChange={handleChange} required />

                    <label>📅 Date de Souscription :</label>
                    <input type="date" name="subscriptionDate" value={formData.subscriptionDate} onChange={handleChange} required />

                    <label>⏳ Durée :</label>
                    <input type="text" name="duration" value={formData.duration} onChange={handleChange} required />

                    <label>📈 Rendement :</label>
                    <input type="number" name="yeld" value={formData.yeld} onChange={handleChange} required />

                    <label>📝 Description :</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="4"></textarea>

                    {/* ✅ Boutons bien positionnés sous le formulaire */}
                    <div className="button-container">
                        <button type="submit" className="btn-save">✅ Enregistrer</button>
                        <button type="button" className="btn-cancel" onClick={() => navigate("/products-enr")}>❌ Annuler</button>
                    </div>
                </form>
            ) : (
                <p>Chargement...</p>
            )}
        </div>
    );
};

export default ProductModifier;