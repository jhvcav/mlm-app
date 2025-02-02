import React, { useState, useEffect } from 'react';

const API_URL = "https://mlm-app.onrender.com/api/progress";

const ProgressPage = () => {
    const [progressData, setProgressData] = useState([]);

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setProgressData(data))
            .catch(err => console.error("❌ Erreur chargement progression :", err));
    }, []);

    return (
        <div>
            <h2>Suivi de la progression des membres</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Parrainages</th>
                        <th>Commissions (USDT)</th>
                        <th>Niveau</th>
                    </tr>
                </thead>
                <tbody>
                    {progressData.map(member => (
                        <tr key={member._id}>
                            <td>{member.name}</td>
                            <td>{member.referrals}</td>
                            <td>{member.commissions} USDT</td>
                            <td>{member.level}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProgressPage;