from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", 1440))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def register_user(user: UserRegister, db: Session):
    # Vérifier si email existe
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email déjà utilisé"
        )

    # Chiffrer mot de passe
    hashed_password = pwd_context.hash(user.mot_de_passe)

    # Créer utilisateur
    new_user = User(
        nom=user.nom,
        email=user.email,
        mot_de_passe=hashed_password,
        type_compte=user.type_compte,
        pays=user.pays,
        telephone=user.telephone
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Générer token
    token = create_token({"id": new_user.id, "email": new_user.email})

    return {
        "message": "Compte créé avec succès",
        "token": token,
        "user": {
            "id": new_user.id,
            "nom": new_user.nom,
            "email": new_user.email
        }
    }

def login_user(user: UserLogin, db: Session):
    # Vérifier email
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )

    # Vérifier mot de passe
    if not pwd_context.verify(user.mot_de_passe, db_user.mot_de_passe):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )

    # Générer token
    token = create_token({"id": db_user.id, "email": db_user.email})

    return {
        "message": "Connexion réussie",
        "token": token,
        "user": {
            "id": db_user.id,
            "nom": db_user.nom,
            "email": db_user.email
        }
    }

def create_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    data.update({"exp": expire})
    return jwt.encode(data, JWT_SECRET, algorithm=JWT_ALGORITHM)