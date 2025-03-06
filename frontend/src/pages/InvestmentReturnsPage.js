import React, { useState } from "react";
import "./InvestmentReturnsPage.css";

const InvestmentReturnsPage = () => {
    const [capital, setCapital] = useState("1000"); // ⬅ Stockage en string pour éviter le 0 bloqué
    const [duration, setDuration] = useState("12"); // ⬅ Stockage en string pour éviter le 0 bloqué
    const [yieldPercentage, setYieldPercentage] = useState(5); // Rendement en %
    const [results, setResults] = useState([]); // Tableau des résultats

    // ✅ Calculer les rendements et mettre à jour le tableau
    const calculateReturns = () => {
        const parsedCapital = capital === "" ? 0 : Number(capital); // ⬅ Conversion en Number ici
        const parsedDuration = duration === "" ? 0 : Number(duration); // ⬅ Conversion en Number ici
        const totalReturn = (parsedCapital * (yieldPercentage / 100) * parsedDuration).toFixed(2);
        const dailyReturn = (totalReturn / 30).toFixed(2);

        const newResult = {
            capital: parsedCapital,
            duration: parsedDuration,
            yieldPercentage: yieldPercentage,
            totalReturn: totalReturn,
            dailyReturn: dailyReturn,
        };

        setResults([...results, newResult]);
    };

    // ✅ Fonction pour effacer le tableau
    const clearTable = () => {
        setResults([]);
    };

    return (
        <div className="investment-container">
            <h1>📊 Simulation de Rendements</h1>

            {/* ✅ Formulaire pour entrer les critères */}
            <div className="input-container">
                <label>💰 Capital Investi ($) :</label>
                <input 
                    type="text" 
                    value={capital} 
                    onChange={(e) => setCapital(e.target.value.replace(/\D/, ""))} // ⬅ Empêcher les caractères non numériques
                />

                <label>⏳ Durée d'investissement (mois) :</label>
                <input 
                    type="text" 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value.replace(/\D/, ""))} // ⬅ Empêcher les caractères non numériques
                />

                <label>📈 Rendement (%) :</label>
                <input type="number" value={yieldPercentage} onChange={(e) => setYieldPercentage(Number(e.target.value))} />

                <button className="btn-calculate" onClick={calculateReturns}>📊 Calculer Rendement</button>
                <button className="btn-clear" onClick={clearTable}>🗑️ Clear</button>
            </div>

            {/* ✅ Tableau des résultats */}
            {results.length > 0 && (
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>Capital ($)</th>
                            <th>Durée (mois)</th>
                            <th>Rendement (%)</th>
                            <th>Résultat ($)</th>
                            <th>Résultat ($/j)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={index}>
                                <td>{result.capital}</td>
                                <td>{result.duration}</td>
                                <td>{result.yieldPercentage}%</td>
                                <td>{result.totalReturn}</td>
                                <td>{result.dailyReturn}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default InvestmentReturnsPage;