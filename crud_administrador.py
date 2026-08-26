from fastapi import APIRouter, HTTPException
from db import get_connection
from models import Administrador, AdministradorUpdate
from typing import List

router = APIRouter()

@router.post("/Administrador")
async def criar_administrador(admin: Administrador):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO Administrador (nome, rg, id_associado) VALUES (%s, %s, %s) RETURNING id_admin",
            (admin.nome, admin.rg, admin.id_associado)
        )
        id_admin = cur.fetchone()[0]
        conn.commit()
        return {"msg": "Administrador criado com sucesso", "id_admin": id_admin}
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, f"Erro ao criar administrador: {e}")
    finally:
        cur.close()
        conn.close()

@router.get("/Administradores", response_model=List[Administrador])
async def listar_administradores():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id_admin, nome, rg, id_associado FROM Administrador")
    admins = cur.fetchall()
    cur.close()
    conn.close()
    return [
        Administrador(
            id_admin=a[0], 
            nome=a[1], 
            rg=a[2], 
            id_associado=a[3]
        ) for a in admins
    ]

@router.get("/Administrador/{admin_id}", response_model=Administrador)
async def obter_administrador(admin_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT id_admin, nome, rg, id_associado FROM Administrador WHERE id_admin = %s", 
        (admin_id,)
    )
    a = cur.fetchone()
    cur.close()
    conn.close()
    if not a:
        raise HTTPException(404, "Administrador não encontrado")
    return Administrador(
        id_admin=a[0], 
        nome=a[1], 
        rg=a[2], 
        id_associado=a[3]
    )

@router.patch("/Administrador/{admin_id}", response_model=Administrador)
async def atualizar_administrador(admin_id: int, admin: AdministradorUpdate):
    conn = get_connection()
    cur = conn.cursor()
    try:
        campos, valores = [], []
        if admin.nome is not None:
            campos.append("nome = %s")
            valores.append(admin.nome)
        if admin.rg is not None:
            campos.append("rg = %s")
            valores.append(admin.rg)
        if admin.id_associado is not None:
            campos.append("id_associado = %s")
            valores.append(admin.id_associado)

        if not campos:
            raise HTTPException(400, "Nenhum campo fornecido")

        valores.append(admin_id)
        query = f"UPDATE Administrador SET {', '.join(campos)} WHERE id_admin = %s"
        cur.execute(query, valores)
        conn.commit()

        cur.execute(
            "SELECT id_admin, nome, rg, id_associado FROM Administrador WHERE id_admin = %s", 
            (admin_id,)
        )
        a = cur.fetchone()
        return Administrador(
            id_admin=a[0], 
            nome=a[1], 
            rg=a[2], 
            id_associado=a[3]
        )
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, f"Erro ao atualizar: {e}")
    finally:
        cur.close()
        conn.close()

@router.delete("/Administrador/{admin_id}")
async def deletar_administrador(admin_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM Administrador WHERE id_admin = %s", (admin_id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"msg": "Administrador deletado com sucesso"}