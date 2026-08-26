from fastapi import APIRouter, HTTPException
from db import get_connection
from models import Recurso, RecursoUpdate
from typing import List

router = APIRouter()

@router.post("/Recurso")
async def criar_recurso(rec: Recurso):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            INSERT INTO Recurso 
            (qualidade, logistica, armazenamento, quantidade, valor_mercado, demandas) 
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (rec.qualidade, rec.logistica, rec.armazenamento, rec.quantidade, rec.valor_mercado, rec.demandas)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, f"Erro ao criar recurso: {e}")
    finally:
        cur.close()
        conn.close()
    return {"msg": "Recurso criado com sucesso"}

@router.get("/Recursos", response_model=List[Recurso])
async def listar_recursos():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id_recurso, qualidade, logistica, armazenamento, quantidade, valor_mercado, demandas FROM Recurso")
    recursos = cur.fetchall()
    cur.close()
    conn.close()
    return [
        Recurso(
            id_recurso=r[0],
            qualidade=r[1],
            logistica=r[2],
            armazenamento=r[3],
            quantidade=r[4],
            valor_mercado=r[5],
            demandas=r[6]
        ) for r in recursos
    ]

@router.get("/Recurso/{recurso_id}", response_model=Recurso)
async def obter_recurso(recurso_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM Recurso WHERE id_recurso = %s", (recurso_id,))
    r = cur.fetchone()
    cur.close()
    conn.close()
    if not r:
        raise HTTPException(404, "Recurso não encontrado")
    return Recurso(
        id_recurso=r[0],
        qualidade=r[1],
        logistica=r[2],
        armazenamento=r[3],
        quantidade=r[4],
        valor_mercado=r[5],
        demandas=r[6]
    )

@router.patch("/Recurso/{recurso_id}", response_model=Recurso)
async def atualizar_recurso(recurso_id: int, rec: RecursoUpdate):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id_recurso FROM Recurso WHERE id_recurso = %s", (recurso_id,))
        if not cur.fetchone():
            raise HTTPException(404, "Recurso não encontrado")

        campos, valores = [], []
        if rec.qualidade: campos.append("qualidade = %s"); valores.append(rec.qualidade)
        if rec.logistica: campos.append("logistica = %s"); valores.append(rec.logistica)
        if rec.armazenamento: campos.append("armazenamento = %s"); valores.append(rec.armazenamento)
        if rec.quantidade is not None: campos.append("quantidade = %s"); valores.append(rec.quantidade)
        if rec.valor_mercado is not None: campos.append("valor_mercado = %s"); valores.append(rec.valor_mercado)
        if rec.demandas: campos.append("demandas = %s"); valores.append(rec.demandas)

        if not campos:
            raise HTTPException(400, "Nenhum campo fornecido para atualização")

        valores.append(recurso_id)
        query = f"UPDATE Recurso SET {', '.join(campos)} WHERE id_recurso = %s"
        cur.execute(query, valores)
        conn.commit()

        cur.execute("SELECT * FROM Recurso WHERE id_recurso = %s", (recurso_id,))
        r = cur.fetchone()
        return Recurso(
            id_recurso=r[0],
            qualidade=r[1],
            logistica=r[2],
            armazenamento=r[3],
            quantidade=r[4],
            valor_mercado=r[5],
            demandas=r[6]
        )
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, f"Erro ao atualizar: {e}")
    finally:
        cur.close()
        conn.close()

@router.delete("/Recurso/{recurso_id}")
async def deletar_recurso(recurso_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM Recurso WHERE id_recurso = %s", (recurso_id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"msg": "Recurso deletado com sucesso"}
