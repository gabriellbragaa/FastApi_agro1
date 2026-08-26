from fastapi import APIRouter, HTTPException
from db import get_connection
from pydantic import BaseModel
from typing import List, Optional
from models import CooperativaCompletaCreate, Parceria

router = APIRouter()



from fastapi import APIRouter, HTTPException
from db import get_connection
from models import CooperativaCompletaCreate

router = APIRouter()

from fastapi import APIRouter, HTTPException
from db import get_connection
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class CooperativaCompletaCreate(BaseModel):
    telefone: Optional[str] = None
    capacidade_producao: Optional[int] = None
    parcerias: List[Parceria] = []  # Corrigido para "parcerias" (plural)

@router.post("/cooperativa/completo")
async def criar_cooperativa_completa(coop: CooperativaCompletaCreate):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("BEGIN;")

        # 1. Insere cooperativa (sem id_cooperativa pois é SERIAL)
        cur.execute(
            "INSERT INTO cooperativa (telefone, capacidade_producao) VALUES (%s, %s) RETURNING id_cooperativa",
            (coop.telefone, coop.capacidade_producao)
        )
        id_cooperativa = cur.fetchone()[0]

        # 2. Insere parcerias (se existirem)
        for parceria in coop.parcerias:
            cur.execute(
                "INSERT INTO parceria (id_empresa, id_cooperativa) VALUES (%s, %s)",
                (parceria.id_empresa, id_cooperativa)
            )

        conn.commit()
        return {
            "msg": "Cooperativa e parcerias criadas com sucesso",
            "id_cooperativa": id_cooperativa
        }

    except Exception as e:
        conn.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Erro ao criar cooperativa completa: {str(e)}"
        )
    finally:
        cur.close()
        conn.close()