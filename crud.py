from sqlalchemy.orm import Session
from db import get_connection
from models import Produtor, ProdutorUpdate
from fastapi import APIRouter, Depends, HTTPException
from typing import List

router = APIRouter()

@router.post("/Produtor")
async def criar_produtor(prod: Produtor):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO produtor (nome, endereco, tipo) VALUES (%s, %s, %s)",
            (prod.nome, prod.endereco, prod.tipo)
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(400, f"Erro ao criar produtor: {e}")
    finally:
        cur.close()
        conn.close()
    return {"msg": "Produtor criado com sucesso"}

@router.get("/Produtores", response_model=List[Produtor])
async def listar_produtores():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id_produtor, nome, endereco, tipo FROM produtor")
    produtores = cur.fetchall()
    cur.close()
    conn.close()
    return [ 
        Produtor(id_produtor=row[0], nome=row[1], endereco=row[2], tipo=row[3]) for row in produtores
    ]

@router.get("/Produtor/{produtor_id}", response_model=Produtor) 
async def obter_produtor(produtor_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM produtor WHERE id_produtor = %s", (produtor_id,))
    produtor = cur.fetchone()
    cur.close()
    conn.close()
    
    if not produtor:
        raise HTTPException(status_code=404, detail="Produtor não encontrado")
    
    return Produtor(
        id_produtor=produtor[0],
        nome=produtor[1],
        endereco=produtor[2],
        tipo=produtor[3]
    ) 
    
@router.patch("/Produtor/{produtor_id}", response_model=Produtor)
async def atualizar_produtor(produtor_id: int, prod: ProdutorUpdate):
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        # Verifica se o produtor existe
        cur.execute("SELECT id_produtor FROM produtor WHERE id_produtor = %s", (produtor_id,))
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Produtor não encontrado")
        
        # Prepara os campos e valores para atualização
        fields = []
        values = []
        
        if prod.nome is not None:
            fields.append("nome = %s")
            values.append(prod.nome)
        if prod.endereco is not None:
            fields.append("endereco = %s")
            values.append(prod.endereco)
        if prod.tipo is not None:
            fields.append("tipo = %s")
            values.append(prod.tipo)
        
        # Se não houver campos para atualizar
        if not fields:
            raise HTTPException(status_code=400, detail="Nenhum campo fornecido para atualização")
        
        # Adiciona o produtor_id no final dos valores
        values.append(produtor_id)
        
        # Monta e executa a query
        query = f"UPDATE produtor SET {', '.join(fields)} WHERE id_produtor = %s"
        cur.execute(query, values)
        conn.commit()
        
        # Busca o produtor atualizado para retornar
        cur.execute("SELECT * FROM produtor WHERE id_produtor = %s", (produtor_id,))
        updated_produtor = cur.fetchone()
        
        return Produtor(
            id_produtor=updated_produtor[0],
            nome=updated_produtor[1],
            endereco=updated_produtor[2],
            tipo=updated_produtor[3]
        )
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao atualizar produtor: {str(e)}")
    finally:
        cur.close()
        conn.close()


@router.delete("/Produtor/{produtor_id}")
async def deletar_produtor(produtor_id: int):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id_produtor FROM produtor WHERE id_produtor = %s", (produtor_id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"msg": "Produtor deletado com sucesso"}
        
        
    
    