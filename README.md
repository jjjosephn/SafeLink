# SafeLink
SafeLink is an application designed to help users manage and store contact information in a efficient manner. The application allows users to create, read, update, and delete (CRUD) contact details through an intuitive interface, making it ideal for personal or business use.

## Tech Stack 🔧
- Frontend: Vite, React, JavaScript
- Backend: SpringBoot, PostgreSQL
- Routing + Other: React-Router-Dom, YAML, Maven

## How to Run this Program Locally 🖥️
**Prerequisites**
Before you begin, ensure you have the following:
  - A PostgreSQL account
  - PostgreSQL installed locally or accessible via a cloud provider
  - Node.js and npm installed
  - Java (JDK 11 or higher)

1. Clone the repository
   ```
   git clone https://github.com/jjjosephn/SafeLink.git
   cd SafeLink
   ```
2. Open your PostgreSQL shell and run the following command
   ```
   CREATE DATABASE contacts;
   ```
3. Open the backend configuration file located at
   ```
   backend/src/main/resources/application.yaml
   ```
4. Link your PostgreSQL credentials to the application.yaml file as shown:
   ```
   spring:
      datasource:
        url: jdbc:postgresql://localhost:5432/contacts
        username: your_username
        password: your_password
   ```
5. Run the backend
   ```
   cd backend
   ./mvnw spring-boot:run
   ```
   The backend will start running on ```http://localhost:8080/contacts```
6. In a new terminal, run the frontend
   ```
   npm run dev
   ```
   The frontend will start running on ```http://localhost:5173```
   
   
