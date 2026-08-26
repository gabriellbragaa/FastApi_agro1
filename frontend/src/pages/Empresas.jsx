import React from 'react';
import { Plus, Building2 } from 'lucide-react';

function Empresas() {
    const empresas = [
        { id: 1, razao: "AgroFertil S.A.", cnpj: "12.345.678/0001-90", segmento: "Insumos & Fertilizantes" },
        { id: 2, razao: "Máquinas Agrícolas Brasil", cnpj: "98.765.432/0001-10", segmento: "Maquinários" }
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Empresas Parceiras</h2>
                    <p>Gestão de fornecedores e parceiros corporativos</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Nova Empresa
                </button>
            </div>

            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Razão Social</th>
                            <th>CNPJ</th>
                            <th>Segmento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empresas.map(e => (
                            <tr key={e.id}>
                                <td style={{ fontWeight: 600 }}>{e.razao}</td>
                                <td>{e.cnpj}</td>
                                <td><span className="badge badge-blue">{e.segmento}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Empresas;