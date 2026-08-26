from pydantic import BaseModel
from typing import Optional


# ============================================================
# PRODUTOR
# ============================================================

class ProdutorCreate(BaseModel):
    nome: str
    endereco: Optional[str] = None
    tipo: str


class Produtor(BaseModel):
    id_produtor: int
    nome: str
    endereco: Optional[str] = None
    tipo: str


class ProdutorUpdate(BaseModel):
    nome: Optional[str] = None
    endereco: Optional[str] = None
    tipo: Optional[str] = None


# ============================================================
# AGRICULTOR
# ============================================================

class Agricultor(BaseModel):
    id_produtor: int
    nome: str
    rg: Optional[str] = None
    cpf: Optional[str] = None
    exp_mercado: int
    data_nascimento: Optional[str] = None
    telefone: Optional[str] = None


class AgricultorUpdate(BaseModel):
    nome: Optional[str] = None
    rg: Optional[str] = None
    cpf: Optional[str] = None
    exp_mercado: Optional[int] = None
    data_nascimento: Optional[str] = None
    telefone: Optional[str] = None


# ============================================================
# PECUARISTA
# ============================================================

class Pecuarista(BaseModel):
    id_produtor: int
    nome: str
    rg: str
    endereco: Optional[str] = None
    cnpj: Optional[str] = None
    qualidade_produto: str


class PecuaristaUpdate(BaseModel):
    nome: Optional[str] = None
    rg: Optional[str] = None
    endereco: Optional[str] = None
    cnpj: Optional[str] = None
    qualidade_produto: Optional[str] = None


# ============================================================
# PARCERIA
# ============================================================

class Parceria(BaseModel):
    id_empresa: int
    id_cooperativa: int


class ParceriaUpdate(BaseModel):
    id_empresa: Optional[int] = None
    id_cooperativa: Optional[int] = None


# ============================================================
# FUNCIONÁRIO
# ============================================================

class Funcionario(BaseModel):
    id_func: int
    nome: str
    rg: Optional[str] = None
    endereco: Optional[str] = None
    setor: str
    id_admin: Optional[int] = None


class FuncionarioUpdate(BaseModel):
    nome: Optional[str] = None
    rg: Optional[str] = None
    endereco: Optional[str] = None
    setor: Optional[str] = None
    id_admin: Optional[int] = None


# ============================================================
# RECURSO
# ============================================================

class Recurso(BaseModel):
    id_recurso: int
    qualidade: str
    logistica: Optional[str] = None
    armazenamento: Optional[str] = None
    quantidade: int
    valor_mercado: float
    demandas: str


class RecursoUpdate(BaseModel):
    qualidade: Optional[str] = None
    logistica: Optional[str] = None
    armazenamento: Optional[str] = None
    quantidade: Optional[int] = None
    valor_mercado: Optional[float] = None
    demandas: Optional[str] = None


# ============================================================
# CLIENTE
# ============================================================

class Cliente(BaseModel):
    id_cliente: int
    nome: str
    cnpj: Optional[str] = None
    telefone: Optional[str] = None
    endereco: Optional[str] = None


class ClienteUpdate(BaseModel):
    nome: Optional[str] = None
    cnpj: Optional[str] = None
    telefone: Optional[str] = None
    endereco: Optional[str] = None


# ============================================================
# ADMINISTRADOR
# ============================================================

class Administrador(BaseModel):
    id_admin: int
    nome: str
    rg: Optional[str] = None
    id_associado: int


class AdministradorUpdate(BaseModel):
    nome: Optional[str] = None
    rg: Optional[str] = None


# ============================================================
# COOPERATIVA
# ============================================================

class CooperativaCompletaCreate(BaseModel):
    id_cooperativa: int
    telefone: Optional[str] = None
    capacidade_producao: Optional[int] = None


# ============================================================
# EMPRESA
# ============================================================

class Empresa(BaseModel):
    id_empresa: int
    cnpj: str
    nome_fantasia: Optional[str] = None
    tempo_atuacao: Optional[int] = None


class EmpresaUpdate(BaseModel):
    cnpj: Optional[str] = None
    nome_fantasia: Optional[str] = None
    tempo_atuacao: Optional[int] = None