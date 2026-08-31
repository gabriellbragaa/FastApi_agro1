
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { produtorAPI } from '../services/api';

function Produtores() {


    const [produtores, setProdutores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    const [modalAberto, setModalAberto] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);

    const [sugestoesEndereco, setSugestoesEndereco] = useState([]);

    const [form, setForm] = useState({
        id_produtor: '',
        nome: '',
        endereco: '',
        tipo: ''
    });

    // =====================================================
    // CARREGAR PRODUTORES
    // =====================================================

    async function carregarProdutores() {
        try {
            setLoading(true);
            setErro(null);

            const response = await produtorAPI.listar();

            console.log(
                'Dados recebidos do FastAPI:',
                response.data
            );

            if (Array.isArray(response.data)) {
                setProdutores(response.data);
            } else {
                setErro(
                    'Formato de dados inválido retornado pelo servidor.'
                );
            }

        } catch (error) {
            console.error(
                'Erro ao conectar com o FastAPI:',
                error
            );

            console.error(
                'Resposta:',
                error.response?.data
            );

            setErro(
                error.response?.data?.detail ||
                'Não foi possível conectar ao servidor backend.'
            );

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarProdutores();
    }, []);

    // =====================================================
    // FORMULÁRIO
    // =====================================================

    function handleChange(e) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    // =====================================================
    // ABRIR MODAL PARA NOVO PRODUTOR
    // =====================================================

    async function buscarEndereco(endereco) {
        if (!endereco || endereco.trim().length < 5) {
            setSugestoesEndereco([]);
            return;
        }

        try {
            const params = new URLSearchParams({
                q: endereco.trim(),
                format: 'jsonv2',
                addressdetails: '1',
                countrycodes: 'br',
                limit: '5',
                'accept-language': 'pt-BR'
            });

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?${params.toString()}`,
                {
                    headers: {
                        Accept: 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Erro HTTP ${response.status}`);
            }

            const dados = await response.json();

            setSugestoesEndereco(dados);

        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            setSugestoesEndereco([]);
        }
    }

    function abrirNovoProdutor() {
        setModoEdicao(false);

        setForm({
            id_produtor: '',
            nome: '',
            endereco: '',
            tipo: ''
        });

        setModalAberto(true);
    }

    // =====================================================
    // ABRIR MODAL PARA EDITAR
    // =====================================================

    function editarProdutor(produtor) {
        setModoEdicao(true);

        setForm({
            id_produtor: produtor.id_produtor,
            nome: produtor.nome || '',
            endereco: produtor.endereco || '',
            tipo: produtor.tipo || ''
        });

        setModalAberto(true);
    }

    // =====================================================
    // FECHAR MODAL
    // =====================================================

    function fecharModal() {
        setModalAberto(false);

        setForm({
            id_produtor: '',
            nome: '',
            endereco: '',
            tipo: ''
        });
    }

    // =====================================================
    // SALVAR PRODUTOR
    // =====================================================

    async function salvarProdutor(e) {
        e.preventDefault();

        try {
            const dados = {
                nome: form.nome,
                endereco: form.endereco,
                tipo: form.tipo
            };

            console.log('Dados enviados:', dados);

            if (modoEdicao) {

                await produtorAPI.atualizar(
                    form.id_produtor,
                    dados
                );

                alert(
                    'Produtor atualizado com sucesso!'
                );

            } else {

                await produtorAPI.criar(dados);

                alert(
                    'Produtor cadastrado com sucesso!'
                );
            }

            fecharModal();

            await carregarProdutores();

        } catch (error) {

            console.error(
                'Erro ao salvar produtor:',
                error
            );

            console.error(
                'Resposta:',
                error.response?.data
            );

            alert(
                error.response?.data?.detail ||
                'Erro ao salvar produtor.'
            );
        }
    }

    // =====================================================
    // EXCLUIR PRODUTOR
    // =====================================================

    async function excluirProdutor(id) {

        const confirmar = window.confirm(
            'Tem certeza que deseja excluir este produtor?\n\n' +
            'Atenção: se este produtor possuir dados de Agricultor, ' +
            'Pecuarista ou outros registros relacionados, eles poderão ' +
            'ser excluídos devido às regras de chave estrangeira.'
        );

        if (!confirmar) {
            return;
        }

        try {

            await produtorAPI.excluir(id);

            alert(
                'Produtor excluído com sucesso!'
            );

            await carregarProdutores();

        } catch (error) {

            console.error(
                'Erro ao excluir produtor:',
                error
            );

            console.error(
                'Resposta:',
                error.response?.data
            );

            alert(
                error.response?.data?.detail ||
                'Erro ao excluir produtor.'
            );
        }
    }

    // =====================================================
    // INTERFACE
    // =====================================================

    return (
        <div>

            {/* =================================================
                CABEÇALHO
            ================================================= */}

            <div className="page-header">

                <div>

                    <h2>
                        Produtores Rurais
                    </h2>

                    <p>
                        Gestão de agricultores e pecuaristas
                        cadastrados no AgroLinker
                    </p>

                </div>

                <button
                    className="btn-primary"
                    onClick={abrirNovoProdutor}
                >
                    <Plus size={18} />
                    Novo Produtor
                </button>

            </div>

            {/* =================================================
                CARREGANDO
            ================================================= */}

            {loading && (
                <p style={{ padding: '1rem' }}>
                    Carregando produtores...
                </p>
            )}

            {/* =================================================
                ERRO
            ================================================= */}

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

                    <strong>
                        Atenção:
                    </strong>{' '}

                    {erro}

                </div>
            )}

            {/* =================================================
                TABELA
            ================================================= */}

            {!loading && !erro && (

                <div className="table-container">

                    <table className="custom-table">

                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    Nome
                                </th>

                                <th>
                                    Tipo
                                </th>

                                <th>
                                    Endereço
                                </th>

                                <th>
                                    Ações
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {produtores.length > 0 ? (

                                produtores.map((p) => (

                                    <tr
                                        key={p.id_produtor}
                                    >

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
                                            {p.endereco || '-'}
                                        </td>

                                        {/* AÇÕES */}
                                        <td>

                                            <div
                                                style={{
                                                    display: 'flex',
                                                    gap: '10px'
                                                }}
                                            >

                                                {/* EDITAR */}
                                                <button
                                                    onClick={() =>
                                                        editarProdutor(p)
                                                    }
                                                    style={{
                                                        border: 'none',
                                                        background: 'transparent',
                                                        cursor: 'pointer',
                                                        color: '#2563eb'
                                                    }}
                                                    title="Editar produtor"
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                {/* EXCLUIR */}
                                                <button
                                                    onClick={() =>
                                                        excluirProdutor(
                                                            p.id_produtor
                                                        )
                                                    }
                                                    style={{
                                                        border: 'none',
                                                        background: 'transparent',
                                                        cursor: 'pointer',
                                                        color: '#dc2626'
                                                    }}
                                                    title="Excluir produtor"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="5"
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

            {/* =================================================
                MODAL
            ================================================= */}

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
                            maxWidth: '550px'
                        }}
                    >

                        {/* CABEÇALHO */}

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
                                    {modoEdicao
                                        ? 'Editar Produtor'
                                        : 'Novo Produtor'
                                    }
                                </h2>

                                <p
                                    style={{
                                        marginTop: '5px',
                                        color: '#666'
                                    }}
                                >
                                    {modoEdicao
                                        ? 'Altere os dados do produtor.'
                                        : 'Cadastre um novo produtor rural.'
                                    }
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

                        <form onSubmit={salvarProdutor}>

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
                                    placeholder="Digite o nome do produtor"
                                    style={{
                                        width: '100%',
                                        padding: '0.7rem',
                                        marginTop: '5px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        boxSizing: 'border-box'
                                    }}
                                />

                            </div>

                            {/* ENDEREÇO */}

                            <div style={{ marginBottom: '1rem', position: 'relative' }}>
                                <label>Endereço</label>
                                <input
                                    type="text"
                                    name="endereco"
                                    value={form.endereco}
                                    onChange={(e) => {
                                        const valor = e.target.value;

                                        setForm((prev) => ({
                                            ...prev,
                                            endereco: valor
                                        }));

                                        if (valor.trim().length < 5) {
                                            setSugestoesEndereco([]);
                                            return;
                                        }

                                        clearTimeout(window.timerEndereco);

                                        window.timerEndereco = setTimeout(() => {
                                            buscarEndereco(valor);
                                        }, 700);
                                    }}
                                    placeholder="Ex.: Rua Jereissati, Fortaleza - CE"
                                    style={{
                                        width: '100%',
                                        padding: '0.7rem',
                                        marginTop: '5px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        boxSizing: 'border-box'
                                    }}
                                />

                                {sugestoesEndereco.length > 0 && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            right: 0,
                                            background: '#fff',
                                            border: '1px solid #ddd',
                                            borderRadius: '6px',
                                            zIndex: 2000,
                                            maxHeight: '200px',
                                            overflowY: 'auto'
                                        }}
                                    >
                                        {sugestoesEndereco.map((endereco, index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        endereco: endereco.display_name
                                                    }));

                                                    setSugestoesEndereco([]);
                                                }}
                                                style={{
                                                    padding: '10px',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #eee'
                                                }}
                                            >
                                                📍 {endereco.display_name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* TIPO */}

                            <div
                                style={{
                                    marginBottom: '1rem'
                                }}
                            >

                                <label>
                                    Tipo de Produtor
                                </label>

                                <select
                                    name="tipo"
                                    value={form.tipo}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.7rem',
                                        marginTop: '5px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        background: '#fff',
                                        boxSizing: 'border-box'
                                    }}
                                >

                                    <option value="">
                                        Selecione o tipo
                                    </option>

                                    <option value="Agricultor">
                                        Agricultor
                                    </option>

                                    <option value="Pecuarista">
                                        Pecuarista
                                    </option>

                                </select>

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
                                    {modoEdicao
                                        ? 'Salvar Alterações'
                                        : 'Cadastrar Produtor'
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Produtores;

