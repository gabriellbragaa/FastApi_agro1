import React, { useState } from 'react';
import { Plus, BriefcaseBusiness } from 'lucide-react';

function Funcionarios() {
    const [funcionarios] = useState([
        { id: 1, nome: "Lucas Andrade", cargo: "Agrônomo Responsável", fazenda: "Fazenda Santa Maria", status: "Ativo" },
        { id: 2, nome: "Juliana Costa", cargo: "Operadora de Maquinário", fazenda: "Fazenda Boa Vista", status: "Ativo" }
    ]);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Funcionários</h2>
                    <p>Gestão da equipe técnica e operacional do campo</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Novo Funcionário
                </button>
            </div>

            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Cargo / Função</th>
                            <th>Alocado em</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {funcionarios.map(f => (
                            <tr key={f.id}>
                                <td style={{ fontWeight: 600 }}>{f.nome}</td>
                                <td>{f.cargo}</td>
                                <td>{f.fazenda}</td>
                                <td><span className="badge badge-green">{f.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Funcionarios;