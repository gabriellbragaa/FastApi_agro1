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
                console.log("Dados recebidos do FastAPI:", data);

                if (Array.isArray(data)) {
                    setProdutores(data);
                } else {
                    console.error(
                        "O backend não retornou um array:",
                        data
                    );

                    setErro(
                        "Formato de dados inválido retornado pelo servidor."
                    );
                }

                setLoading(false);
            })
            .catch((err) => {
                console.error(
                    "Erro ao conectar com o FastAPI:",
                    err
                );

                setErro(
                    "Não foi possível conectar ao servidor backend."
                );

                setLoading(false);
            });
    }, []);

    return (
        <div>
            {/* CABEÇALHO */}
            <div className="page-header">
                <div>
                    <h2>Produtores Rurais</h2>

                    <p>
                        Gestão de agricultores e pecuaristas
                        cadastrados no AgroLinker
                    </p>
                </div>

                <button className="btn-primary">
                    <Plus size={18} />
                    Novo Produtor
                </button>
            </div>

            {/* CARREGANDO */}
            {loading && (
                <p style={{ padding: '1rem' }}>
                    Carregando produtores...
                </p>
            )}

            {/* ERRO */}
            {erro && (
                <div
                    style={{
                        padding: '1rem',
                        background: '#fee2e2',
                        color: '#dc2626',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                    }}
                >
                    <strong>Atenção:</strong> {erro}
                </div>
            )}

            {/* TABELA */}
            {!loading && (
                <div className="table-container">
                    <table className="custom-table">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Tipo</th>
                                <th>Endereço</th>
                            </tr>
                        </thead>

                        <tbody>
                            {produtores.length > 0 ? (

                                produtores.map((p) => (

                                    <tr key={p.id_produtor}>

                                        {/* ID */}
                                        <td>
                                            {p.id_produtor}
                                        </td>

                                        {/* NOME */}
                                        <td
                                            style={{
                                                fontWeight: 600
                                            }}
                                        >
                                            {p.nome}
                                        </td>

                                        {/* TIPO */}
                                        <td>
                                            <span
                                                className={`badge ${p.tipo === 'Agricultor'
                                                    ? 'badge-green'
                                                    : 'badge-blue'
                                                    }`}
                                            >
                                                {p.tipo}
                                            </span>
                                        </td>

                                        {/* ENDEREÇO */}
                                        <td>
                                            {p.endereco}
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td
                                        colSpan="4"
                                        style={{
                                            textAlign: 'center',
                                            padding: '1.5rem'
                                        }}
                                    >
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