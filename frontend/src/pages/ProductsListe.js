import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProductsListe = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const memberId = user ? user._id : null;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("https://mlm-app-jhc.fly.dev/api/products");
                const data = await response.json();

                if (!response.ok) {
                    alert("❌ Erreur API Produits : " + (data.error || "Réponse invalide"));
                    setError(data.error || "Réponse invalide");
                    return;
                }

                if (!Array.isArray(data)) {
                    alert("❌ L'API ne retourne pas un tableau !");
                    setError("L'API ne retourne pas un tableau !");
                    return;
                }

                setProducts(data);
            } catch (error) {
                alert("❌ Erreur API Produits : " + error.message);
                setError(error.message);
            }
        };

        fetchProducts();
    }, []);

    const subscribeToProduct = async (productId) => {
        if (!memberId) {
            alert("❌ Erreur : Impossible de récupérer votre ID.");
            return;
        }
    
        const token = localStorage.getItem("token");
    
        try {
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/products/subscribe/${productId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    memberId: memberId, // ✅ Assurer que l'ID est bien envoyé
                    amountInvested: 1000, // ✅ Valeur test, tu peux la modifier
                    subscriptionDate: new Date().toISOString() // ✅ Date actuelle
                })
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                alert("❌ Erreur API Souscription : " + (data.error || "Erreur inconnue"));
                return;
            }
    
            alert("✅ Souscription réussie !");
            navigate("/products-enr"); // ✅ Redirection après souscription
        } catch (error) {
            alert("❌ Erreur lors de la requête API : " + error.message);
        }
    };

    return (
        <div style={containerStyle}>
            <h1>📦 Produits disponibles</h1>
            
            {error && <p style={{ color: "red" }}>{error}</p>}

            {products.length === 0 ? (
                <p>⚠️ Aucun produit disponible.</p>
            ) : (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Montant Investi</th>
                            <th>Durée</th>
                            <th>Rendement (%)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.amountInvested}€</td>
                                <td>{product.duration} mois</td>
                                <td>{product.yield}%</td>
                                <td>
                                    <button 
                                        onClick={() => subscribeToProduct(product._id)} 
                                        style={subscribeButtonStyle}
                                    >
                                        ✅ Ajouter
                                    </button>
                                    <button 
                                        onClick={() => navigate("/products-enr")} 
                                        style={cancelButtonStyle}
                                    >
                                        ❌ Annuler
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const containerStyle = { maxWidth: "800px", margin: "auto", padding: "20px" };
const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "20px", textAlign: "center" };
const subscribeButtonStyle = { 
    padding: "8px", 
    backgroundColor: "#28a745", 
    color: "white", 
    borderRadius: "5px", 
    margin: "5px"  // ✅ Ajoute un espacement autour du bouton
};
const cancelButtonStyle = { 
    padding: "8px", 
    backgroundColor: "#dc3545", 
    color: "white", 
    borderRadius: "5px", 
    margin: "5px"  // ✅ Espacement uniforme autour du bouton
};

export default ProductsListe;