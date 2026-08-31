
import React, { useEffect, useState } from 'react';
import { Plus, Search, Trash2, X } from 'lucide-react';
import { pecuaristaAPI, produtorAPI } from '../services/api';

function Pecuaristas() {
    const [pecuaristas, setPecuaristas] = useState([]);
    const [produtores, setProdutores] = useState([]);

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    const [modalAberto, setModalAberto] = useState(false);

    const [form, setForm] = useState({
        id_produtor: '',
        nome: '',
        rg: '',
        endereco: '',
        cnpj: '',
        qualidade_produto: ''
    });

    // =====================================================
    // CARREGAR DADOS DA API
    // =====================================================

    async function carregarDados() {
        try {
            setLoading(true);
            setErro(null);

            const [pecuaristasResponse, produtoresResponse] =
                await Promise.all([
                    pecuaristaAPI.listar(),
                    produtorAPI.listar()
                ]);

            console.log('Pecuaristas:', pecuaristasResponse.data);
            console.log('Produtores:', produtoresResponse.data);

            setPecuaristas(
                Array.isArray(pecuaristasResponse.data)
                    ? pecuaristasResponse.data
                    : []
            );

            setProdutores(
                Array.isArray(produtoresResponse.data)
                    ? produtoresResponse.data
                    : []
            );

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            console.error('URL:', error.config?.url);
            console.error('Resposta:', error.response?.data);

            setErro(
                error.response?.data?.detail ||
                'Não foi possível carregar os dados.'
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    // =====================================================
    // MANIPULAÇÃO DO FORMULÁRIO
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
            nome: '',
            rg: '',
            endereco: '',
            cnpj: '',
            qualidade_produto: ''
        });

        setModalAberto(true);
    }

    function fecharModal() {
        setModalAberto(false);
    }

    // =====================================================
    // CADASTRAR PECUARISTA
    // =====================================================

    async function adicionarPecuarista(e) {
        e.preventDefault();

        try {
            const dados = {
                id_produtor: Number(form.id_produtor),
                nome: form.nome,
                rg: form.rg,
                endereco: form.endereco || null,
                cnpj: form.cnpj || null,
                qualidade_produto: form.qualidade_produto
            };

            console.log('Enviando pecuarista:', dados);

            await pecuaristaAPI.criar(dados);

            alert('Dados do pecuarista cadastrados com sucesso!');

            fecharModal();

            await carregarDados();

        } catch (error) {
            console.error('Erro ao cadastrar pecuarista:', error);
            console.error('Resposta:', error.response?.data);

            alert(
                error.response?.data?.detail ||
                'Erro ao cadastrar os dados do pecuarista.'
            );
        }
    }

    // =====================================================
    // EXCLUIR PECUARISTA
    // =====================================================

    async function excluirPecuarista(idProdutor) {
        const confirmar = window.confirm(
            'Tem certeza que deseja excluir os dados específicos deste pecuarista?'
        );

        if (!confirmar) return;

        try {
            await pecuaristaAPI.excluir(idProdutor);

            alert('Dados do pecuarista excluídos com sucesso!');

            await carregarDados();

        } catch (error) {
            console.error('Erro ao excluir pecuarista:', error);

            alert(
                error.response?.data?.detail ||
                'Erro ao excluir os dados do pecuarista.'
            );
        }
    }

    // =====================================================
    // ENCONTRAR PRODUTOR
    // =====================================================

    function encontrarProdutor(idProdutor) {
        return produtores.find(
            (produtor) =>
                Number(produtor.id_produtor) === Number(idProdutor)
        );
    }

    // =====================================================
    // FILTRO
    // =====================================================

    const pecuaristasFiltrados = pecuaristas.filter((pecuarista) => {
        const texto = search.toLowerCase();

        return (
            String(pecuarista.id_produtor)
                .toLowerCase()
                .includes(texto) ||

            String(pecuarista.nome || '')
                .toLowerCase()
                .includes(texto) ||

            String(pecuarista.rg || '')
                .toLowerCase()
                .includes(texto) ||

            String(pecuarista.cnpj || '')
                .toLowerCase()
                .includes(texto) ||

            String(pecuarista.qualidade_produto || '')
                .toLowerCase()
                .includes(texto)
        );
    });

    // =====================================================
    // INTERFACE
    // =====================================================

    return (
        <div>

            {/* CABEÇALHO */}
            <div className="page-header">
                <div>
                    <h2>Pecuaristas</h2>

                    <p>
                        Dados específicos dos produtores classificados como
                        Pecuaristas
                    </p>
                </div>

                <button
                    className="btn-primary"
                    onClick={abrirModal}
                >
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
                    placeholder="Buscar pecuarista..."
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

            {/* CARREGANDO */}
            {loading && (
                <p style={{ padding: '1rem' }}>
                    Carregando Pecuaristas...
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
            {!loading && !erro && (
                <div className="table-container">

                    <table className="custom-table">

                        <thead>
                            <tr>
                                <th>ID Produtor</th>
                                <th>Nome</th>
                                <th>RG</th>
                                <th>Endereço</th>
                                <th>CNPJ</th>
                                <th>Qualidade do Produto</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>

                            {pecuaristasFiltrados.length > 0 ? (

                                pecuaristasFiltrados.map((pecuarista) => {

                                    return (
                                        <tr
                                            key={pecuarista.id_produtor}
                                        >

                                            <td>
                                                {pecuarista.id_produtor}
                                            </td>

                                            <td
                                                style={{
                                                    fontWeight: 600
                                                }}
                                            >
                                                {pecuarista.nome || '-'}
                                            </td>

                                            <td>
                                                {pecuarista.rg || '-'}
                                            </td>

                                            <td>
                                                {pecuarista.endereco || '-'}
                                            </td>

                                            <td>
                                                {pecuarista.cnpj || '-'}
                                            </td>

                                            <td>
                                                <span className="badge badge-green">
                                                    {pecuarista.qualidade_produto || '-'}
                                                </span>
                                            </td>

                                            <td>

                                                <button
                                                    onClick={() =>
                                                        excluirPecuarista(
                                                            pecuarista.id_produtor
                                                        )
                                                    }
                                                    style={{
                                                        border: 'none',
                                                        background: 'transparent',
                                                        cursor: 'pointer',
                                                        color: '#dc2626'
                                                    }}
                                                    title="Excluir dados do pecuarista"
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
                                        colSpan="7"
                                        style={{
                                            textAlign: 'center',
                                            padding: '2rem'
                                        }}
                                    >
                                        Nenhum pecuarista encontrado.
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>
            )}

            {/* MODAL */}
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

                        {/* CABEÇALHO DO MODAL */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.5rem'
                            }}
                        >

                            <div>

                                <h2>
                                    Dados do Pecuarista
                                </h2>

                                <p
                                    style={{
                                        marginTop: '5px',
                                        color: '#666'
                                    }}
                                >
                                    Selecione um produtor e informe os
                                    dados específicos da pecuária.
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

                        {/* FORMULÁRIO */}
                        <form onSubmit={adicionarPecuarista}>

                            {/* PRODUTOR */}
                            <div
                                style={{
                                    marginBottom: '1rem'
                                }}
                            >

                                <label>
                                    Produtor
                                </label>

                                <select
                                    name="id_produtor"
                                    value={form.id_produtor}
                                    onChange={(e) => {
                                        const id = e.target.value;

                                        const produtor =
                                            encontrarProdutor(id);

                                        setForm((prev) => ({
                                            ...prev,
                                            id_produtor: id,
                                            nome: produtor?.nome || ''
                                        }));
                                    }}
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

                                    <option value="">
                                        Selecione um produtor
                                    </option>

                                    {produtores
                                        .filter(
                                            (produtor) =>
                                                produtor.tipo?.toLowerCase() ===
                                                'pecuarista'
                                        )
                                        .map((produtor) => (

                                            <option
                                                key={produtor.id_produtor}
                                                value={produtor.id_produtor}
                                            >
                                                {produtor.nome} - ID{' '}
                                                {produtor.id_produtor}
                                            </option>

                                        ))}

                                </select>

                            </div>

                            {/* NOME */}
                            <div
                                style={{
                                    marginBottom: '1rem'
                                }}
                            >

                                <label>
                                    Nome
                                </label>

                                <input
                                    type="text"
                                    name="nome"
                                    value={form.nome}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nome do pecuarista"
                                    style={{
                                        width: '100%',
                                        padding: '0.7rem',
                                        marginTop: '5px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px'
                                    }}
                                />

                            </div>

                            {/* RG */}
                            <div
                                style={{
                                    marginBottom: '1rem'
                                }}
                            >

                                <label>
                                    RG
                                </label>

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

                            {/* ENDEREÇO */}
                            <div
                                style={{
                                    marginBottom: '1rem'
                                }}
                            >

                                <label>
                                    Endereço
                                </label>

                                <input
                                    type="text"
                                    name="endereco"
                                    value={form.endereco}
                                    onChange={handleChange}
                                    placeholder="Digite o endereço"
                                    style={{
                                        width: '100%',
                                        padding: '0.7rem',
                                        marginTop: '5px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px'
                                    }}
                                />

                            </div>

                            {/* CNPJ */}
                            <div
                                style={{
                                    marginBottom: '1rem'
                                }}
                            >

                                <label>
                                    CNPJ
                                </label>

                                <input
                                    type="text"
                                    name="cnpj"
                                    value={form.cnpj}
                                    onChange={handleChange}
                                    placeholder="00.000.000/0000-00"
                                    maxLength="18"
                                    style={{
                                        width: '100%',
                                        padding: '0.7rem',
                                        marginTop: '5px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px'
                                    }}
                                />

                            </div>

                            {/* QUALIDADE DO PRODUTO */}
                            <div
                                style={{
                                    marginBottom: '1rem'
                                }}
                            >

                                <label>
                                    Qualidade do Produto
                                </label>

                                <input
                                    type="text"
                                    name="qualidade_produto"
                                    value={form.qualidade_produto}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: Alta, Média, Baixa"
                                    style={{
                                        width: '100%',
                                        padding: '0.7rem',
                                        marginTop: '5px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px'
                                    }}
                                />

                            </div>

                            {/* BOTÕES */}
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

export default Pecuaristas;

