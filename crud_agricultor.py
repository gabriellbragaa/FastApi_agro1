from fastapi import APIRouter, HTTPException
from typing import List, Optional
from db import get_connection
from models import Agricultor, AgricultorUpdate

router = APIRouter()

@router.post("/Agricultor")
async def criar_agricultor(agric: Agricultor):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO agricultor (id_produtor, nome, rg, cpf, exp_mercado, data_nascimento, telefone)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            agric.id_produtor,
            agric.nome,
            agric.rg,
            agric.cpf,
            agric.exp_mercado,
            agric.data_nascimento,
            agric.telefone
        ))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao criar agricultor: {e}")
    finally:
        cur.close()
        conn.close()
    return {"msg": "Agricultor criado com sucesso"}

@router.get("/Agricultores", response_model=List[Agricultor])
async def listar_agricultores():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id_produtor, nome, rg, cpf, exp_mercado, data_nascimento, telefone
        FROM agricultor
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [
        Agricultor(
            id_produtor=row[0],
            nome=row[1],
            rg=row[2],
            cpf=row[3],
            exp_mercado=row[4],
            data_nascimento=row[5],
            telefone=row[6]
        ) for row in rows
    ]

@router.get("/Agricultor/{id_produtor}", response_model=Agricultor)
async def obter_agricultor(id_produtor: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id_produtor, nome, rg, cpf, exp_mercado, data_nascimento, telefone
        FROM agricultor WHERE id_produtor = %s
    """, (id_produtor,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Agricultor não encontrado")
    return Agricultor(
        id_produtor=row[0],
        nome=row[1],
        rg=row[2],
        cpf=row[3],
        exp_mercado=row[4],
        data_nascimento=row[5],
        telefone=row[6]
    )

@router.patch("/Agricultor/{id_produtor}", response_model=Agricultor)
async def atualizar_agricultor(id_produtor: int, agric: AgricultorUpdate):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id_produtor FROM agricultor WHERE id_produtor = %s", (id_produtor,))
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Agricultor não encontrado")

        campos = []
        valores = []

        if agric.nome is not None:
            campos.append("nome = %s")
            valores.append(agric.nome)
        if agric.rg is not None:
            campos.append("rg = %s")
            valores.append(agric.rg)
        if agric.cpf is not None:
            campos.append("cpf = %s")
            valores.append(agric.cpf)
        if agric.exp_mercado is not None:
            campos.append("exp_mercado = %s")
            valores.append(agric.exp_mercado)
        if agric.data_nascimento is not None:
            campos.append("data_nascimento = %s")
            valores.append(agric.data_nascimento)
        if agric.telefone is not None:
            campos.append("telefone = %s")
            valores.append(agric.telefone)

        if not campos:
            raise HTTPException(status_code=400, detail="Nenhum campo fornecido para atualização")

        valores.append(id_produtor)
        query = f"UPDATE agricultor SET {', '.join(campos)} WHERE id_produtor = %s"
        cur.execute(query, valores)
        conn.commit()

        cur.execute("""
            SELECT id_produtor, nome, rg, cpf, exp_mercado, data_nascimento, telefone
            FROM agricultor WHERE id_produtor = %s
        """, (id_produtor,))
        row = cur.fetchone()

        return Agricultor(
            id_produtor=row[0],
            nome=row[1],
            rg=row[2],
            cpf=row[3],
            exp_mercado=row[4],
            data_nascimento=row[5],
            telefone=row[6]
        )
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao atualizar agricultor: {e}")
    finally:
        cur.close()
        conn.close()

@router.delete("/Agricultor/{id_produtor}")
async def deletar_agricultor(id_produtor: int):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM agricultor WHERE id_produtor = %s", (id_produtor,))
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Agricultor não encontrado")
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao deletar agricultor: {e}")
    finally:
        cur.close()
        conn.close()
    return {"msg": "Agricultor deletado com sucesso"}
