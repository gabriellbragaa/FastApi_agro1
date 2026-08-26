import React, { useState } from 'react';
import { Plus, Beef } from 'lucide-react';

function Pecuaristas() {
    const [pecuaristas] = useState([
        { id: 1, nome: "Roberto Mendes", rebanho: "Gado Nelore (Corte)", cabecas: 1200, cidade: "Uberaba - MG" },
        { id: 2, nome: "Fernanda Lima", rebanho: "Holandês (Leiteiro)", cabecas: 350, cidade: "Castro - PR" }
    ]);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Pecuaristas</h2>
                    <p>Gestão de produtores de pecuária de corte e leiteira</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Novo Pecuarista
                </button>
            </div>

            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Tipo de Rebanho</th>
                            <th>Nº de Cabeças</th>
                            <th>Localização</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pecuaristas.map(p => (
                            <tr key={p.id}>
                                <td style={{ fontWeight: 600 }}>{p.nome}</td>
                                <td><span className="badge badge-blue">{p.rebanho}</span></td>
                                <td><strong>{p.cabecas}</strong> cab.</td>
                                <td>{p.cidade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Pecuaristas;