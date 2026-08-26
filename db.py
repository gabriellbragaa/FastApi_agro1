from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

# =========================
# BANCO LOCAL
# =========================

LOCAL_DATABASE_URL = os.getenv(
    "LOCAL_DATABASE_URL",
    "postgresql+psycopg2://postgres:123456@localhost:5432/AutoAgro"
)

local_engine = create_engine(
    LOCAL_DATABASE_URL,
    pool_pre_ping=True
)

LocalSession = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=local_engine
)


# =========================
# NEON
# =========================

NEON_DATABASE_URL = os.getenv("NEON_DATABASE_URL")

neon_engine = None
NeonSession = None

if NEON_DATABASE_URL:
    neon_engine = create_engine(
        NEON_DATABASE_URL,
        pool_pre_ping=True
    )

    NeonSession = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=neon_engine
    )


# =========================
# BASE
# =========================

Base = declarative_base()


# =========================
# CONEXÕES
# =========================

def get_connection():
    """
    Mantém compatibilidade com o código antigo.
    Por padrão, retorna a conexão do banco local.
    """
    return local_engine.raw_connection()


def get_local_connection():
    return local_engine.raw_connection()


def get_neon_connection():
    if neon_engine is None:
        raise ValueError("NEON_DATABASE_URL não foi configurada")

    return neon_engine.raw_connection()


# =========================
# SESSÕES
# =========================

def get_local_db():
    db = LocalSession()

    try:
        yield db
    finally:
        db.close()


def get_neon_db():
    if NeonSession is None:
        raise ValueError("NEON_DATABASE_URL não foi configurada")

    db = NeonSession()

    try:
        yield db
    finally:
        db.close()
