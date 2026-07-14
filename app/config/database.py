from sqlalchemy import create_engine, inspect, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def ensure_user_quota_schema(db):
    engine = db.get_bind()
    if engine is None:
        return

    inspector = inspect(engine)
    if not inspector.has_table("user_quotas"):
        return

    columns = {column["name"] for column in inspector.get_columns("user_quotas")}

    def add_column(column_name: str, definition: str):
        if column_name not in columns:
            db.execute(text(f"ALTER TABLE user_quotas ADD COLUMN {column_name} {definition}"))
            columns.add(column_name)

    add_column("chats_utilises", "INTEGER DEFAULT 0")
    add_column("chats_gratuits", "INTEGER DEFAULT 50")
    add_column("statut", "VARCHAR(30) DEFAULT 'GRATUIT'")
    add_column("depense_usage", "FLOAT DEFAULT 0.0")
    add_column("updated_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")

    if "chats_used" in columns and "chats_utilises" in columns:
        db.execute(text("UPDATE user_quotas SET chats_utilises = COALESCE(chats_utilises, chats_used) WHERE chats_used IS NOT NULL"))
    if "chats_limit" in columns and "chats_gratuits" in columns:
        db.execute(text("UPDATE user_quotas SET chats_gratuits = COALESCE(chats_gratuits, chats_limit) WHERE chats_limit IS NOT NULL"))

    db.commit()


def get_db():
    db = SessionLocal()
    try:
        ensure_user_quota_schema(db)
        yield db
    finally:
        db.close()
