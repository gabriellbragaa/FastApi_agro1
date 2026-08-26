from pydantic import BaseModel
from typing import List, Optional
from datetime import date

# --- PRODUTOR ---

class ProdutorBase(BaseModel):
    nome: str
    endereco: str

class ProdutorCreate(ProdutorBase):
    pass

class Produtor(ProdutorBase):
    id_produtor: int

    class Config:
        orm_mode = True

# --- AGRICULTOR ---

class AgricultorCreate(BaseModel):
    nome: str
    endereco: str
    rg: str
    cpf: str
    exp_mercado: int
    data_nascimento: date
    telefone: str

# --- PARCERIA ---

class ParceriaBase(BaseModel):
    id_empresa: int
    id_cooperativa: int

class ParceriaCreate(ParceriaBase):
    pass

class Parceria(ParceriaBase):
    id_parceria: Optional[int]

    class Config:
        orm_mode = True

# --- RESUMO PARCERIAS ---

class ResumoParcerias(BaseModel):
    empresa: str
    capacidade_producao: int
    total_parcerias: int
    produtores_relacionados: str

    class Config:
        orm_mode = True

# --- ANÁLISE RECURSOS ---

class AnaliseRecursos(BaseModel):
    id_recurso: int
    qualidade: str
    valor_mercado: float
    status_valor: str
    produtores_relacionados: int
    tipos_produtores: str

    class Config:
        orm_mode = True

# --- FUNCIONARIO ---

class FuncionarioBase(BaseModel):
    nome: str
    setor: str

class FuncionarioCreate(FuncionarioBase):
    pass

class Funcionario(FuncionarioBase):
    id_func: int

    class Config:
        orm_mode = True

# --- EMPRESA ---

class EmpresaBase(BaseModel):
    cnpj: str
    nome_fantasia: str
    tempo_atuacao: int

class EmpresaCreate(EmpresaBase):
    pass

class Empresa(EmpresaBase):
    id_empresa: int

    class Config:
        orm_mode = True
