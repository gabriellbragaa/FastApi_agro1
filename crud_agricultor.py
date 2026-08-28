from fastapi import APIRouter, HTTPException
from typing import List

from db import get_connection
from models import (
    Agricultor,
    AgricultorCreate,
    AgricultorUpdate
)

router = APIRouter()


# ============================================================
# CRIAR DADOS DO AGRICULTOR
# ============================================================

@router.post("", response_model=dict)
async def criar_agricultor(agric: AgricultorCreate):

    conn = get_connection()
    cur = conn.cursor()

    try:

        # ----------------------------------------------------
        # Verifica se o produtor existe
        # ----------------------------------------------------

        cur.execute(
            """
            SELECT id_produtor, nome, tipo
            FROM produtor
            WHERE id_produtor = %s
            """,
            (agric.id_produtor,)
        )

        produtor = cur.fetchone()

        if not produtor:
            raise HTTPException(
                status_code=404,
                detail="Produtor não encontrado"
            )

        # ----------------------------------------------------
        # Verifica se o produtor é agricultor
        # ----------------------------------------------------

        if not produtor[2] or produtor[2].lower() != "agricultor":

            raise HTTPException(
                status_code=400,
                detail="O produtor selecionado não é um agricultor"
            )

        # ----------------------------------------------------
        # Verifica se já possui dados de agricultor
        # ----------------------------------------------------

        cur.execute(
            """
            SELECT id_produtor
            FROM agricultor
            WHERE id_produtor = %s
            """,
            (agric.id_produtor,)
        )

        if cur.fetchone():

            raise HTTPException(
                status_code=400,
                detail="Este agricultor já possui dados cadastrados"
            )

        # ----------------------------------------------------
        # Insere SOMENTE os dados específicos do agricultor
        # ----------------------------------------------------

        cur.execute(
            """
            INSERT INTO agricultor
            (
                id_produtor,
                rg,
                exp_mercado,
                data_nascimento
            )
            VALUES (%s, %s, %s, %s)
            """,
            (
                agric.id_produtor,
                agric.rg,
                int(agric.exp_mercado),
                agric.data_nascimento
            )
        )

        conn.commit()

        return {
            "msg": "Dados do agricultor cadastrados com sucesso"
        }

    except HTTPException:

        conn.rollback()
        raise

    except Exception as e:

        conn.rollback()

        raise HTTPException(
            status_code=400,
            detail=f"Erro ao cadastrar agricultor: {e}"
        )

    finally:

        cur.close()
        conn.close()


# ============================================================
# LISTAR AGRICULTORES
# ============================================================

@router.get("", response_model=List[Agricultor])
async def listar_agricultores():

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute(
            """
            SELECT
                p.id_produtor,
                p.nome,
                a.rg,
                a.exp_mercado,
                a.data_nascimento

            FROM produtor p

            INNER JOIN agricultor a
                ON p.id_produtor = a.id_produtor

            WHERE LOWER(p.tipo) = 'agricultor'

            ORDER BY p.id_produtor
            """
        )

        rows = cur.fetchall()

        return [
            Agricultor(
                id_produtor=row[0],
                nome=row[1],
                rg=row[2],
                exp_mercado=int(row[3]),
                data_nascimento=row[4]
            )
            for row in rows
        ]

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=f"Erro ao listar agricultores: {e}"
        )

    finally:

        cur.close()
        conn.close()


# ============================================================
# BUSCAR AGRICULTOR
# ============================================================

@router.get("/{id_produtor}", response_model=Agricultor)
async def obter_agricultor(id_produtor: int):

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute(
            """
            SELECT
                p.id_produtor,
                p.nome,
                a.rg,
                a.exp_mercado,
                a.data_nascimento

            FROM produtor p

            INNER JOIN agricultor a
                ON p.id_produtor = a.id_produtor

            WHERE p.id_produtor = %s
              AND LOWER(p.tipo) = 'agricultor'
            """,
            (id_produtor,)
        )

        row = cur.fetchone()

        if not row:

            raise HTTPException(
                status_code=404,
                detail="Agricultor não encontrado"
            )

        return Agricultor(
            id_produtor=row[0],
            nome=row[1],
            rg=row[2],
            exp_mercado=int(row[3]),
            data_nascimento=row[4]
        )

    finally:

        cur.close()
        conn.close()


# ============================================================
# ATUALIZAR DADOS DO AGRICULTOR
# ============================================================

@router.patch("/{id_produtor}", response_model=Agricultor)
async def atualizar_agricultor(id_produtor: int, agric: AgricultorUpdate):

    conn = get_connection()
    cur = conn.cursor()

    try:

        # ----------------------------------------------------
        # Verifica se existe agricultor
        # ----------------------------------------------------

        cur.execute(
            """
            SELECT
                p.id_produtor,
                p.nome,
                p.tipo
            FROM produtor p

            INNER JOIN agricultor a
                ON p.id_produtor = a.id_produtor

            WHERE p.id_produtor = %s
              AND LOWER(p.tipo) = 'agricultor'
            """,
            (id_produtor,)
        )

        agricultor = cur.fetchone()

        if not agricultor:

            raise HTTPException(
                status_code=404,
                detail="Agricultor não encontrado"
            )

        # ----------------------------------------------------
        # Monta atualização
        # ----------------------------------------------------

        campos = []
        valores = []

        if agric.rg is not None:
            campos.append("rg = %s")
            valores.append(agric.rg)

        if agric.exp_mercado is not None:
            campos.append("exp_mercado = %s")
            valores.append(agric.exp_mercado)

        if agric.data_nascimento is not None:
            campos.append("data_nascimento = %s")
            valores.append(agric.data_nascimento)

        # ----------------------------------------------------
        # Nenhum campo
        # ----------------------------------------------------

        if not campos:

            raise HTTPException(
                status_code=400,
                detail="Nenhum campo fornecido para atualização"
            )

        valores.append(id_produtor)

        query = f"""
            UPDATE agricultor
            SET {", ".join(campos)}
            WHERE id_produtor = %s
        """

        cur.execute(query, valores)

        conn.commit()

        # ----------------------------------------------------
        # Busca dados atualizados
        # ----------------------------------------------------

        cur.execute(
            """
            SELECT
                p.id_produtor,
                p.nome,
                a.rg,
                a.exp_mercado,
                a.data_nascimento

            FROM produtor p

            INNER JOIN agricultor a
                ON p.id_produtor = a.id_produtor

            WHERE p.id_produtor = %s
            """,
            (id_produtor,)
        )

        row = cur.fetchone()

        return Agricultor(
            id_produtor=row[0],
            nome=row[1],
            rg=row[2],
            exp_mercado=int(row[3]),
            data_nascimento=row[4]
        )

    except HTTPException:

        conn.rollback()
        raise

    except Exception as e:

        conn.rollback()

        raise HTTPException(
            status_code=400,
            detail=f"Erro ao atualizar agricultor: {e}"
        )

    finally:

        cur.close()
        conn.close()


# ============================================================
# EXCLUIR DADOS DO AGRICULTOR
# ============================================================

@router.delete("/{id_produtor}")
async def deletar_agricultor(id_produtor: int):

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute(
            """
            DELETE FROM agricultor
            WHERE id_produtor = %s
            """,
            (id_produtor,)
        )

        if cur.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Dados do agricultor não encontrados"
            )

        conn.commit()

        return {
            "msg": "Dados do agricultor excluídos com sucesso"
        }

    except HTTPException:

        conn.rollback()
        raise

    except Exception as e:

        conn.rollback()

        raise HTTPException(
            status_code=400,
            detail=f"Erro ao excluir agricultor: {e}"
        )

    finally:

        cur.close()
        conn.close()