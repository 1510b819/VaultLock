# VaultLock

A self-hosted, zero-knowledge password manager built with the MERN stack.

## About
VaultLock is a secure password manager designed for self-hosting. It uses end-to-end encryption, where all sensitive data is encrypted and decrypted only on the client side. The server only stores ciphertext, ensuring that even if the database is compromised, no plaintext credentials are exposed.

<img width="1862" height="957" alt="image" src="https://github.com/user-attachments/assets/a874b447-b9fb-4c61-a340-c8852c4746ca" />


<img width="1862" height="957" alt="image" src="https://github.com/user-attachments/assets/19c1e6ae-f60e-44af-ab88-31d232e5913f" />


### Features
- Zero-knowledge encryption: All vault data is encrypted in the browser using AES-256-GCM.

- Strong key derivation with PBKDF2 (310,000 iterations, SHA-256).

- JWT-based authentication and session management.

- Secure storage in MongoDB using Mongoose models.

- Vault entries include service, username, and encrypted password.

- Built-in password generator with customizable options.

- Modern React frontend with responsive UI.

- Session key persistence in the browser for 5 minutes to balance security and usability.

- Self-hosted: runs on your own server, giving you full control over your data.

### Tech Stack

- Frontend: React, WebCrypto API, React Hot Toast.

- Backend: Node.js, Express, JWT, Mongoose, MongoDB.

- Security: Helmet, CORS, AES-256-GCM, PBKDF2.

### Project Structure

Dockerfile.server → Backend (Express/Node.js)

Dockerfile.client → Frontend (React + Vite)

docker-compose.yml → Manages services: backend, frontend, and MongoDB

password-manager-backend → Source code for backend API

password-manager-frontend → Source code for frontend UI

### How to Run

1. Install Docker and Docker Compose

2. Clone the repository

3. Run docker-compose up --build

4. Access the app in your browser at http://localhost:3000

### Use Case
VaultLock is intended for personal or small-team use. Since it is self-hosted, it avoids reliance on third-party services and ensures you retain full ownership of your sensitive data.
