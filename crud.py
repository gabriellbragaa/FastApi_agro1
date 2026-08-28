from db import get_connection
from models import Produtor, ProdutorCreate, ProdutorUpdate
from fastapi import APIRouter, HTTPException
from typing import List

router = APIRouter()


# ============================================================
# CRIAR PRODUTOR
# ============================================================

@router.post("", response_model=Produtor)
async def criar_produtor(prod: ProdutorCreate):

    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            INSERT INTO produtor (nome, endereco, tipo)
            VALUES (%s, %s, %s)
            RETURNING id_produtor, nome, endereco, tipo
            """,
            (
                prod.nome,
                prod.endereco,
                prod.tipo
            )
        )

        novo_produtor = cur.fetchone()

        conn.commit()

        return Produtor(
            id_produtor=novo_produtor[0],
            nome=novo_produtor[1],
            endereco=novo_produtor[2],
            tipo=novo_produtor[3]
        )

    except Exception as e:

        conn.rollback()

        raise HTTPException(
            status_code=400,
            detail=f"Erro ao criar produtor: {str(e)}"
        )

    finally:

        cur.close()
        conn.close()


# ============================================================
# LISTAR TODOS OS PRODUTORES
# ============================================================

@router.get("", response_model=List[Produtor])
async def listar_produtores():

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute(
            """
            SELECT
                id_produtor,
                nome,
                endereco,
                tipo
            FROM produtor
            ORDER BY id_produtor
            """
        )

        produtores = cur.fetchall()

        return [
            Produtor(
                id_produtor=row[0],
                nome=row[1],
                endereco=row[2],
                tipo=row[3]
            )
            for row in produtores
        ]

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=f"Erro ao listar produtores: {str(e)}"
        )

    finally:

        cur.close()
        conn.close()


# ============================================================
# BUSCAR PRODUTOR POR ID
# ============================================================

@router.get("/{produtor_id}", response_model=Produtor)
async def obter_produtor(produtor_id: int):


    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute(
            """
            SELECT
                id_produtor,
                nome,
                endereco,
                tipo
            FROM produtor
            WHERE id_produtor = %s
            """,
            (produtor_id,)
        )

        produtor = cur.fetchone()

        if not produtor:

            raise HTTPException(
                status_code=404,
                detail="Produtor não encontrado"
            )

        return Produtor(
            id_produtor=produtor[0],
            nome=produtor[1],
            endereco=produtor[2],
            tipo=produtor[3]
        )

    finally:

        cur.close()
        conn.close()


# ============================================================
# ATUALIZAR PRODUTOR
# ============================================================


@router.patch("/{produtor_id}", response_model=Produtor)
async def atualizar_produtor(produtor_id: int, prod: ProdutorUpdate):


    conn = get_connection()
    cur = conn.cursor()

    try:

        # Verifica se existe
        cur.execute(
            """
            SELECT id_produtor
            FROM produtor
            WHERE id_produtor = %s
            """,
            (produtor_id,)
        )

        if not cur.fetchone():

            raise HTTPException(
                status_code=404,
                detail="Produtor não encontrado"
            )

        fields = []
        values = []

        # Nome
        if prod.nome is not None:

            fields.append("nome = %s")
            values.append(prod.nome)

        # Endereço
        if prod.endereco is not None:

            fields.append("endereco = %s")
            values.append(prod.endereco)

        # Tipo
        if prod.tipo is not None:

            fields.append("tipo = %s")
            values.append(prod.tipo)

        # Nenhum campo enviado
        if not fields:

            raise HTTPException(
                status_code=400,
                detail="Nenhum campo fornecido para atualização"
            )

        values.append(produtor_id)

        query = f"""
            UPDATE produtor
            SET {", ".join(fields)}
            WHERE id_produtor = %s
        """

        cur.execute(query, values)

        conn.commit()

        # Busca registro atualizado
        cur.execute(
            """
            SELECT
                id_produtor,
                nome,
                endereco,
                tipo
            FROM produtor
            WHERE id_produtor = %s
            """,
            (produtor_id,)
        )

        produtor = cur.fetchone()

        return Produtor(
            id_produtor=produtor[0],
            nome=produtor[1],
            endereco=produtor[2],
            tipo=produtor[3]
        )

    except HTTPException:

        conn.rollback()
        raise

    except Exception as e:

        conn.rollback()

        raise HTTPException(
            status_code=400,
            detail=f"Erro ao atualizar produtor: {str(e)}"
        )

    finally:

        cur.close()
        conn.close()


# ============================================================
# DELETAR PRODUTOR
# ============================================================
@router.delete("/{produtor_id}")
async def deletar_produtor(produtor_id: int):

    conn = get_connection()
    cur = conn.cursor()

    try:

        cur.execute(
            """
            DELETE FROM produtor
            WHERE id_produtor = %s
            RETURNING id_produtor
            """,
            (produtor_id,)
        )

        produtor = cur.fetchone()

        if not produtor:

            raise HTTPException(
                status_code=404,
                detail="Produtor não encontrado"
            )

        conn.commit()

        return {
            "msg": "Produtor deletado com sucesso",
            "id_produtor": produtor[0]
        }

    except HTTPException:

        conn.rollback()
        raise

    except Exception as e:

        conn.rollback()

        raise HTTPException(
            status_code=400,
            detail=f"Erro ao deletar produtor: {str(e)}"
        )

    finally:

        cur.close()
        conn.close()