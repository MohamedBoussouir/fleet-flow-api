# 🚚 Fleet Flow API - Gestion de Flotte de Transport Routier

## 📝 Description du Projet

**Fleet Flow API** est une API RESTful développée dans le cadre du **Sprint 2 (YouCode 2026/2027)**. Elle permet à une entreprise de transport routier de numériser et d'automatiser la gestion de sa flotte. L'API gère de manière centralisée les camions, les remorques, les pneus, l'assignation des trajets aux chauffeurs, ainsi que le suivi de la consommation de carburant et de la maintenance préventive.

## 🛠️ Stack Technique

Ce projet est construit avec des technologies modernes pour garantir performance, sécurité et maintenabilité :

* **Environnement :** Node.js

* **Framework :** Express.js

* **Base de données :** MongoDB (ODM: Mongoose)

* **Authentification :** JSON Web Token (JWT) & bcrypt

* **Conteneurisation :** Docker & Docker Compose

* **Documentation API :** Swagger (OpenAPI 3.0 via YAML)

* **Validation des données :** Joi (ou express-validator)

## 🏗️ Architecture du Projet (MVC)

L'API respecte strictement l'architecture en couches **MVC (Modèle-Vue-Contrôleur)**, enrichie par une couche "Services" pour isoler la logique métier complexe :

* **Modèles (`/src/models`) :** Définissent la structure des données (Schémas Mongoose) pour les entités (User, Camion, Remorque, Trajet, Maintenance, etc.).

* **Contrôleurs (`/src/controllers`) :** Gèrent les requêtes HTTP entrantes, appellent les services appropriés, et renvoient les réponses formatées (JSON).

* **Routes (`/src/routes`) :** Lient les URLs de l'API aux méthodes spécifiques des contrôleurs et appliquent les middlewares (Auth, Rôles).

* **Services (`/src/services`) :** Contiennent la logique métier stricte (ex: vérification de la disponibilité des véhicules, calcul de l'usure des pneus, génération de PDF). *La Vue est remplacée par des réponses JSON dans le contexte d'une API REST.*

## 🚀 Installation et Exécution (Via Docker)

L'application est entièrement conteneurisée. Vous n'avez besoin que de **Docker** et **Docker Compose** installés sur votre machine.

1. **Cloner le répertoire :**

   ```
   git clone <votre-lien-github>
   cd fleet-flow-api
   
   ```

2. **Configuration de l'environnement :**
   Créez un fichier `.env` à la racine du projet et ajoutez vos variables (exemple) :

   ```
   PORT=5000
   MONGO_URI=mongodb://mongodb:27017/fleet_management
   JWT_SECRET=votre_cle_secrete_super_securisee
   
   ```

3. **Lancer l'application :**
   Construisez et démarrez les conteneurs (API + MongoDB) en une seule commande :

   ```
   docker-compose up --build
   
   ```

   *L'API sera accessible sur : `http://localhost:5000`*

## 📚 Documentation Swagger

La documentation interactive de l'API est générée via **Swagger UI**. Une fois l'application démarrée avec Docker, vous pouvez explorer et tester tous les endpoints directement depuis votre navigateur.

👉 **Accès Swagger :** <http://localhost:5000/api-docs>

## 🧪 Tests avec Postman

Pour faciliter l'évaluation et les tests, une collection Postman complète couvrant 100% des exigences métiers et des "edge cases" est fournie avec le projet.

**Comment importer la collection :**

1. Ouvrez l'application **Postman**.

2. Cliquez sur le bouton **"Import"** en haut à gauche.

3. Glissez-déposez le fichier `fleet_flow_api_complete_collection.json` (situé à la racine du projet) dans la fenêtre.

4. Utilisez la collection importée. N'oubliez pas de générer un token via la route `/auth/login` !