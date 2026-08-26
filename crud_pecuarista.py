from fastapi import APIRouter, HTTPException
from typing import List
from db import get_connection
from models import Pecuarista, PecuaristaUpdate

router = APIRouter()

@router.post("/Pecuarista")
async def criar_pecuarista(pec: Pecuarista):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO pecuarista (id_produtor, nome, rg, endereco, cnpj, qualidade_produto) VALUES (%s, %s, %s, %s, %s, %s)",
            (pec.id_produtor, pec.nome, pec.rg, pec.endereco, pec.cnpj, pec.qualidade_produto)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao criar pecuarista: {e}")
    finally:
        cur.close()
        conn.close()
    return {"msg": "Pecuarista criado com sucesso"}

@router.get("/Pecuaristas", response_model=List[Pecuarista])
async def listar_pecuaristas():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id_produtor, nome, rg, endereco, cnpj, qualidade_produto FROM pecuarista")
    pecuaristas = cur.fetchall()
    cur.close()
    conn.close()
    return [
        Pecuarista(
            id_produtor=r[0],
            nome=r[1],
            rg=r[2],
            endereco=r[3],
            cnpj=r[4],
            qualidade_produto=r[5]
        ) for r in pecuaristas
    ]

@router.get("/Pecuarista/{id_produtor}", response_model=Pecuarista)
async def obter_pecuarista(id_produtor: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id_produtor, nome, rg, endereco, cnpj, qualidade_produto FROM pecuarista WHERE id_produtor = %s", (id_produtor,))
    p = cur.fetchone()
    cur.close()
    conn.close()
    if not p:
        raise HTTPException(status_code=404, detail="Pecuarista não encontrado")
    return Pecuarista(
        id_produtor=p[0],
        nome=p[1],
        rg=p[2],
        endereco=p[3],
        cnpj=p[4],
        qualidade_produto=p[5]
    )

@router.patch("/Pecuarista/{id_produtor}", response_model=Pecuarista)
async def atualizar_pecuarista(id_produtor: int, pec: PecuaristaUpdate):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id_produtor FROM pecuarista WHERE id_produtor = %s", (id_produtor,))
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Pecuarista não encontrado")
        
        campos, valores = [], []
        if pec.nome is not None:
            campos.append("nome = %s")
            valores.append(pec.nome)
        if pec.rg is not None:
            campos.append("rg = %s")
            valores.append(pec.rg)
        if pec.endereco is not None:
            campos.append("endereco = %s")
            valores.append(pec.endereco)
        if pec.cnpj is not None:
            campos.append("cnpj = %s")
            valores.append(pec.cnpj)
        if pec.qualidade_produto is not None:
            campos.append("qualidade_produto = %s")
            valores.append(pec.qualidade_produto)

        if not campos:
            raise HTTPException(status_code=400, detail="Nenhum campo fornecido para atualização")
        
        valores.append(id_produtor)
        query = f"UPDATE pecuarista SET {', '.join(campos)} WHERE id_produtor = %s"
        cur.execute(query, valores)
        conn.commit()
        
        cur.execute("SELECT id_produtor, nome, rg, endereco, cnpj, qualidade_produto FROM pecuarista WHERE id_produtor = %s", (id_produtor,))
        p = cur.fetchone()
        return Pecuarista(
            id_produtor=p[0],
            nome=p[1],
            rg=p[2],
            endereco=p[3],
            cnpj=p[4],
            qualidade_produto=p[5]
        )
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao atualizar: {e}")
    finally:
        cur.close()
        conn.close()

@router.delete("/Pecuarista/{id_produtor}")
async def deletar_pecuarista(id_produtor: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM pecuarista WHERE id_produtor = %s", (id_produtor,))
    conn.commit()
    cur.close()
    conn.close()
    return {"msg": "Pecuarista deletado com sucesso"}
