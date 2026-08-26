import React, { useState } from 'react';
import { Plus, Sprout, Search } from 'lucide-react';

function Agricultores() {
    const [agricultores, setAgricultores] = useState([
        { id: 1, nome: "Marcos Souza", cultura: "Soja / Milho", areaHectares: "450 ha", cidade: "Cascavel - PR" },
        { id: 2, nome: "Ana Paula Ramos", cultura: "Hortifrúti / Orgânicos", areaHectares: "35 ha", cidade: "Holambra - SP" }
    ]);
    const [search, setSearch] = useState('');

    const filtered = agricultores.filter(a => a.nome.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Agricultores</h2>
                    <p>Gestão de produtores focados em cultivos e plantações</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Novo Agricultor
                </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="Buscar agricultor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: '0.6rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', width: '300px' }}
                />
            </div>

            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Principais Culturas</th>
                            <th>Área Cultivada</th>
                            <th>Localização</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(a => (
                            <tr key={a.id}>
                                <td style={{ fontWeight: 600 }}>{a.nome}</td>
                                <td><span className="badge badge-green">{a.cultura}</span></td>
                                <td>{a.areaHectares}</td>
                                <td>{a.cidade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Agricultores;