import React, { useState, useEffect } from 'react';

const MembersPage = () => {
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        console.log("📡 Envoi de la requête API vers Render...");
        setIsLoading(true);
        setError(null);

        const controller = new AbortController();
        const signal = controller.signal;

        fetch('https://mlm-app.onrender.com/api/members', { signal })
            .then(res => {
                if (!res.ok) throw new Error("Erreur API Render");
                return res.json();
            })
            .then(data => {
                console.log("✅ Membres récupérés :", data);
                setMembers(data);
            })
            .catch(err => {
                if (err.name === "AbortError") {
                    console.log("⏹️ Requête annulée (changement de page)");
                } else {
                    console.error("❌ Erreur de chargement des membres :", err);
                    setError("Impossible de charger les membres depuis Render.");
                }
            })
            .finally(() => setIsLoading(false));

        return () => controller.abort();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId
            ? `https://mlm-app.onrender.com/api/members/${editingId}`
            : 'https://mlm-app.onrender.com/api/members';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert(editingId ? 'Membre modifié !' : 'Membre ajouté !');
            setFormData({ name: '', email: '', phone: '', address: '' });
            setEditingId(null);
            window.location.reload();
        } else {
            alert("Erreur lors de l'enregistrement.");
        }
    };

    const handleEdit = (member) => {
        setFormData(member);
        setEditingId(member._id);
    };

    return (
        <div>
            <h2>{editingId ? 'Modifier un membre' : 'Ajouter un membre'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
                <input type="text" name="name" placeholder="Nom" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleChange} required />
                <input type="text" name="address" placeholder="Adresse" value={formData.address} onChange={handleChange} />
                <button type="submit">{editingId ? 'Modifier' : 'Enregistrer'}</button>
            </form>

            <h2>Liste des membres</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isLoading ? <p>Chargement des membres...</p> : (
                <ul>
                    {members.length > 0 ? (
                        members.map(member => (
                            <li key={member._id}>
                                <strong>{member.name}</strong> ({member.email}) - {member.phone}
                                <button onClick={() => handleEdit(member)} style={{ marginLeft: '10px' }}>Modifier</button>
                            </li>
                        ))
                    ) : (
                        <p>Aucun membre trouvé.</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default MembersPage;