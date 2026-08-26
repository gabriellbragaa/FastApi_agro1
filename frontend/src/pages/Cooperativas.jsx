import React, { useState } from 'react';
import { Plus, Building } from 'lucide-react';

function Cooperativas() {
    const [cooperativas] = useState([
        { id: 1, nome: "Cooperativa AgroAgro", regiao: "Sul de Minas", cooperados: 450, tipo: "Grãos e Café" },
        { id: 2, nome: "Coopertativa do Vale", regiao: "Oeste Baiano", cooperados: 180, tipo: "Algodão e Soja" }
    ]);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Cooperativas</h2>
                    <p>Associações e cooperativas parceiras conectadas à rede</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Nova Cooperativa
                </button>
            </div>

            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Nome da Cooperativa</th>
                            <th>Especialidade</th>
                            <th>Região de Atuação</th>
                            <th>Nº Cooperados</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cooperativas.map(c => (
                            <tr key={c.id}>
                                <td style={{ fontWeight: 600 }}>{c.nome}</td>
                                <td><span className="badge badge-orange">{c.tipo}</span></td>
                                <td>{c.regiao}</td>
                                <td><strong>{c.cooperados}</strong> membros</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Cooperativas;