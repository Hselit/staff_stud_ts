# Staff_Student_Management_API

The **Staff_Student_Management_API** is a robust backend system designed to manage staff and student data efficiently. Built using **TypeScript**, **Node.js**, and **Sequelize**, this project supports role-based authentication using **JWT tokens**, ensuring secure access and operations.

<br><br>

## 📄 API Documentation

All API endpoints, sample responses, and test cases are documented in Postman:

🔗 [View Postman Collection](https://backend-1075.postman.co/workspace/Staff_Stud~7ccb60a4-bc9e-472d-b21a-74d4bace8b35/collection/31553102-96ad7e05-b840-44a6-b4db-a538ec8c9055)

<br>

## 👥 Roles

There are three types of users:

- **Admin** – Full access to all routes (GET, POST, PUT, DELETE).
- **Staff** – Can only access **GET** routes.
- **Student** – Can only access **GET** routes.

<br>

## 🔐 Authentication

- All roles require authentication using **JWT tokens**.
- On successful login, a **JWT token** is returned.
- Include the token in the headers as:  
  `Authorization: <your_token_here>`

<br>

## 🚪 Login Endpoints

- **Staff Login** – `POST /staff/stafflogin`
- **Student Login** – `POST /student/studentlogin`

Each returns a JWT token upon valid credentials.

<br>

## 📌 Staff Routes

| Method | Endpoint                   | Description                       |
| ------ | -------------------------- | --------------------------------- |
| POST   | `/staff/`                  | Register a new staff              |
| POST   | `/staff/stafflogin`        | Staff login and receive JWT token |
| GET    | `/staff/getallstudent/:id` | Get staff with assigned students  |
| PUT    | `/staff/:id`               | Update staff details              |
| DELETE | `/staff/:id`               | Delete a staff                    |
| GET    | `/staff/:id`               | Get single staff details          |
| POST   | `/staff/csv`               | Bulk insert staff using CSV file  |
| GET    | `/staff/export`            | Export all staff data as CSV      |

<br>

## 🎓 Student Routes

| Method | Endpoint                | Description                         |
| ------ | ----------------------- | ----------------------------------- |
| POST   | `/student/`             | Create a new student                |
| POST   | `/student/studentlogin` | Student login and receive JWT token |
| GET    | `/student/`             | Get all students                    |
| GET    | `/student/:id`          | Get single student details          |
| PUT    | `/student/:id`          | Update student information          |
| DELETE | `/student/:id`          | Delete a student                    |
| GET    | `/student/getstaff/:id` | Get staff assigned to a student     |
| GET    | `/student/export`       | Export all student data as CSV      |

<br>

## 🧰 Built With

- Node.js
- TypeScript
- Express
- Sequelize ORM
- MySQL
- JWT Authentication
- CSV file handling
