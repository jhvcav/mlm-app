import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./Dashboard.css";

const Dashboard = () => {
    const [member, setMember] = useState(null);
    const [products, setProducts] = useState([]);
    const [affiliatesPerMonth, setAffiliatesPerMonth] = useState({});
    const [subscribedProducts, setSubscribedProducts] = useState([]);
    const [affiliatesPerProduct, setAffiliatesPerProduct] = useState({});

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user._id) {
            fetchMemberData(user._id);
            fetchProducts();
        }
    }, []);

    // 1️⃣ Charger les informations du membre connecté
    const fetchMemberData = async (memberId) => {
        try {
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/auth/members/${memberId}`);
            const data = await response.json();
            setMember(data);
            fetchAffiliates(memberId);
            fetchSubscribedProducts(memberId);
        } catch (error) {
            console.error("❌ Erreur chargement des données du membre :", error);
        }
    };

    // 2️⃣ Charger la liste des produits disponibles
    const fetchProducts = async () => {
        try {
            const response = await fetch("https://mlm-app-jhc.fly.dev/api/products");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("❌ Erreur chargement des produits :", error);
        }
    };

    // 3️⃣ Récupération des affiliés et comptabilisation des inscriptions par mois
    const fetchAffiliates = async (memberId) => {
        try {
            const response = await fetch("https://mlm-app-jhc.fly.dev/api/members");
            const allMembers = await response.json();

            // 🔹 Filtrer uniquement les affiliés du membre connecté
            const affiliates = allMembers.filter(member => member.sponsorId === memberId);

            let monthlyCounts = {};
            let productCounts = {};

            affiliates.forEach(affiliate => {
                // 🗓️ Comptage des inscriptions par mois
                const date = new Date(affiliate.createdAt);
                const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
                monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;

                // 📦 Comptage des affiliés par produit souscrit
                if (affiliate.products) {
                    affiliate.products.forEach(product => {
                        productCounts[product.name] = (productCounts[product.name] || 0) + 1;
                    });
                }
            });

            setAffiliatesPerMonth(monthlyCounts);
            setAffiliatesPerProduct(productCounts);
        } catch (error) {
            console.error("❌ Erreur lors du chargement des affiliés :", error);
        }
    };

    // 4️⃣ Récupérer les produits souscrits par le membre connecté
    const fetchSubscribedProducts = async (memberId) => {
        try {
            const response = await fetch(`https://mlm-app-jhc.fly.dev/api/products/subscribed/${memberId}`);
            const data = await response.json();
            setSubscribedProducts(data);
        } catch (error) {
            console.error("❌ Erreur chargement des produits souscrits :", error);
        }
    };

    if (!member) return <p>⏳ Chargement des données...</p>;

    return (
        <div className="dashboard">
            <h2>📊 Tableau de Bord</h2>

            {/* ✅ Camembert : Produits souscrits par le membre */}
            <div className="chart-container">
                <h3>📦 Produits souscrits</h3>
                {subscribedProducts.length > 0 ? (
                    <Pie
                        data={{
                            labels: subscribedProducts.map(product => product.name),
                            datasets: [
                                {
                                    label: "Produits",
                                    data: subscribedProducts.map(() => 1), // Chaque produit souscrit = 1
                                    backgroundColor: subscribedProducts.map(
                                        (_, index) => `hsl(${index * 60}, 70%, 50%)` // 🎨 Générer des couleurs dynamiques
                                    ),
                                },
                            ],
                        }}
                        options={{ responsive: true, maintainAspectRatio: false }}
                    />
                ) : (
                    <p>⛔ Aucun produit souscrit.</p>
                )}
            </div>

            {/* ✅ Histogramme : Nombre d'affiliés inscrits par mois */}
            <div className="chart-container">
                <h3>📅 Nombre Affiliés Inscrits par Mois</h3>
                <Bar
                    data={{
                        labels: Object.keys(affiliatesPerMonth),
                        datasets: [
                            {
                                label: "Inscriptions",
                                data: Object.values(affiliatesPerMonth),
                                backgroundColor: "#ff5733",
                            },
                        ],
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                />
            </div>

            {/* ✅ Camembert : Affiliés enregistrés par produit */}
            <div className="chart-container">
                <h3>👥 Affiliés par produit</h3>
                {Object.keys(affiliatesPerProduct).length > 0 ? (
                    <Pie
                        data={{
                            labels: Object.keys(affiliatesPerProduct),
                            datasets: [
                                {
                                    label: "Affiliés par produit",
                                    data: Object.values(affiliatesPerProduct),
                                    backgroundColor: Object.keys(affiliatesPerProduct).map(
                                        (_, index) => `hsl(${index * 60}, 70%, 50%)`
                                    ),
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: true, position: "bottom" },
                            },
                        }}
                    />
                ) : (
                    <p>⛔ Aucun affilié inscrit par produit.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;