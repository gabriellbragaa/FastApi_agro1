from fastapi import APIRouter, HTTPException
from db import get_connection
from typing import List, Optional
from pydantic import BaseModel
from models import Empresa, EmpresaUpdate

router = APIRouter()


@router.post("/", response_model=Empresa)
async def criar_empresa(cnpj: str, nome_fantasia: Optional[str] = None, tempo_atuacao: Optional[int] = None):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            """INSERT INTO empresa (cnpj, nome_fantasia, tempo_atuacao) 
            VALUES (%s, %s, %s) 
            RETURNING id_empresa, cnpj, nome_fantasia, tempo_atuacao""",
            (cnpj, nome_fantasia, tempo_atuacao)
        )
        nova_empresa = cur.fetchone()
        conn.commit()
        return {
            "id_empresa": nova_empresa[0],
            "cnpj": nova_empresa[1],
            "nome_fantasia": nova_empresa[2],
            "tempo_atuacao": nova_empresa[3]
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao criar empresa: {str(e)}")
    finally:
        cur.close()
        conn.close()

@router.get("/", response_model=List[Empresa])
async def listar_empresas():
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id_empresa, cnpj, nome_fantasia, tempo_atuacao FROM empresa")
        empresas = cur.fetchall()
        return [
            {
                "id_empresa": e[0],
                "cnpj": e[1],
                "nome_fantasia": e[2],
                "tempo_atuacao": e[3]
            } for e in empresas
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao listar empresas: {str(e)}")
    finally:
        cur.close()
        conn.close()

@router.get("/{id_empresa}", response_model=Empresa)
async def obter_empresa(id_empresa: int):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT id_empresa, cnpj, nome_fantasia, tempo_atuacao FROM empresa WHERE id_empresa = %s",
            (id_empresa,)
        )
        empresa = cur.fetchone()
        if not empresa:
            raise HTTPException(status_code=404, detail="Empresa não encontrada")
        return {
            "id_empresa": empresa[0],
            "cnpj": empresa[1],
            "nome_fantasia": empresa[2],
            "tempo_atuacao": empresa[3]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter empresa: {str(e)}")
    finally:
        cur.close()
        conn.close()

@router.put("/{id_empresa}", response_model=Empresa)
async def atualizar_empresa(id_empresa: int, empresa_update: EmpresaUpdate):
    conn = get_connection()
    cur = conn.cursor()
    try:
        # Verifica se a empresa existe
        cur.execute("SELECT 1 FROM empresa WHERE id_empresa = %s", (id_empresa,))
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Empresa não encontrada")

        # Atualiza apenas os campos fornecidos
        campos = []
        valores = []
        if empresa_update.cnpj is not None:
            campos.append("cnpj = %s")
            valores.append(empresa_update.cnpj)
        if empresa_update.nome_fantasia is not None:
            campos.append("nome_fantasia = %s")
            valores.append(empresa_update.nome_fantasia)
        if empresa_update.tempo_atuacao is not None:
            campos.append("tempo_atuacao = %s")
            valores.append(empresa_update.tempo_atuacao)

        if not campos:
            raise HTTPException(status_code=400, detail="Nenhum campo fornecido para atualização")

        valores.append(id_empresa)
        query = f"""
            UPDATE empresa 
            SET {', '.join(campos)} 
            WHERE id_empresa = %s 
            RETURNING id_empresa, cnpj, nome_fantasia, tempo_atuacao
        """
        cur.execute(query, valores)
        empresa_atualizada = cur.fetchone()
        conn.commit()

        return {
            "id_empresa": empresa_atualizada[0],
            "cnpj": empresa_atualizada[1],
            "nome_fantasia": empresa_atualizada[2],
            "tempo_atuacao": empresa_atualizada[3]
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao atualizar empresa: {str(e)}")
    finally:
        cur.close()
        conn.close()

@router.delete("/{id_empresa}")
async def deletar_empresa(id_empresa: int):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM empresa WHERE id_empresa = %s RETURNING id_empresa", (id_empresa,))
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Empresa não encontrada")
        conn.commit()
        return {"message": "Empresa deletada com sucesso"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao deletar empresa: {str(e)}")
    finally:
        cur.close()
        conn.close()