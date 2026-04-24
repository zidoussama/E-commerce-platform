# MERN E-Commerce Platform

This repository contains a full-stack e-commerce application with:

- Backend: Node.js + Express + MongoDB
- Frontend: React (Create React App)
- Containerization: Docker and Docker Compose
- Orchestration: Kubernetes with separate dev, test, and prod manifests

This README focuses on:

1. Backend MVC architecture
2. Kubernetes deployment structure

## 1. Repository Structure

```text
projrt mern/
|- backend/
|  |- server.js
|  |- src/
|  |  |- controllers/
|  |  |- models/
|  |  |- routes/
|  |  |- middleware/
|  |  |- services/
|  |  |- utils/
|  |  |- validators/
|  |- scripts/seed.js
|
|- frontend/
|  |- src/components/
|  |  |- admin/
|  |  |- user/
|  |  |- ...
|
|- k8s/
|  |- namespaces/namespaces.yaml
|  |- dev/
|  |- test/
|  |- prod/
|
|- docker-compose.yml
```

## 2. Backend MVC Architecture

The backend mostly follows MVC:

- Models: MongoDB schema layer in `backend/src/models`
- Controllers: business logic in `backend/src/controllers`
- Routes: HTTP endpoints in `backend/src/routes`
- App entrypoint and composition root: `backend/server.js`

### 2.1 Request Flow

```text
Client -> Express Route -> Controller -> Mongoose Model -> MongoDB
                           |
                           +-> Middleware (auth/validation)
```

### 2.2 MVC Mapping in this Project

- `backend/server.js` wires middleware, database connection, and route modules.
- `backend/src/models/` defines entities such as User, product, Category, Order, Cart, Comment, Deals, likes.
- `backend/src/controllers/` contains domain logic (users, products, categories, orders, cart, etc.).
- `backend/src/routes/` exposes API endpoints and delegates to controllers.

### 2.3 Important Current State

There are two styles currently present in routes:

- Controller-based routes (MVC style), for example:
  - `users.js`, `orders.js`, `likes.js`, `comments.js`, `deals.js`, `cart.js`
- Inline route logic (route handles model logic directly), for example:
  - `product.js`, `categoryRoutes.js`

Also note that both `products.js` and `product.js` exist, but `server.js` currently mounts `product.js`.

This means the architecture is mostly MVC, with some mixed route-level business logic still present.

## 3. Backend Service Wiring

In `backend/server.js`, the API is mounted under `/api` with these route roots:

- `/api/users`
- `/api/products`
- `/api/categories`
- `/api/likes`
- `/api/comments`
- `/api/userinfo`
- `/api/cart`
- `/api/orders`
- `/api/deals`
- `/api/dashboard`

MongoDB connection is read from `MONGO_URI`.

## 4. Kubernetes Deployment Structure

Kubernetes manifests are organized by environment under `k8s/`.

### 4.1 Namespaces

`k8s/namespaces/namespaces.yaml` creates:

- `dev`
- `test`
- `prod`

### 4.2 Environment Layout

Each environment defines the same main building blocks:

- MongoDB Deployment + Service + PVC
- Backend Deployment + Service
- Frontend Deployment + Service
- ConfigMap and Secret for env-specific configuration
- Ingress for host/path routing

#### Dev (`k8s/dev`)

- Namespace: `dev`
- Main workload file: `all.yaml`
- Config: `ConfigMap.yaml`, `Secret.yaml`
- Ingress host: `dev.ecomp.codes`
- Route split:
  - `/api` -> backend service on port 3001
  - `/` -> frontend service on port 80

#### Test (`k8s/test`)

- Namespace: `test`
- Main workload file: `all.yaml`
- Config: `ConfigMap.yaml`, `Secret.yaml`
- Ingress host: `test.ecomp.codes`
- Route split:
  - `/api` -> backend service on port 3002
  - `/` -> frontend service on port 80

#### Prod (`k8s/prod`)

- Namespace: `prod`
- Workloads split into multiple files:
  - `mongo.yaml`
  - `backend.yaml`
  - `frontend.yaml`
- Config: `ConfigMap.yaml`, `Secret.yaml`
- Ingress host: `prod.ecomp.codes`
- Route split:
  - `/api` -> backend service on port 3003
  - `/` -> frontend service on port 80

## 5. Kubernetes Apply Order

Use this order to deploy safely.

### 5.1 One-time: create namespaces

```bash
kubectl apply -f k8s/namespaces/namespaces.yaml
```

### 5.2 Dev

```bash
kubectl apply -f k8s/dev/ConfigMap.yaml
kubectl apply -f k8s/dev/Secret.yaml
kubectl apply -f k8s/dev/all.yaml
kubectl apply -f k8s/dev/ingress.yaml
```

### 5.3 Test

```bash
kubectl apply -f k8s/test/ConfigMap.yaml
kubectl apply -f k8s/test/Secret.yaml
kubectl apply -f k8s/test/all.yaml
kubectl apply -f k8s/test/ingress.yaml
```

### 5.4 Prod

```bash
kubectl apply -f k8s/prod/ConfigMap.yaml
kubectl apply -f k8s/prod/Secret.yaml
kubectl apply -f k8s/prod/mongo.yaml
kubectl apply -f k8s/prod/backend.yaml
kubectl apply -f k8s/prod/frontend.yaml
kubectl apply -f k8s/prod/ingress.yaml
```

## 6. Local Development

### Backend

```bash
cd backend
npm install
node server.js
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Docker Compose

```bash
docker compose up --build
```

## 7. Configuration Notes

Important environment naming note in backend code:

- JWT and expiry are read from lowercase names in code:
  - `jwtSecret`
  - `tokenExpire`

Some manifests currently provide uppercase variants (`JWT_SECRET`, `TOKEN_EXPIRE`).
If they are not mapped to the exact expected names, authentication token generation can fail.

Also note that `backend/package.json` currently does not define a `start` script, while `backend/Dockerfile` runs `npm start`.

## 8. Suggested Next Cleanup (Optional)

To make architecture and deployment more consistent:

1. Standardize all route files to controller-based MVC (migrate logic from `product.js` and `categoryRoutes.js` into controllers).
2. Keep only one product route module (`product.js` or `products.js`) and remove the duplicate.
3. Align environment variable names across backend code, Kubernetes ConfigMaps/Secrets, and local `.env`.
4. Add a backend `start` script in `backend/package.json` for Docker/runtime consistency.

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
