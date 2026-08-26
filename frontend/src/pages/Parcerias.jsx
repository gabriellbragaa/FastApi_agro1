import React from 'react';
import { Handshake, Plus } from 'lucide-react';

function Parcerias() {
    const parcerias = [
        { id: 1, partes: "João Silva + AgroFertil", inicio: "10/01/2026", status: "Ativa" },
        { id: 2, partes: "Carlos Eduardo + Máquinas Brasil", inicio: "15/02/2026", status: "Em Negociação" }
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Parcerias Ativas</h2>
                    <p>Contratos e cooperação mútua na rede AgroLinker</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Nova Parceria
                </button>
            </div>

            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Parceria</th>
                            <th>Data de Início</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcerias.map(p => (
                            <tr key={p.id}>
                                <td style={{ fontWeight: 600 }}>{p.partes}</td>
                                <td>{p.inicio}</td>
                                <td>
                                    <span className={`badge ${p.status === 'Ativa' ? 'badge-green' : 'badge-orange'}`}>
                                        {p.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Parcerias;