# Import / Export Backend

API FastAPI pour les comptes exportateurs/importateurs, annonces, messagerie, paiement et intégrations.

## Démarrage

1. Créer l'environnement virtuel puis installer `pip install -r requirements.txt`.
2. Copier `.env.example` vers `.env` et renseigner PostgreSQL et les secrets.
3. Lancer `uvicorn main:app --reload`.

Si le dossier `venv` a été créé avec une version de Python supprimée, le recréer :

`rmdir /s /q venv && py -m venv venv && venv\\Scripts\\pip install -r requirements.txt`

La documentation interactive est disponible sur `/docs`, le schéma OpenAPI sur `/openapi.json`.

## Services externes

- Change : endpoint `GET /api/currency/convert?amount=100&from=EUR&to=USD`, avec cache d'une heure.
- Logistique : `GET /api/logistics/estimate?from=NG&to=FR`.
- Stripe : renseigner `STRIPE_SECRET_KEY` avant les routes de paiement. Le webhook est `POST /api/billing/webhook`.
- Notifications : les routes `/api/notifications/email` et `/api/notifications/sms` gardent une trace en base ; connecter les clés SendGrid/Twilio dans l'adaptateur avant l'envoi réel.

Les messages temps réel utilisent `WS /api/conversations/ws/{id}?token=<JWT>`.
