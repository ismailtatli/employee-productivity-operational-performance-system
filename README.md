# Employee Productivity and Operational Performance Management System

> A role-based factory management web application designed for **TatLee Factory**.  
> Built as a System Analysis and Design final project — Spring 2026.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Main Features](#main-features)
- [Technology Stack](#technology-stack)
- [Software Architecture](#software-architecture)
- [Role-Based Access Control](#role-based-access-control)
- [Smart Performance Scoring](#smart-performance-scoring)
- [API Overview](#api-overview)
- [Swagger API Documentation](#swagger-api-documentation)
- [Database Design](#database-design)
- [Security and Authorization](#security-and-authorization)
- [Installation and Running](#installation-and-running)
- [Running Tests](#running-tests)
- [Demo Users](#demo-users)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [GitHub Repository](#github-repository)
- [Conclusion](#conclusion)

---

## Project Overview

The Employee Productivity and Operational Performance Management System helps a factory monitor:

- Employee productivity and performance
- Production records and machine usage
- Product output and quality indicators
- Attendance continuity and punctuality
- Bonus eligibility and promotion candidates
- Operational decision reports

The system converts raw factory production data into meaningful management information through automatic scoring, role-based access, and structured reporting.

---

## Main Features

### Authentication
Secure login with email and password. Token is stored locally and used for all authorized API requests.

### Role-Based Access Control
Each role has defined module access. Backend enforces authorization independently of the frontend.

### Employee Management
Stores employee information including name, code, email, position, department, hire date, and status.

### Department Management
Manages factory departments. Employees and machines are linked to departments via foreign keys.

### Product Management
Stores product definitions including code, name, category, unit, target per shift, and status.

### Machine Management
Stores machine information including code, name, department, status, capacity per shift, and description.

### Production Records
Core operational module. Each record connects an employee, product, and machine with production metrics including actual quantity, defective quantity, on-time score, attendance, and absence data.

### Smart Employee Report Center
Generates automated performance reports including efficiency score, performance decision, bonus status, promotion readiness, quality score, continuity score, and system-generated recommendations.

---

## Technology Stack

### Backend
- Node.js
- Express.js
- SQLite
- JWT Authentication
- RESTful API
- Modular layered architecture (Controller → Service → Repository)

### Frontend
- HTML, CSS, Vanilla JavaScript
- Dynamic role-based interface
- LocalStorage token management
- Single-page application (no frameworks)

### Testing
- Jest
- Unit tests for validators and business logic
- 51 tests passing across 8 test suites

---

## Software Architecture

The project follows a layered architecture pattern:

```
HTTP Request
     │
     ▼
 Controller        → Handles HTTP request/response
     │
     ▼
  Service          → Contains business logic
     │
     ▼
 Repository        → Handles database queries
     │
     ▼
  Database         → SQLite
```

### Layers

**Controller Layer** — authController, employeeController, departmentController, productController, machineController, productionRecordController, reportController

**Service Layer** — authService, employeeService, departmentService, productService, machineService, productionRecordService, reportService, performanceCalculator, recommendationService

**Repository Layer** — employeeRepository, departmentRepository, productRepository, machineRepository, productionRecordRepository, reportRepository

**Validator Layer** — authValidator, employeeValidator, departmentValidator, productValidator, machineValidator, productionRecordValidator

---

## Role-Based Access Control

| Role | Dashboard | Employees | Departments | Products | Machines | Production Records | Reports |
|---|---|---|---|---|---|---|---|
| System Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Factory Manager | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Production Supervisor | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Quality Control | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| HR Specialist | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Department Viewer | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Smart Performance Scoring

The system automatically calculates performance using weighted indicators:

| Indicator | Description |
|---|---|
| Target Completion | Actual vs target production quantity |
| Quality Score | Defect rate relative to actual production |
| Continuity Score | Attendance minus absences and late arrivals |
| On-Time Completion | Timeliness of work completion |
| Overall Score | Weighted combination of all indicators |

Automatic report decisions: Outstanding Performer, High Performer, Stable Performer, Needs Improvement, Critical Review Required.

Automatic badges: Bonus Earned, Promotion Candidate, Star of the Month, Needs Improvement, Stable Performance.

---

## API Overview

### Authentication
```
POST   /api/auth/login
POST   /api/auth/register
```

### Employees
```
GET    /api/employees
GET    /api/employees/:id
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id
```

### Departments
```
GET    /api/departments
POST   /api/departments
PUT    /api/departments/:id
DELETE /api/departments/:id
```

### Products
```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Machines
```
GET    /api/machines
GET    /api/machines/:id
POST   /api/machines
PUT    /api/machines/:id
DELETE /api/machines/:id
```

### Production Records
```
GET    /api/production-records
GET    /api/production-records/:id
POST   /api/production-records
PUT    /api/production-records/:id
DELETE /api/production-records/:id
```

### Reports
```
GET    /api/reports/summary
GET    /api/reports/top-performers
GET    /api/reports/bonus-eligible
GET    /api/reports/promotion-candidates
GET    /api/reports/hr-review-required
GET    /api/reports/department-performance
```

> Reports are restricted to System Admin and Factory Manager roles.

---

## Swagger API Documentation

The backend includes interactive Swagger API documentation using `swagger-ui-express` and `swagger-jsdoc`.

After starting the backend server, open:

```
http://localhost:5001/api-docs
```

The Swagger interface allows full interactive API testing and endpoint exploration directly from the browser.

### How to test via Swagger

1. Open `http://localhost:5001/api-docs`
2. Find `POST /api/auth/login` → click **Try it out**
3. Enter credentials and click **Execute**
4. Copy the `token` from the response
5. Click **Authorize** (top right) and enter: `Bearer YOUR_TOKEN`
6. All protected endpoints are now accessible for testing

---

## Database Design

The project uses **SQLite** as the relational database.

### Main Tables

| Table | Description |
|---|---|
| users | System user accounts and roles |
| employees | Factory employee records |
| departments | Factory department definitions |
| products | Product catalog |
| machines | Production machines |
| production_records | Daily production operation logs |

### Relationships
- Employees belong to departments
- Machines belong to departments
- Production records connect employees, products, and machines via foreign keys

---

## Security and Authorization

The system uses **JWT-based authentication**.

Protected routes verify:
- Token validity and expiry
- User ownership (data isolation per user)
- Role permissions (RBAC enforcement)

Unauthorized users cannot access restricted modules even if frontend routes are manually entered. Backend authorization is enforced independently of frontend visibility.

---

## Installation and Running

### Prerequisites
- Node.js v18+
- npm
- Python 3 (for frontend server)

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on: `http://localhost:5001`  
API base URL: `http://localhost:5001/api`  
Swagger docs: `http://localhost:5001/api-docs`

### Frontend Setup

```bash
cd frontend
python3 -m http.server 5501
```

Frontend runs on: `http://localhost:5501`

---

## Running Tests

```bash
cd backend
npm test
```

### Test Results

```
Test Suites: 8 passed, 8 total
Tests:       51 passed, 51 total
```

### Test Coverage

| Suite | Description |
|---|---|
| authService | Authentication logic |
| performanceCalculator | Score calculation logic |
| recommendationService | Automated recommendation logic |
| employeeValidator | Employee input validation |
| departmentValidator | Department input validation |
| productValidator | Product input validation |
| machineValidator | Machine input validation |
| productionRecordValidator | Production record validation |

---

## Demo Users

All demo users share the same password: `TatLee123`

| Role | Email |
|---|---|
| System Admin | admin@tatleefactory.com |
| Factory Manager | manager@tatleefactory.com |
| Production Supervisor | production@tatleefactory.com |
| Quality Control | quality@tatleefactory.com |
| HR Specialist | hr@tatleefactory.com |
| Department Viewer | viewer@tatleefactory.com |

---

## Project Structure

```
employee-productivity-operational-performance-system/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── scripts/
│   ├── package.json
│   └── database.sqlite
│
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── style.css
│
└── README.md
```

---

## Screenshots

The project includes screenshots demonstrating:

- Login screen
- Role-based dashboards
- Employee management
- Machine management
- Product management
- Production records
- Smart employee reports
- Swagger API documentation
- Jest test results

---

## GitHub Repository

[https://github.com/ismailtatli/employee-productivity-operational-performance-system](https://github.com/ismailtatli/employee-productivity-operational-performance-system)

---

## Conclusion

This project demonstrates a realistic full-stack operational management platform rather than a basic CRUD application.

The system combines:

- RESTful API architecture
- Role-based authorization (6 roles)
- Smart employee performance evaluation
- Production data management
- Quality and continuity analysis
- Automated reporting and decision support
- JWT authentication
- Modular layered backend architecture
- Interactive Swagger documentation
- Automated unit testing (51 tests)

The application was designed to simulate real-world factory operations and management workflows in a professional environment.