# Document Management System with JWT Authentication

## Overview

This project is a Proof of Concept (PoC) for a document management system that uses JWT for authentication. It supports role-based access control for different types of users: Admin, Editor, and Viewer.

## Key Features

- **Authentication with JWT:**
  - Secure endpoints with JWT-based authentication.
  - Role-based access control with roles (Admin, Editor, Viewer).

- **Document Management:**
  - Upload and store documents directly in the file system.

- **User Management:**
  - Admin-only APIs for managing user roles and permissions.

- **Database Migrations:**
  - Migrations are automatically executed to ensure the database schema is up-to-date.

- **Validation and Guards:**
  - Token validation and role-based access control are implemented using NestJS guards.

## API Endpoints

### Authentication Module

| Method | Endpoint          | Role Access          | Description                                      |
|--------|-------------------|----------------------|--------------------------------------------------|
| POST   | /auth/login       | Public               | Logs in a user and returns a JWT token.          |
| POST   | /auth/register    | Public               | Registers a new user.                            |
| POST   | /auth/logout      | Authenticated Users  | Logs out a user by blacklisting the JWT token.   |

### Document Management Module

| Method | Endpoint          | Role Access          | Description                                      |
|--------|-------------------|----------------------|--------------------------------------------------|
| POST   | /documents        | Admin, Editor        | Creates a new document.                          |
| GET    | /documents        | Admin, Editor, Viewer| Retrieves a list of all documents.               |
| GET    | /documents/{id}   | Admin, Editor, Viewer| Retrieves a specific document by its ID.         |
| PATCH  | /documents/{id}   | Admin, Editor        | Updates an existing document.                    |
| DELETE | /documents/{id}   | Admin                | Deletes a document by its ID.                    |

### Ingestion Process Module

| Method | Endpoint                | Role Access | Description                                      |
|--------|-------------------------|-------------|--------------------------------------------------|
| POST   | /ingestion/trigger      | Admin       | Triggers a new ingestion process.                |
| GET    | /ingestion/status/{id}  | Admin       | Gets the status of an ingestion process.         |
| POST   | /ingestion/stop/{id}    | Admin       | Stops an ingestion process.                      |
| GET    | /ingestion/all          | Admin       | Retrieves all ingestion processes.               |
| GET    | /ingestion/{id}         | Admin       | Retrieves details of a specific ingestion process.|

## Prerequisites

Ensure you have the following installed:

- Node.js (v20 or above)
- npm or yarn
- PostgreSQL
- Docker and Docker Compose
## Configuration
Create a .env file in the root of the project with the following environment variables:
```bash
POSTGRES_HOST="localhost"
POSTGRES_PORT=5432
POSTGRES_USER="admin"
POSTGRES_PASSWORD="adminpassword"
POSTGRES_DB="app_db"
JWT_SECRET="secret"
LOG_LEVEL="info"
```
## Running the Project Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AtulVerma91/Document-Management.git
   cd Document-Management
   ```

2. **Run Docker for the Database:**
   Ensure Docker is running on your system, then execute the following command to start the PostgreSQL database:

   ```bash
   docker-compose -f docker/docker-compose.yml up
   ```

3. **Install Global Packages:**
   
   Install the necessary global packages for development:

   ```bash
   npm install -g eslint
   npm install -g @nestjs/cli
   ```

4. **Build the Service:**
   
   Navigate to the project directory and build the service:

   ```bash
   npm install
   npm run build
   ```

5. **Run the Services:**
   
   Start the application services:

   ```bash
   npm run start:dev
   ```

6. **To Watch Database Tables:**
   
   Use a database management tool like PGADMIN or DBEAVER to view and manage your database tables. Connect using the following credentials:
   
   - **User:** admin
   - **Password:** adminpassword
   - **Database Name:** app_db

## Running the Project on docker (both database and app)

1. **Build the Docker image:**

   ```bash
   docker-compose -f docker-compose.yml up
   ```

3. **Access the application:**
   
   Open your browser and navigate to your server's IP address or domain.
   ```bash
   http://localhost:3000
   ```

## Running the Project in Production if database installed seprately 

1. **Build the Docker image:**

   ```bash
   docker build -t document-management-system .
   ```

2. **Run the Docker container:**

   ```bash
   docker run -p 3000:3000 document-management-system
   ```

3. **Access the application:**
   
   Open your browser and navigate to your server's IP address or domain.

## Running Tests

Run unit and integration tests with the following command:

```bash
npm run test
```

## Known Issues and Limitations

- Storing files in the file system can lead to performance issues for large files or high volumes of uploads. Consider switching to a file storage solution like AWS S3 for scalability.

## Recomondations

- Use AWS Cognito for Login .
- Use AWS EKS and RDS
- For File Upload use S3 service
- For LOG NewRelic or Cloud Watch



