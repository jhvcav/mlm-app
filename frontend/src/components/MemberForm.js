import React, { useState, useEffect } from 'react';

const MemberForm = () => {
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

    useEffect(() => {
        fetch('https://jhvcav.github.io/members')
            .then(res => res.json())
            .then(data => setMembers(data));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('https://jhvcav.github.io/members', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            alert('Membre ajouté !');
            setFormData({ name: '', email: '', phone: '', address: '' });
        }
    };

    return (
        <div>
            <h2>Ajouter un membre</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Nom" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Téléphone" onChange={handleChange} required />
                <input type="text" name="address" placeholder="Adresse" onChange={handleChange} />
                <button type="submit">Enregistrer</button>
            </form>
            <h2>Liste des membres</h2>
            <ul>
                {members.map(member => (
                    <li key={member._id}>{member.name} - {member.email}</li>
                ))}
            </ul>
        </div>
    );
};

export default MemberForm;