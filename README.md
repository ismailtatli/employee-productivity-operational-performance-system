# Employee Productivity and Operational Performance Management System

> A role-based factory management web application designed for **TatLee Factory**.  
> Built as a System Analysis and Design final project — Spring 2026.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Main Features](#main-features)
- [Professional Enhancements](#professional-enhancements)
- [Technology Stack](#technology-stack)
- [Software Architecture](#software-architecture)
- [Role-Based Access Control](#role-based-access-control)
- [Shared Company Data Model](#shared-company-data-model)
- [Smart Performance Scoring](#smart-performance-scoring)
- [Audit Log System](#audit-log-system)
- [Soft Delete Policy](#soft-delete-policy)
- [Role-Based Dashboard](#role-based-dashboard)
- [Report Filtering](#report-filtering)
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
- User activity and operational changes through audit logs

The system converts raw factory production data into meaningful management information through automatic scoring, role-based access, structured reporting, shared company-wide records, and professional data protection rules.

---

## Main Features

### Authentication
Secure login with email and password. A JWT token is stored locally and used for authorized API requests.

### Registration
New users can register with a role/title. The selected title is normalized into the matching system role, and the same user can later log in with the same email and password to keep the same permissions.

### Role-Based Access Control
Each role has defined module access. Backend authorization is enforced independently of frontend menu visibility.

### Shared Company Data
The application uses a shared company data model. If a role has access to a module, that user can see all active company records in that module.

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
Generates standardized employee performance reports including efficiency score, performance decision, bonus status, promotion readiness, quality score, continuity score, and system-generated recommendations.

### Audit Logs
Important actions such as create, update, delete, login, register, and report/audit access are logged for accountability.

### Soft Delete
Operational records are not physically removed from the database. Delete operations mark records as deleted while preserving historical data.

---

## Professional Enhancements

This final version includes professional-level improvements beyond basic CRUD functionality:

- Audit log tracking
- Soft delete protection
- Role-based dashboard content
- Report filtering and sorting
- Shared company-wide data visibility
- Standardized employee report generation
- Automatic report recalculation when production data changes
- Backend-enforced role permissions

---

## Technology Stack

### Backend
- Node.js
- Express.js
- SQLite
- JWT Authentication
- bcrypt password hashing
- RESTful API
- Modular layered architecture: Controller → Service → Repository

### Frontend
- HTML, CSS, Vanilla JavaScript
- Dynamic role-based interface
- Role-based dashboard panels
- LocalStorage token management
- Single-page application without frontend frameworks

### Testing
- Jest
- Unit tests for validators and business logic
- Existing test suites for authentication, validators, performance calculation, and recommendations

---

## Software Architecture

The project follows a layered architecture pattern:

```text
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

**Controller Layer** — authController, employeeController, departmentController, productController, machineController, productionRecordController, reportController, dashboardController, auditLogController

**Service Layer** — authService, employeeService, departmentService, productService, machineService, productionRecordService, reportService, auditLogService, performanceCalculator, recommendationService

**Repository Layer** — userRepository, employeeRepository, departmentRepository, productRepository, machineRepository, productionRecordRepository, reportRepository, auditLogRepository

**Validator Layer** — authValidator, employeeValidator, departmentValidator, productValidator, machineValidator, productionRecordValidator

---

## Role-Based Access Control

### Module Access Matrix

| Role | Dashboard | Employees | Departments | Products | Machines | Production Records | Reports | Audit Logs |
|---|---|---|---|---|---|---|---|---|
| System Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Factory Manager | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Production Supervisor | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Quality Control | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| HR Specialist | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Department Viewer | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Write Permissions

Read access follows the matrix above. Some write/delete actions are more restricted for data safety:

| Module | Create / Update | Delete |
|---|---|---|
| Employees | Admin, Manager, HR | Admin only |
| Departments | Admin, Manager, HR | Admin only |
| Products | Admin, Manager, Production | Admin only |
| Machines | Admin, Manager, Production | Admin only |
| Production Records | Admin, Manager, Production | Admin only |
| Reports | Read-only for Admin and Manager | Not applicable |
| Audit Logs | Read-only for Admin and Manager | Not applicable |

---

## Shared Company Data Model

The system now works as a single-company operational platform.

If a user has permission to access a module, the user can view all active company records in that module. Data is no longer separated by individual `ownerUserId` during read operations.

Current demo dataset:

| Data Type | Count |
|---|---:|
| Employees | 100 |
| Employee Reports | 100 |
| Departments | 6 |
| Products | 25 |
| Machines | 10 |
| Production Records | 200 |

When a new production record is added, the production record count increases and all authorized users can see the updated data. Related employee reports are recalculated from the latest production records.

---

## Smart Performance Scoring

The system automatically calculates employee performance using weighted indicators:

| Indicator | Description |
|---|---|
| Target Completion | Actual production quantity compared with target quantity |
| Quality Score | Defect rate compared with actual production |
| Continuity Score | Attendance, absences, and late arrivals |
| On-Time Completion | Timeliness of work completion |
| Overall Score | Weighted combination of all performance indicators |

### Report Standard

Each employee report includes:

- Employee identity and department
- Efficiency score
- Quality score
- Continuity score
- On-time score
- Overall performance score
- Performance decision
- Bonus eligibility
- Promotion readiness
- HR review flag when needed
- System-generated recommendation

### Performance Decisions

- Outstanding Performer
- High Performer
- Stable Performer
- Needs Improvement
- Critical Review Required

### Automatic Badges

- Bonus Earned
- Promotion Candidate
- Star of the Month
- Stable Performance
- Needs Improvement
- HR Review Required

Scores are intentionally distributed across multiple levels so not every employee receives a very high performance result.

---

## Audit Log System

The audit log system records important system activity.

Tracked information includes:

- User ID
- User email
- User role
- Action type
- Entity/module name
- HTTP method
- API path
- Status code
- Timestamp

Audit Logs are available only to:

- System Admin
- Factory Manager

Audit logs improve accountability by showing who performed important actions in the system.

---

## Soft Delete Policy

The system uses soft delete for operational safety.

Instead of permanently removing important records, delete operations set a `deletedAt` value. Active list screens exclude deleted records, but historical data remains preserved in the database.

Soft delete is applied to:

- Employees
- Departments
- Products
- Machines
- Production records

This protects historical reporting and avoids broken references between employees, products, machines, and production records.

---

## Role-Based Dashboard

The dashboard content changes depending on the logged-in user role.

| Role | Dashboard Focus |
|---|---|
| System Admin | Full operational overview, reports, audit activity |
| Factory Manager | Full management overview and decision support |
| Production Supervisor | Production records, products, machines, operational productivity |
| Quality Control | Product and production quality indicators |
| HR Specialist | Employee and department overview |
| Department Viewer | Safe general overview only |

---

## Report Filtering

The report center includes filtering and sorting tools.

Available report controls include:

- Filter by department
- Filter by performance level
- Filter by badge/status
- Sort by employee name
- Sort by total score
- Sort by quality score
- Sort by continuity score

This makes the report screen easier to use for management review and decision-making.

---

## API Overview

### Authentication
```text
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me
```

### Dashboard
```text
GET    /api/dashboard/summary
```

### Employees
```text
GET    /api/employees
GET    /api/employees/:id
GET    /api/employees/search
GET    /api/employees/department/:departmentId
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id
```

### Departments
```text
GET    /api/departments
GET    /api/departments/:id
POST   /api/departments
PUT    /api/departments/:id
DELETE /api/departments/:id
```

### Products
```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Machines
```text
GET    /api/machines
GET    /api/machines/:id
POST   /api/machines
PUT    /api/machines/:id
DELETE /api/machines/:id
```

### Production Records
```text
GET    /api/production-records
GET    /api/production-records/:id
GET    /api/production-records/employee/:employeeId
POST   /api/production-records
PUT    /api/production-records/:id
DELETE /api/production-records/:id
```

### Reports
```text
GET    /api/reports/summary
GET    /api/reports/employees
GET    /api/reports/top-performers
GET    /api/reports/bonus-eligible
GET    /api/reports/promotion-candidates
GET    /api/reports/low-continuity
GET    /api/reports/hr-review-required
GET    /api/reports/department-performance
```

Reports are restricted to System Admin and Factory Manager roles.

### Audit Logs
```text
GET    /api/audit-logs
```

Audit Logs are restricted to System Admin and Factory Manager roles.

---

## Swagger API Documentation

The backend includes interactive Swagger API documentation using `swagger-ui-express` and `swagger-jsdoc`.

After starting the backend server, open:

```text
http://localhost:5001/api-docs
```

The Swagger interface allows interactive API testing and endpoint exploration directly from the browser.

### How to test via Swagger

1. Open `http://localhost:5001/api-docs`
2. Find `POST /api/auth/login` and click **Try it out**
3. Enter credentials and click **Execute**
4. Copy the token from the response
5. Click **Authorize** and enter `Bearer YOUR_TOKEN`
6. Protected endpoints are now available for testing

---

## Database Design

The project uses SQLite as the relational database.

### Main Tables

| Table | Description |
|---|---|
| users | System user accounts and roles |
| employees | Factory employee records |
| departments | Factory department definitions |
| products | Product catalog |
| production_machines | Production machines |
| production_records | Daily production operation logs |
| audit_logs | System activity and change history |

### Relationships

- Employees belong to departments
- Machines belong to departments
- Production records connect employees, products, and machines via foreign keys
- Audit logs connect user actions with system modules

---

## Security and Authorization

The system uses JWT-based authentication and role-based authorization.

Protected routes verify:

- Token validity and expiry
- User status
- Role permissions
- Backend access control independently of frontend visibility

Unauthorized users cannot access restricted modules even if frontend routes or API URLs are manually entered.

### Security Note

For a real production deployment, user registration should ideally require administrator approval before assigning powerful roles such as System Admin or Factory Manager. In this academic/demo version, registration supports role/title selection to demonstrate role-based access behavior.

---

## Installation and Running

### Prerequisites

- Node.js v18+
- npm
- Python 3 for the frontend static server

### Backend Setup

Open a terminal in the project folder:

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5001
```

API base URL:

```text
http://localhost:5001/api
```

Swagger docs:

```text
http://localhost:5001/api-docs
```

### Frontend Setup

Open a second terminal in the project folder:

```bash
cd frontend
python3 -m http.server 5501
```

Frontend runs on:

```text
http://localhost:5501
```

Important: open the frontend with `http://localhost:5501`, not with a `file:///` path.

---

## Running Tests

```bash
cd backend
npm install
npm test
```

### Test Coverage Areas

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

All demo users share the same password:

```text
TatLee123
```

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

```text
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
│   │   ├── utils/
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
├── screenshots/
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
- Audit logs
- Swagger API documentation
- Jest test results

---

## GitHub Repository

https://github.com/ismailtatli/employee-productivity-operational-performance-system

---

## Conclusion

This project demonstrates a realistic full-stack operational management platform rather than a basic CRUD application.

The system combines:

- RESTful API architecture
- Role-based authorization
- Shared company-wide operational data
- Smart employee performance evaluation
- Standardized reports for 100 employees
- Production data management
- Quality and continuity analysis
- Automated reporting and decision support
- Audit log tracking
- Soft delete protection
- Role-based dashboards
- Report filtering and sorting
- JWT authentication
- bcrypt password hashing
- Modular layered backend architecture
- Interactive Swagger documentation
- Automated unit testing structure

The application was designed to simulate real-world factory operations and management workflows in a professional environment.
