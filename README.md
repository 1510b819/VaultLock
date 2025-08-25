# VaultLock

VaultLock is a lightweight and secure password manager built with a modern stack:

- React + Vite frontend

- Express/Node.js backend

- MongoDB for secure storage

- Fully containerized with Docker for easy deployment



## About
VaultLock provides a simple but effective way to manage passwords. It’s designed with a focus on security, usability, and portability. By running inside Docker containers, it works the same across all environments with minimal setup.

<img width="1862" height="957" alt="image" src="https://github.com/user-attachments/assets/a874b447-b9fb-4c61-a340-c8852c4746ca" />


<img width="1862" height="957" alt="image" src="https://github.com/user-attachments/assets/19c1e6ae-f60e-44af-ab88-31d232e5913f" />


### Features

- User authentication (signup/login with hashed passwords)

- Encrypted vault storage for passwords and credentials

- Secure API endpoints protected with authentication

- React frontend for a clean and responsive UI

- Health check endpoint for monitoring backend availability

- Configurable through environment variables

- Fully containerized with Docker Compose (backend, frontend, and MongoDB services)

### Security Measures

- Passwords are hashed using industry-standard algorithms before storage

- Helmet is used in the backend for HTTP header protection

- CORS configured to prevent unauthorized cross-origin requests

- Environment variables are used for sensitive configurations (database URI, ports, etc.)

- MongoDB runs in a separate container with a mounted volume for persistent and secure storage

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
