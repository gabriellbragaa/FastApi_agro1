from fastapi import APIRouter, HTTPException
from typing import List
from db import get_connection
from models import Funcionario, FuncionarioUpdate

router = APIRouter()

@router.post("/Funcionario")
async def criar_funcionario(func: Funcionario):
    conn = get_connection()
    cur = conn.cursor()
    try:
        # Valida se o id_admin existe (se foi informado)
        if func.id_admin is not None:
            cur.execute("SELECT 1 FROM administrador WHERE id_admin = %s", (func.id_admin,))
            if not cur.fetchone():
                raise HTTPException(status_code=400, detail=f"Administrador com id {func.id_admin} não existe.")
        
        cur.execute(
            """
            INSERT INTO funcionario (id_func, nome, rg, endereco, setor, id_admin)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (func.id_func, func.nome, func.rg, func.endereco, func.setor, func.id_admin)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao criar funcionário: {e}")
    finally:
        cur.close()
        conn.close()
    
    return {"msg": "Funcionário criado com sucesso"}

@router.get("/Funcionarios", response_model=List[Funcionario])
async def listar_funcionarios():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id_func, nome, rg, endereco, setor, id_admin FROM funcionario")
    funcionarios = cur.fetchall()
    cur.close()
    conn.close()
    return [
        Funcionario(
            id_func=row[0],
            nome=row[1],
            rg=row[2],
            endereco=row[3],
            setor=row[4],
            id_admin=row[5]
        ) for row in funcionarios
    ]

@router.get("/Funcionario/{funcionario_id}", response_model=Funcionario)
async def obter_funcionario(funcionario_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id_func, nome, rg, endereco, setor, id_admin FROM funcionario WHERE id_func = %s", (funcionario_id,))
    funcionario = cur.fetchone()
    cur.close()
    conn.close()

    if not funcionario:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")

    return Funcionario(
        id_func=funcionario[0],
        nome=funcionario[1],
        rg=funcionario[2],
        endereco=funcionario[3],
        setor=funcionario[4],
        id_admin=funcionario[5]
    )

@router.patch("/Funcionario/{funcionario_id}", response_model=Funcionario)
async def atualizar_funcionario(funcionario_id: int, func: FuncionarioUpdate):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("SELECT id_func FROM funcionario WHERE id_func = %s", (funcionario_id,))
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Funcionário não encontrado")

        fields = []
        values = []

        if func.nome is not None:
            fields.append("nome = %s")
            values.append(func.nome)
        if func.rg is not None:
            fields.append("rg = %s")
            values.append(func.rg)
        if func.endereco is not None:
            fields.append("endereco = %s")
            values.append(func.endereco)
        if func.setor is not None:
            fields.append("setor = %s")
            values.append(func.setor)
        if func.id_admin is not None:
            fields.append("id_admin = %s")
            values.append(func.id_admin)

        if not fields:
            raise HTTPException(status_code=400, detail="Nenhum campo fornecido para atualização")

        values.append(funcionario_id)
        query = f"UPDATE funcionario SET {', '.join(fields)} WHERE id_func = %s"
        cur.execute(query, values)
        conn.commit()

        cur.execute("SELECT id_func, nome, rg, endereco, setor, id_admin FROM funcionario WHERE id_func = %s", (funcionario_id,))
        updated_func = cur.fetchone()

        return Funcionario(
            id_func=updated_func[0],
            nome=updated_func[1],
            rg=updated_func[2],
            endereco=updated_func[3],
            setor=updated_func[4],
            id_admin=updated_func[5]
        )

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao atualizar funcionário: {str(e)}")
    finally:
        cur.close()
        conn.close()

@router.delete("/Funcionario/{funcionario_id}")
async def deletar_funcionario(funcionario_id: int):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM funcionario WHERE id_func = %s", (funcionario_id,))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao deletar funcionário: {e}")
    finally:
        cur.close()
        conn.close()
    return {"msg": "Funcionário deletado com sucesso"}
