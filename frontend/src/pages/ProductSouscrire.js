import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductSouscrire.css"; // ✅ Import du fichier CSS

const ProductSouscrire = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [amountInvested, setAmountInvested] = useState("");
    const [subscriptionDate, setSubscriptionDate] = useState("");
    const [duration, setDuration] = useState("");
    const [yeld, setYeld] = useState("");

    useEffect(() => {
        if (!productId) {
            alert("❌ Erreur : ID du produit introuvable !");
            return;
        }

        fetch(`https://mlm-app-jhc.fly.dev/api/products/${productId}`)
            .then(res => res.json())
            .then(data => {
                if (!data || data.error) {
                    alert("❌ Erreur lors du chargement du produit: " + (data.error || "Données invalides"));
                    return;
                }

                setProduct(data);
                setAmountInvested(data.amountInvested || "");
                setSubscriptionDate(data.subscriptionDate ? data.subscriptionDate.split("T")[0] : "");
                setDuration(data.duration || "");
                setYeld(data.yeld || "");
            })
            .catch(err => alert("❌ Erreur API: " + err.message));
    }, [productId]);

    const handleUpdate = async () => {
        const token = localStorage.getItem("token");

        if (!amountInvested || !subscriptionDate || !duration || !yeld) {
            alert("⚠️ Veuillez remplir tous les champs.");
            return;
        }

        try {
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/products/update-subscription/${productId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amountInvested,
                    subscriptionDate,
                    duration,
                    yeld
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert("❌ Erreur API : " + (data.error || "Erreur inconnue"));
                return;
            }

            alert("✅ Souscription mise à jour !");
            navigate("/products-enr");
        } catch (error) {
            alert("❌ Erreur lors de la requête API : " + error.message);
        }
    };

    return (
        <div className="container">
            <h1 className="title">📝 Modifier une souscription</h1>

            {product ? (
                <div className="form-container">
                    <p className="product-info">📦 <strong>Produit :</strong> {product.name}</p>
                    <p className="product-info">📖 <strong>Description :</strong> {product.description}</p>

                    <div className="input-group">
                        <label>💰 Montant Investi :</label>
                        <input 
                            type="number"
                            value={amountInvested}
                            onChange={(e) => setAmountInvested(e.target.value)}
                            placeholder="Montant en €"
                        />
                    </div>

                    <div className="input-group">
                        <label>📅 Date de Souscription :</label>
                        <input 
                            type="date"
                            value={subscriptionDate}
                            onChange={(e) => setSubscriptionDate(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>⏳ Durée (mois) :</label>
                        <input 
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>📊 Rendement (%) :</label>
                        <input 
                            type="number"
                            value={yeld}
                            onChange={(e) => setYeld(e.target.value)}
                        />
                    </div>

                    <div className="button-group">
                        <button className="btn-save" onClick={handleUpdate}>💾 Enregistrer</button>
                        <button className="btn-cancel" onClick={() => navigate("/products-enr")}>❌ Annuler</button>
                    </div>
                </div>
            ) : (
                <p className="loading">🔄 Chargement du produit...</p>
            )}
        </div>
    );
};

export default ProductSouscrire;