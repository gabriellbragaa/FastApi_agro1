import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

function Produtores() {
    const [produtores, setProdutores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/produtor')
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Erro na requisição: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                // Garante que o retorno seja sempre um Array antes de salvar no estado
                if (Array.isArray(data)) {
                    setProdutores(data);
                } else {
                    console.error("O backend não retornou um array:", data);
                    setErro("Formato de dados inválido retornado pelo servidor.");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao conectar com o FastAPI:", err);
                setErro("Não foi possível conectar ao servidor backend.");
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Produtores Rurais</h2>
                    <p>Gestão de agricultores e pecuaristas cadastrados no AgroLinker</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} /> Novo Produtor
                </button>
            </div>

            {loading && <p style={{ padding: '1rem' }}>Carregando produtores...</p>}

            {erro && (
                <div style={{ padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '1rem' }}>
                    <strong>Atenção:</strong> {erro} (Exibindo modo de demonstração off-line)
                </div>
            )}

            {!loading && (
                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Tipo</th>
                                <th>Especialidade / Cultura</th>
                                <th>Localização</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtores.length > 0 ? (
                                produtores.map((p) => (
                                    <tr key={p.id}>
                                        <td style={{ fontWeight: 600 }}>{p.nome}</td>
                                        <td>
                                            <span className={`badge ${p.tipo === 'Agricultor' ? 'badge-green' : 'badge-blue'}`}>
                                                {p.tipo}
                                            </span>
                                        </td>
                                        <td>{p.cultura}</td>
                                        <td>{p.cidade}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem' }}>
                                        Nenhum produtor encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Produtores;