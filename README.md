# Employee Productivity and Operational Performance Management System

## Project Overview

Employee Productivity and Operational Performance Management System is a role-based factory management web application designed for TatLee Factory.

The system helps a factory monitor employee productivity, production performance, machine usage, product output, quality indicators, attendance continuity, bonus eligibility, promotion candidates, and operational decision reports.

This project was developed as a System Analysis and Design final project. It demonstrates a complete software solution with authentication, role-based access control, CRUD operations, production record management, smart employee reports, automated scoring logic, and backend tests.

The application is designed to represent a realistic company environment where each user role has a different responsibility and access level.

## Project Purpose

The main goal of this project is to convert factory production data into meaningful management information.

The system helps answer questions such as:

- Which employee produced which product?
- Which machine was used during production?
- How much was produced compared to the target?
- How many defective products were detected?
- Was the work completed on time?
- Did the employee maintain attendance and punctuality?
- Is the employee eligible for a bonus?
- Is the employee a promotion candidate?
- Which employee needs improvement or HR review?

Instead of evaluating employee performance manually, the system calculates performance indicators automatically and creates structured reports for management.

## Main Features

### Authentication

The system includes secure login functionality. Users sign in with email and password. After login, the application stores the token locally and uses it for authorized API requests.

### Role-Based Access Control

The system uses role-based access control to make the application realistic and secure. Each role sees only the modules related to its responsibility.

Supported roles are:

- System Admin
- Factory Manager
- Production Supervisor
- Quality Control Specialist
- HR Specialist
- Department Viewer

### Employee Management

The employee module stores and manages employee information such as:

- Full name
- Employee code
- Email
- Position
- Department
- Hire date
- Status

Admin, Factory Manager, and HR Specialist can manage employees. Production Supervisor can view production-assignable employees but cannot create, edit, or delete employee records.

### Department Management

The department module manages factory departments. Employees and machines are connected to departments using foreign key relationships.

Admin, Factory Manager, and HR Specialist can access this module.

### Product Management

The product module stores product definitions such as:

- Product code
- Product name
- Category
- Standard unit
- Target per shift
- Status

Admin and Factory Manager can manage products. Production and Quality users can view product definitions according to their role.

### Machine Management

The machine module stores production machine information such as:

- Machine code
- Machine name
- Department
- Status
- Capacity per shift
- Description

Admin and Factory Manager can manage machines. Production Supervisor can view machines related to production operations.

### Production Records

Production Records are the core operational module of the system. Each production record connects:

- Employee
- Product
- Machine
- Record date
- Period
- Product type
- Target quantity
- Actual quantity
- Defective quantity
- On-time completion score
- Planned work days
- Absent days
- Late days
- Notes

Production Supervisor can create and update production records. These records are later used by the system to calculate productivity, quality, continuity, bonus, and performance reports.

### Smart Employee Report Center

Admin and Factory Manager can access the Reports module. The report center lists employees and allows management to open a detailed personal report for each employee.

The personal report includes:

- General efficiency score
- Performance decision
- Bonus status
- Promotion status
- Quality score
- Continuity score
- On-time completion score
- Absence and late arrival data
- Production target versus actual production
- Department comparison
- Trend analysis
- Strengths
- Areas for improvement
- System-generated recommendation

## Role-Based Access Details

### System Admin

System Admin has full system access.

Visible modules:

- Dashboard
- Employees
- Departments
- Products
- Machines
- Production Records
- Reports

System Admin can manage all modules and view all operational and management data.

### Factory Manager

Factory Manager has full management visibility.

Visible modules:

- Dashboard
- Employees
- Departments
- Products
- Machines
- Production Records
- Reports

Factory Manager can review bonus candidates, promotion candidates, employee reports, and factory performance indicators.

### Production Supervisor

Production Supervisor focuses on production operations.

Visible modules:

- Dashboard
- Employees
- Products
- Machines
- Production Records

Hidden modules:

- Departments
- Reports

Production Supervisor can:

- View production-assignable active employees
- View products used in production
- View production machines
- Create and update production records

Production Supervisor cannot access HR reports, bonus reports, promotion reports, or department management.

This design is intentional. The Production Supervisor should not see HR staff, system users, managers, or unrelated office staff. The role only sees employees who can be assigned to production operations.

### Quality Control Specialist

Quality Control Specialist focuses on product quality and production quality checks.

Visible modules:

- Dashboard
- Products
- Production Records

Hidden modules:

- Employees
- Departments
- Machines
- Reports

Quality Control Specialist can review products and production records from a quality-control perspective.

### HR Specialist

HR Specialist manages workforce-related data.

Visible modules:

- Dashboard
- Employees
- Departments

Hidden modules:

- Products
- Machines
- Production Records
- Reports

HR can manage employees and departments but cannot access production operation details or management reports.

### Department Viewer

Department Viewer is a read-only display user.

Visible modules:

- Dashboard only

Department Viewer cannot create, update, delete, or access detailed management pages. This account is suitable for shared factory screens or monitoring boards.

## Smart Performance Scoring Logic

The system calculates employee performance using measurable production and attendance data.

### Target Completion Score

This score compares actual production quantity with target production quantity.

Example:

If the target quantity is 500 and the actual quantity is 475, the system calculates the completion percentage based on actual output.

### Quality Score

Quality score is calculated using defective quantity and actual production quantity.

A lower defect rate results in a higher quality score.

### Continuity Score

Continuity score is calculated using:

- Planned work days
- Absent days
- Late days

Absence and late arrival reduce the continuity score.

### On-Time Completion Score

This score represents how successfully the employee completed work on time.

### Overall Performance Score

The overall performance score is calculated using weighted indicators:

- Target completion
- Quality
- On-time completion
- Continuity

The final score is used for employee performance classification.

## Automatic Report Decisions

The system automatically generates badges and decisions based on employee performance.

Example badges:

- Bonus Earned
- Promotion Candidate
- Star of the Month
- Needs Improvement
- Stable Performance

Example system decisions:

- Outstanding Performer
- High Performer
- Stable Performer
- Needs Improvement
- Critical Review Required

These automatic results support management decision-making.

## Bonus and Promotion Logic

### Bonus Eligibility

An employee can become bonus eligible when performance, quality, and continuity scores meet the required thresholds.

The report shows:

- Bonus status
- Bonus band
- Missing score needed for bonus eligibility

### Promotion Evaluation

Promotion readiness is evaluated using:

- Overall performance score
- Quality score
- Continuity score
- On-time completion score

The report also shows the promotion criteria completion percentage.

## Technology Stack

### Backend

- Node.js
- Express.js
- SQLite
- JWT-based authentication
- RESTful API structure
- Modular backend architecture

### Frontend

- HTML
- CSS
- JavaScript
- Dynamic role-based interface
- LocalStorage token management
- Responsive dashboard and report pages

### Testing

- Jest
- Unit tests
- Validator tests
- Business logic tests

## Software Architecture

The project follows a layered architecture.

### Controller Layer

Controllers handle HTTP requests and responses.

Main controllers:

- Auth Controller
- Employee Controller
- Department Controller
- Product Controller
- Machine Controller
- Production Record Controller
- Report Controller

### Service Layer

Services contain business logic.

Main responsibilities:

- Authentication logic
- Performance calculation
- Recommendation generation
- Production record enrichment
- Role-based data filtering
- Smart report generation

### Repository Layer

Repositories handle database queries.

Main repositories:

- Employee Repository
- Department Repository
- Product Repository
- Machine Repository
- Production Record Repository
- Report Repository

### Validator Layer

Validators check input data before processing.

Main validators:

- Auth Validator
- Employee Validator
- Department Validator
- Product Validator
- Machine Validator
- Production Record Validator

## API Overview

### Authentication Endpoints

- POST /api/auth/login
- POST /api/auth/register

### Employee Endpoints

- GET /api/employees
- GET /api/employees/:id
- POST /api/employees
- PUT /api/employees/:id
- DELETE /api/employees/:id

### Department Endpoints

- GET /api/departments
- POST /api/departments
- PUT /api/departments/:id
- DELETE /api/departments/:id

### Product Endpoints

- GET /api/products
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

### Machine Endpoints

- GET /api/machines
- POST /api/machines
- PUT /api/machines/:id
- DELETE /api/machines/:id

### Production Record Endpoints

- GET /api/production-records
- GET /api/production-records/:id
- POST /api/production-records
- PUT /api/production-records/:id
- DELETE /api/production-records/:id

### Report Endpoints

- GET /api/reports/summary
- GET /api/reports/top-performers
- GET /api/reports/bonus-eligible
- GET /api/reports/promotion-candidates
- GET /api/reports/hr-review-required
- GET /api/reports/department-performance

Reports are restricted to System Admin and Factory Manager.

## Demo Users

All demo users use the same password:

    TatLee123

System Admin:

- Email: admin@tatleefactory.com
- Access: Full system access

Factory Manager:

- Email: manager@tatleefactory.com
- Access: Full management access

Production Supervisor:

- Email: production@tatleefactory.com
- Access: Production-focused access

Quality Control Specialist:

- Email: quality@tatleefactory.com
- Access: Quality-focused access

HR Specialist:

- Email: hr@tatleefactory.com
- Access: Employee and department access

Department Viewer:

- Email: viewer@tatleefactory.com
- Access: Read-only dashboard access

## Installation and Running

### Backend Setup

Go to the backend folder:

    cd backend

Install dependencies:

    npm install

Start the backend server:

    npm run dev

Backend runs on:

    http://localhost:5001

API base URL:

    http://localhost:5001/api

### Frontend Setup

Go to the frontend folder:

    cd frontend

Start a local frontend server:

    python3 -m http.server 5501

Frontend runs on:

    http://localhost:5501

## Running Tests

Go to the backend folder:

    cd backend

Run tests:

    npm test

Current test status:

- Test Suites: 8 passed, 8 total
- Tests: 51 passed, 51 total

The tests cover:

- Authentication service
- Performance calculation
- Recommendation service
- Employee validation
- Department validation
- Product validation
- Machine validation
- Production record validation

## Project Structure

    employee-productivity-operational-performance-system/
    |
    |-- backend/
    |   |-- src/
    |   |   |-- config/
    |   |   |-- controllers/
    |   |   |-- middlewares/
    |   |   |-- repositories/
    |   |   |-- routes/
    |   |   |-- services/
    |   |   |-- validators/
    |   |   |-- server.js
    |   |
    |   |-- tests/
    |   |-- scripts/
    |   |-- package.json
    |   |-- database.sqlite
    |
    |-- frontend/
    |   |-- index.html
    |   |-- app.js
    |   |-- style.css
    |
    |-- README.md

## Professional System Behavior

This project is designed to behave like a realistic company system.

Important behavior examples:

- Production Supervisor cannot access HR reports.
- HR cannot access production operation modules.
- Quality Control cannot manage employees.
- Viewer cannot edit any data.
- Admin and Factory Manager can access smart employee reports.
- Reports are generated from measurable production records.
- Role-based menus prevent unauthorized access.
- Backend access rules protect sensitive data even if frontend menus are hidden.

## Final Project Highlights

This project demonstrates:

- Full-stack web application development
- Secure login and authentication
- Role-based access control
- CRUD operations
- Production data management
- Smart scoring and report generation
- Professional dashboard design
- Modular backend architecture
- Automated backend tests
- Realistic factory workflow modeling

## Final Notes

This project is not only a CRUD application. It includes business rules, role-based authorization, automatic performance scoring, decision support, and smart employee reporting.

The system shows how raw production data can be converted into meaningful management insights such as bonus eligibility, promotion readiness, performance trends, quality analysis, and HR follow-up recommendations.
