import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import "./Dashboard.css";

const Dashboard = () => {
    const [members, setMembers] = useState([]);
    const [productsPerMember, setProductsPerMember] = useState({});
    const [monthlyRegistrations, setMonthlyRegistrations] = useState({});

    useEffect(() => {
        fetch("https://mlm-app.onrender.com/api/members")
            .then(res => res.json())
            .then(data => {
                setMembers(data);
                processProductData(data);
                processRegistrationData(data);
            })
            .catch(err => console.error("Erreur chargement des membres :", err));
    }, []);

    // 1️⃣ Calcul du % des produits souscrits par membre
    const processProductData = (members) => {
        let productCounts = {};
        members.forEach(member => {
            let count = member.products ? member.products.length : 0;
            productCounts[count] = (productCounts[count] || 0) + 1;
        });
        setProductsPerMember(productCounts);
    };

    // 2️⃣ Evolution des membres inscrits mois par mois
    const processRegistrationData = (members) => {
        let monthlyCounts = {};
        members.forEach(member => {
            const date = new Date(member.createdAt);
            const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
            monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        });
        setMonthlyRegistrations(monthlyCounts);
    };

    return (
        <div className="dashboard">
            <h2>📊 Tableau de Bord</h2>

            {/* Graphique 1 : Nombre total de membres */}
            <div className="chart-container">
                <h3>👥 Membres enregistrés</h3>
                <Pie
                    data={{
                        labels: ["Total Membres"],
                        datasets: [
                            {
                                label: "Membres",
                                data: [members.length],
                                backgroundColor: ["#007bff"],
                            },
                        ],
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                />
            </div>

            {/* Graphique 2 : Produits souscrits par membre en % */}
            <div className="chart-container">
                <h3>📦 Produits souscrits par membre (%)</h3>
                <Bar
                    data={{
                        labels: Object.keys(productsPerMember).map(key => `${key} produit(s)`),
                        datasets: [
                            {
                                label: "Membres",
                                data: Object.values(productsPerMember),
                                backgroundColor: ["#28a745"],
                            },
                        ],
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                />
            </div>

            {/* Graphique 3 : Évolution des membres enregistrés mois par mois */}
            <div className="chart-container">
                <h3>📅 Évolution des Membres (Mois/Mois)</h3>
                <Line
                    data={{
                        labels: Object.keys(monthlyRegistrations),
                        datasets: [
                            {
                                label: "Membres inscrits",
                                data: Object.values(monthlyRegistrations),
                                borderColor: "#ff5733",
                                fill: false,
                            },
                        ],
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                />
            </div>
        </div>
    );
};

export default Dashboard;