import React, { useState } from 'react';
import { Plus, UserRound } from 'lucide-react';

function Clientes() {
    const [clientes] = useState([
        { id: 1, nome: "Supermercados Primordial", segmento: "Varejo Alimentício", compras: "34 pedidos", cidade: "São Paulo - SP" },
        { id: 2, nome: "Frigorífico Boi Bom", segmento: "Industria de Carnes", compras: "12 pedidos", cidade: "Goiânia - GO" }
    ]);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Clientes</h2>
                    <p>Compradores diretos da produção e serviços da plataforma</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Novo Cliente
                </button>
            </div>

            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Nome / Razão Social</th>
                            <th>Segmento</th>
                            <th>Histórico</th>
                            <th>Cidade / UF</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(c => (
                            <tr key={c.id}>
                                <td style={{ fontWeight: 600 }}>{c.nome}</td>
                                <td><span className="badge badge-blue">{c.segmento}</span></td>
                                <td>{c.compras}</td>
                                <td>{c.cidade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Clientes;