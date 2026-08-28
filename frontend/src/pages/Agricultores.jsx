import React, { useEffect, useState } from 'react';
import { Plus, Search, Trash2, X } from 'lucide-react';
import { agricultoresAPI, produtorAPI } from '../services/api';

function Agricultores() {
    const [agricultores, setAgricultores] = useState([]);
    const [produtores, setProdutores] = useState([]);

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    const [modalAberto, setModalAberto] = useState(false);

    const [form, setForm] = useState({
        id_produtor: '',
        rg: '',
        exp_mercado: '',
        data_nascimento: ''
    });

    // =====================================================
    // CARREGAR DADOS DA API
    // =====================================================
    async function carregarDados() {
        try {
            setLoading(true);
            setErro(null);

            const [agricultoresResponse, produtoresResponse] =
                await Promise.all([
                    agricultoresAPI.listar(),
                    produtorAPI.listar()
                ]);

            console.log("Agricultores:", agricultoresResponse.data);
            console.log("Produtores:", produtoresResponse.data);

            setAgricultores(
                Array.isArray(agricultoresResponse.data)
                    ? agricultoresResponse.data
                    : []
            );

            setProdutores(
                Array.isArray(produtoresResponse.data)
                    ? produtoresResponse.data
                    : []
            );

        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            console.error("URL:", error.config?.url);
            console.error("Resposta:", error.response?.data);

            setErro(
                error.response?.data?.detail ||
                "Não foi possível carregar os dados."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    // =====================================================
    // MANIPULAÇÃO DO FORMULÁRIO E MODAL
    // =====================================================
    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    function abrirModal() {
        setForm({
            id_produtor: '',
            rg: '',
            exp_mercado: '',
            data_nascimento: ''
        });
        setModalAberto(true);
    }

    function fecharModal() {
        setModalAberto(false);
    }

    // =====================================================
    // AÇÕES API (CRIAR E EXCLUIR)
    // =====================================================
    async function adicionarAgricultor(e) {
        e.preventDefault();

        try {
            const dados = {
                id_produtor: Number(form.id_produtor),
                rg: form.rg,
                exp_mercado: form.exp_mercado,
                data_nascimento: form.data_nascimento
            };

            await agricultoresAPI.criar(dados);
            alert('Dados do agricultor cadastrados com sucesso!');
            fecharModal();
            await carregarDados();
        } catch (error) {
            console.error('Erro ao cadastrar agricultor:', error);
            alert(
                error.response?.data?.detail ||
                'Erro ao cadastrar os dados do agricultor.'
            );
        }
    }

    async function excluirAgricultor(idProdutor) {
        const confirmar = window.confirm(
            'Tem certeza que deseja excluir os dados específicos deste agricultor?'
        );

        if (!confirmar) return;

        try {
            await agricultoresAPI.excluir(idProdutor);
            alert('Dados do agricultor excluídos com sucesso!');
            await carregarDados();
        } catch (error) {
            console.error('Erro ao excluir agricultor:', error);
            alert(
                error.response?.data?.detail ||
                'Erro ao excluir os dados do agricultor.'
            );
        }
    }

    // =====================================================
    // MÉTODOS AUXILIARES E FILTRO
    // =====================================================
    function encontrarProdutor(idProdutor) {
        return produtores.find(
            (produtor) => Number(produtor.id_produtor) === Number(idProdutor)
        );
    }

    const agricultoresFiltrados = agricultores.filter((agricultor) => {
        const produtor = encontrarProdutor(agricultor.id_produtor);
        const nome = produtor?.nome || '';
        return nome.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div>
            {/* CABEÇALHO */}
            <div className="page-header">
                <div>
                    <h2>Agricultores</h2>
                    <p>
                        Dados específicos dos produtores classificados como agricultores
                    </p>
                </div>
                <button className="btn-primary" onClick={abrirModal}>
                    <Plus size={18} />
                    Adicionar Dados
                </button>
            </div>

            {/* BARRA DE PESQUISA */}
            <div
                style={{
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}
            >
                <Search size={20} />
                <input
                    type="text"
                    placeholder="Buscar agricultor por nome..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: '0.6rem 1rem',
                        border: '1px solid var(--border-color, #ccc)',
                        borderRadius: 'var(--radius-md, 6px)',
                        width: '300px'
                    }}
                />
            </div>

            {/* FEEDBACK DE CARREGAMENTO E ERRO */}
            {loading && <p style={{ padding: '1rem' }}>Carregando agricultores...</p>}

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

            {/* TABELA DE DADOS */}
            {!loading && !erro && (
                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>ID Produtor</th>
                                <th>Nome</th>
                                <th>RG</th>
                                <th>Experiência de Mercado</th>
                                <th>Data de Nascimento</th>

                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agricultoresFiltrados.length > 0 ? (
                                agricultoresFiltrados.map((agricultor) => {
                                    const produtor = encontrarProdutor(agricultor.id_produtor);

                                    return (
                                        <tr key={agricultor.id_produtor}>
                                            <td>{agricultor.id_produtor}</td>
                                            <td style={{ fontWeight: 600 }}>
                                                {produtor?.nome || 'Produtor não encontrado'}
                                            </td>
                                            <td>{agricultor.rg || '-'}</td>
                                            <td>
                                                <span className="badge badge-green">
                                                    {agricultor.exp_mercado || '-'}
                                                </span>
                                            </td>
                                            <td>{agricultor.data_nascimento || '-'}</td>

                                            <td>
                                                <button
                                                    onClick={() =>
                                                        excluirAgricultor(agricultor.id_produtor)
                                                    }
                                                    style={{
                                                        border: 'none',
                                                        background: 'transparent',
                                                        cursor: 'pointer',
                                                        color: '#dc2626'
                                                    }}
                                                    title="Excluir dados do agricultor"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        style={{ textAlign: 'center', padding: '2rem' }}
                                    >
                                        Nenhum agricultor encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL DE CADASTRO */}
            {modalAberto && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                >
                    <div
                        style={{
                            background: '#fff',
                            padding: '2rem',
                            borderRadius: '12px',
                            width: '90%',
                            maxWidth: '600px',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.5rem'
                            }}
                        >
                            <div>
                                <h2>Dados do Agricultor</h2>
                                <p style={{ marginTop: '5px', color: '#666' }}>
                                    Selecione um produtor cadastrado e informe os dados específicos.
                                </p>
                            </div>
                            <button
                                onClick={fecharModal}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={adicionarAgricultor}>
                            {/* SELEÇÃO DO PRODUTOR */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Produtor</label>
                                <select
                                    name="id_produtor"
                                    value={form.id_produtor}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.7rem',
                                        marginTop: '5px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        background: '#fff'
                                    }}
                                >
                                    <option value="">Selecione um produtor</option>
                                    {produtores.map((produtor) => (
                                        <option
                                            key={produtor.id_produtor}
                                            value={produtor.id_produtor}
                                        >
                                            {produtor.nome} - ID {produtor.id_produtor}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* CAMPO RG */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label>RG</label>
                                <input
                                    type="text"
                                    name="rg"
                                    value={form.rg}
                                    onChange={handleChange}
                                    required
                                    placeholder="Digite o RG"
                                    style={{
                                        width: '100%',
                                        padding: '0.7rem',
                                        marginTop: '5px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px'
                                    }}
                                />
                            </div>

                            {/* CAMPO EXPERIÊNCIA DE MERCADO */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Experiência de Mercado</label>
                                <input
                                    type="text"
                                    name="exp_mercado"
                                    value={form.exp_mercado}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: 5 anos, Vendas locais..."
                                    style={{
                                        width: '100%',
                                        padding: '0.7rem',
                                        marginTop: '5px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px'
                                    }}
                                />
                            </div>

                            {/* CAMPO DATA DE NASCIMENTO */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Data de Nascimento</label>
                                <input
                                    type="date"
                                    name="data_nascimento"
                                    value={form.data_nascimento}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.7rem',
                                        marginTop: '5px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px'
                                    }}
                                />
                            </div>

                            {/* BOTAO DE ACAO */}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '10px',
                                    marginTop: '1.5rem'
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={fecharModal}
                                    style={{
                                        padding: '0.7rem 1.2rem',
                                        border: '1px solid #ccc',
                                        background: '#fff',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{
                                        padding: '0.7rem 1.2rem',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Agricultores;