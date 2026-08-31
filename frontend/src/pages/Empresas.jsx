import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { empresaAPI } from '../services/api';

function Empresas() {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    const [modalAberto, setModalAberto] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [novaEmpresa, setNovaEmpresa] = useState({
        nome_fantasia: '',
        cnpj: '',
        tempo_atuacao: ''
    });

    // =====================================================
    // FUNÇÕES DE MÁSCARA E FORMATAÇÃO DE CNPJ
    // =====================================================
    function aplicarMascaraCNPJ(value) {
        if (!value) return '';
        return value
            .replace(/\D/g, '')
            .slice(0, 14)
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    }

    function limparCNPJ(value) {
        return String(value || '').replace(/\D/g, '');
    }

    // =====================================================
    // CARREGAR EMPRESAS
    // =====================================================
    async function carregarEmpresas() {
        try {
            setLoading(true);
            setErro(null);
            const response = await empresaAPI.listar();

            if (Array.isArray(response.data)) {
                setEmpresas(response.data);
            } else {
                setErro('Formato de dados inválido retornado pelo servidor.');
            }
        } catch (error) {
            console.error('Erro ao carregar empresas:', error);
            setErro(error.response?.data?.detail || 'Não foi possível carregar as empresas.');
        } finally {
            setLoading(false);
        }
    }

    // =====================================================
    // CRIAR EMPRESA
    // =====================================================
    async function handleCriarEmpresa(e) {
        e.preventDefault();

        const cnpjLimpo = limparCNPJ(novaEmpresa.cnpj);

        if (cnpjLimpo.length !== 14) {
            alert('Por favor, informe um CNPJ válido com 14 dígitos.');
            return;
        }

        try {
            setSalvando(true);
            await empresaAPI.criar({
                nome_fantasia: novaEmpresa.nome_fantasia,
                cnpj: cnpjLimpo, // Envia sem pontuação ao Backend
                tempo_atuacao: novaEmpresa.tempo_atuacao ? parseInt(novaEmpresa.tempo_atuacao, 10) : null
            });

            setNovaEmpresa({ nome_fantasia: '', cnpj: '', tempo_atuacao: '' });
            setModalAberto(false);
            carregarEmpresas();
        } catch (error) {
            console.error('Erro ao cadastrar empresa:', error);
            alert(error.response?.data?.detail || 'Erro ao cadastrar empresa.');
        } finally {
            setSalvando(false);
        }
    }

    // =====================================================
    // EXCLUIR EMPRESA
    // =====================================================
    async function handleExcluir(id, nome) {
        if (!window.confirm(`Tem certeza que deseja excluir "${nome || 'esta empresa'}"?`)) return;

        try {
            await empresaAPI.excluir(id);
            setEmpresas((prev) => prev.filter((emp) => emp.id_empresa !== id));
        } catch (error) {
            console.error('Erro ao excluir:', error);
            alert(error.response?.data?.detail || 'Não foi possível excluir.');
        }
    }

    useEffect(() => {
        carregarEmpresas();
    }, []);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h2>Empresas Parceiras</h2>
                    <p>Gestão de fornecedores e parceiros corporativos</p>
                </div>
                <button className="btn-primary" onClick={() => setModalAberto(true)}>
                    <Plus size={18} /> Nova Empresa
                </button>
            </div>

            {loading && <p style={{ padding: '1rem' }}>Carregando empresas...</p>}
            {erro && <div style={{ padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '8px' }}>{erro}</div>}

            {!loading && !erro && (
                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Nome Fantasia</th>
                                <th>CNPJ</th>
                                <th>Tempo de Atuação</th>
                                <th style={{ textAlign: 'center', width: '80px' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empresas.length > 0 ? (
                                empresas.map((emp) => (
                                    <tr key={emp.id_empresa}>
                                        <td style={{ fontWeight: 600 }}>{emp.nome_fantasia || '-'}</td>
                                        <td>{aplicarMascaraCNPJ(emp.cnpj)}</td>
                                        <td>{emp.tempo_atuacao ? `${emp.tempo_atuacao} anos` : '-'}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleExcluir(emp.id_empresa, emp.nome_fantasia)}
                                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem' }}>
                                        Nenhuma empresa encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL */}
            {modalAberto && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', borderRadius: '8px', padding: '1.5rem', width: '100%', maxWidth: '450px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3>Nova Empresa</h3>
                            <button onClick={() => setModalAberto(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCriarEmpresa}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome Fantasia</label>
                                <input
                                    type="text"
                                    required
                                    value={novaEmpresa.nome_fantasia}
                                    onChange={(e) => setNovaEmpresa({ ...novaEmpresa, nome_fantasia: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>CNPJ</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="00.000.000/0000-00"
                                    maxLength={18}
                                    value={novaEmpresa.cnpj}
                                    onChange={(e) =>
                                        setNovaEmpresa({
                                            ...novaEmpresa,
                                            cnpj: aplicarMascaraCNPJ(e.target.value) // Formata dinamicamente
                                        })
                                    }
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tempo de Atuação (anos)</label>
                                <input
                                    type="number"
                                    value={novaEmpresa.tempo_atuacao}
                                    onChange={(e) => setNovaEmpresa({ ...novaEmpresa, tempo_atuacao: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                <button type="button" onClick={() => setModalAberto(false)} style={{ padding: '0.5rem 1rem' }}>Cancelar</button>
                                <button type="submit" disabled={salvando} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                                    {salvando ? 'Salvando...' : 'Salvar Empresa'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Empresas;