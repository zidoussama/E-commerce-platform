# E-commerce Platform (MERN) - README Detaille

Plateforme e-commerce full-stack basee sur l'architecture MERN:

- Frontend: React (Create React App), Material UI, PayPal
- Backend: Node.js, Express, MongoDB (Mongoose)
- Conteneurisation: Docker / Docker Compose
- Orchestration: Kubernetes (environnements dev, test, prod)

## 1. Vue d'ensemble

Le projet implemente les fonctionnalites classiques d'une boutique en ligne:

- Authentification utilisateur (email/mot de passe + Google Login)
- Catalogue produits avec categories
- Likes et commentaires sur produits
- Panier, checkout, commandes
- Paiement PayPal ou paiement a la livraison
- Espace admin (produits, categories, commandes, statistiques, likes, commentaires)
- Deploiement multi-environnements via manifests Kubernetes

## 2. Structure du projet

```text
E-commerce-platform/
|- backend/               # API REST Express + MongoDB
|  |- server.js           # Point d'entree serveur
|  |- src/
|  |  |- controllers/     # Logique metier
|  |  |- models/          # Schemas Mongoose
|  |  |- routes/          # Endpoints API
|  |  |- middleware/      # Auth/validation
|  |  |- utils/           # Helpers / constantes
|  |- scripts/seed.js     # Seed de donnees
|
|- frontend/              # Application React
|  |- src/components/
|  |  |- admin/           # Ecrans admin
|  |  |- user/            # Ecrans utilisateur
|  |  |- ...              # Login/Register/ProductList/etc.
|
|- k8s/
|  |- namespaces/         # Namespaces dev/test/prod
|  |- dev/                # Manifestes dev
|  |- test/               # Manifestes test
|  |- prod/               # Manifestes prod
|
|- docker-compose.yml     # Stack locale mongo + backend + frontend
```

## 3. Stack technique

### Backend

- express
- mongoose
- jsonwebtoken
- bcryptjs
- nodemailer
- google-auth-library
- cors

### Frontend

- react 19 + react-scripts
- react-router-dom
- @mui/material
- @paypal/react-paypal-js
- axios / fetch
- js-cookie / jwt-decode

## 4. Fonctionnalites principales

### Cote utilisateur

- Inscription / connexion
- Recuperation mot de passe par code email
- Changement email avec verification
- Navigation produits + filtres categories
- Detail produit (likes + commentaires)
- Panier (ajout, suppression, MAJ quantite, tailles)
- Checkout (adresse livraison)
- Paiement PayPal ou Cash on Delivery
- Historique commandes
- Favoris

### Cote admin

- Gestion categories
- Gestion produits
- Gestion commandes
- Moderation commentaires
- Vue likes
- Dashboard statistique

## 5. Variables d'environnement

## Backend (.env dans backend/)

Le code backend lit principalement les variables ci-dessous (sensibles a la casse):

```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/ecommerce
jwtSecret=jwtSecret
tokenExpire=2562000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Important:

- Le code utilise `jwtSecret` et `tokenExpire` en minuscules.
- Certains manifests K8s utilisent `JWT_SECRET` / `TOKEN_EXPIRE` (majuscules). Si non mappes, l'auth peut echouer.

## Frontend (.env dans frontend/)

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
```

Fallback code frontend:

- API: `http://localhost:3001`
- PayPal: une valeur par defaut est presente dans le code

## 6. Installation locale (sans Docker)

Prerequis:

- Node.js 18+
- npm
- MongoDB local

### 6.1 Backend

```bash
cd backend
npm install
```

Lancer l'API:

```bash
node server.js
```

Seed optionnel:

```bash
node scripts/seed.js
```

### 6.2 Frontend

```bash
cd frontend
npm install
npm start
```

Application disponible sur http://localhost:3000.

## 7. Execution avec Docker Compose

Le fichier `docker-compose.yml` definit:

- `mongo` sur 27017
- `backend` sur 3001
- `frontend` sur 3000

Commandes:

```bash
docker compose up --build
```

Notes importantes:

- Les `Dockerfile` utilisent `CMD ["npm","start"]`.
- Dans `backend/package.json`, le script `start` n'est pas defini actuellement. Il faut en ajouter un (`"start": "node server.js"`) ou adapter le Dockerfile.

## 8. Kubernetes (dev/test/prod)

Le dossier `k8s/` contient trois environnements isoles:

- `dev` namespace `dev`
- `test` namespace `test`
- `prod` namespace `prod`

### 8.1 Creer les namespaces

```bash
kubectl apply -f k8s/namespaces/namespaces.yaml
```

### 8.2 Deployer en dev

```bash
kubectl apply -f k8s/dev/ConfigMap.yaml
kubectl apply -f k8s/dev/Secret.yaml
kubectl apply -f k8s/dev/all.yaml
```

### 8.3 Deployer en test

```bash
kubectl apply -f k8s/test/ConfigMap.yaml
kubectl apply -f k8s/test/Secret.yaml
kubectl apply -f k8s/test/all.yaml
kubectl apply -f k8s/test/ingress.yaml
```

### 8.4 Deployer en prod

```bash
kubectl apply -f k8s/prod/ConfigMap.yaml
kubectl apply -f k8s/prod/Secret.yaml
kubectl apply -f k8s/prod/mongo.yaml
kubectl apply -f k8s/prod/backend.yaml
kubectl apply -f k8s/prod/frontend.yaml
kubectl apply -f k8s/prod/ingress.yaml
```

Ingress configure:

- `prod.ecomp.codes` (frontend + route `/api` vers backend)
- `test.ecomp.codes` pour test

## 9. API REST (resume)

Base URL locale: `http://localhost:3001/api`

### 9.1 Users

- `POST /users/register`
- `POST /users/login`
- `POST /users/forgot-password`
- `POST /users/verify-reset-code`
- `POST /users/reset-password`
- `POST /users/send-email-verification-code`
- `POST /users/resend-email-verification-code`
- `POST /users/verify-email-change`
- `GET /users`

### 9.2 User info

- `GET /userinfo/:id`
- `POST /userinfo`
- `PUT /userinfo/:id`
- `DELETE /userinfo/:id`

### 9.3 Products

- `GET /products`
- `GET /products/:id`
- `POST /products/add`
- `PUT /products/:id`
- `DELETE /products/:id`

### 9.4 Categories

- `GET /categories`
- `GET /categories/:id`
- `POST /categories/add`
- `PUT /categories/:id`
- `DELETE /categories/:id`

### 9.5 Cart

- `GET /cart?userId=...`
- `POST /cart/add`
- `PUT /cart/update`
- `DELETE /cart/remove`
- `DELETE /cart/clear`

### 9.6 Orders

- `POST /orders`
- `GET /orders?userId=...`
- `GET /orders/all`
- `PUT /orders/:id`
- `DELETE /orders/:id`

### 9.7 Likes

- `POST /likes/add`
- `DELETE /likes/remove`
- `GET /likes`
- `GET /likes/count`
- `GET /likes/liked-products`

### 9.8 Comments

- `POST /comments/add`
- `GET /comments?productId=...`
- `GET /comments/all`
- `PUT /comments/:id`
- `DELETE /comments/:id`

### 9.9 Deals

- `POST /deals`
- `GET /deals`
- `GET /deals/:id`
- `DELETE /deals/:id`

### 9.10 Dashboard

- `GET /dashboard/stats`

### 9.11 Google login

- Endpoint route: `POST /users/google-login/google-login`

Remarque: la route est montee sur `/api/users/google-login` et le router expose `/google-login`, ce qui cree un double segment.

## 10. Modele de donnees (MongoDB)

Collections principales:

- `User`: infos perso, auth, role, verification email/reset
- `Product`: nom, description, prix, stock, categorie, images, tailles
- `Category`: nom
- `Cart`: utilisateur + items (produit, quantite, taille)
- `Order`: utilisateur, items, total, statut, livraison, paiement
- `Comment`: lien user/produit + texte
- `likes`: likes user/produit
- `Deals`: listes d'images base64

## 11. Flux applicatifs (haut niveau)

1. L'utilisateur se connecte, recoit un JWT.
2. Le frontend stocke token/role (cookies) + userId (localStorage).
3. Navigation catalogue: categories + produits.
4. Ajout panier avec variantes (taille).
5. Checkout: adresse + mode livraison + mode paiement.
6. Creation commande -> decrement stock -> vidage panier.
7. Admin consulte dashboard et gere le catalogue/commandes.

## 12. Points d'attention techniques

- Incoherence potentielle des variables d'env (`jwtSecret` vs `JWT_SECRET`, `tokenExpire` vs `TOKEN_EXPIRE`).
- Script `start` manquant dans `backend/package.json` alors que Docker l'utilise.
- `dashboard/stats` attend `req.user.role` mais route sans middleware JWT; acces admin a verifier.
- Secret K8s committe en clair dans le depot (a externaliser via secret manager).

## 13. Recommandations d'amelioration

- Ajouter scripts backend:
  - `"start": "node server.js"`
  - `"dev": "nodemon server.js"`
  - `"seed": "node scripts/seed.js"`
- Uniformiser la nomenclature des variables d'environnement.
- Ajouter middleware d'auth sur routes sensibles (dashboard/admin).
- Ajouter tests unitaires/integration backend et frontend.
- Ajouter CI/CD (lint, test, build, image scan).

## 14. Commandes utiles

```bash
# Backend
cd backend
npm install
node server.js

# Frontend
cd frontend
npm install
npm start

# Docker
docker compose up --build

# K8s namespaces
kubectl apply -f k8s/namespaces/namespaces.yaml
```

## 15. Licence

Aucune licence explicite n'est definie a la racine du projet. Ajoutez un fichier `LICENSE` si necessaire.
