import React from 'react';
import { Plus, Package } from 'lucide-react';

function Recursos() {
    const recursos = [
        { id: 1, nome: "Trator 4x4 110cv", categoria: "Equipamento", quantidade: 5, status: "Disponível" },
        { id: 2, nome: "Sementes Transgênicas Soja", categoria: "Insumo", quantidade: 120, status: "Em Estoque" }
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Recursos Disponíveis</h2>
                    <p>Catálogo de equipamentos e insumos para compartilhamento/venda</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Adicionar Recurso
                </button>
            </div>

            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Recurso</th>
                            <th>Categoria</th>
                            <th>Qtd.</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recursos.map(r => (
                            <tr key={r.id}>
                                <td style={{ fontWeight: 600 }}>{r.nome}</td>
                                <td>{r.categoria}</td>
                                <td>{r.quantidade}</td>
                                <td><span className="badge badge-green">{r.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Recursos;