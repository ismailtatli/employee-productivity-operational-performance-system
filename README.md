# Employee Productivity and Operational Performance Management System

A full-stack web-based management system developed for the System Analysis and Design course.  
The project is designed as an internal factory performance intelligence portal for **TatLee Factory**.

The system helps authorized users monitor employee productivity, department structure, product catalog, production machines, production records, continuity indicators, quality results, bonus eligibility, promotion candidates and HR review recommendations.

---

## Project Purpose

The main goal of this project is to provide a structured operational performance management system for a production company.

Instead of evaluating employees only subjectively, the system stores measurable production and continuity data such as:

- Target production quantity
- Actual production quantity
- Defective product quantity
- On-time completion score
- Planned work days
- Absent days
- Late days
- Product information
- Production machine information

Based on these inputs, the system calculates performance indicators and generates decision-support outputs such as:

- Overall performance score
- Performance grade
- Bonus eligibility
- Promotion candidate status
- Monitoring recommendation
- HR review requirement
- Employee report summary

---

## Main Features

### Authentication and Role-Based Access

The system includes secure login and role-based access control.

Demo users:

| Role | Email | Password |
|---|---|---|
| Admin | admin@tatleefactory.com | TatLee123 |
| Manager | manager@tatleefactory.com | TatLee123 |
| Production | production@tatleefactory.com | TatLee123 |
| Quality | quality@tatleefactory.com | TatLee123 |
| Viewer | viewer@tatleefactory.com | TatLee123 |

Admin users can manage the full system.  
Viewer users have read-only access.

---

## System Modules

### Dashboard

Displays a high-level summary of the factory’s operational performance:

- Total employees
- Active employees
- Total production records
- Total actual production
- Average performance score
- Average quality score
- Average continuity score
- Bonus eligible employees
- Top performers
- Department performance overview

### Employees

Allows authorized users to manage employee records.

Main capabilities:

- List employees
- Search employees
- Filter by department
- Filter by status
- Add employee
- Edit employee
- Delete employee

### Departments

Manages organizational departments.

Main capabilities:

- List departments
- Search departments
- Add department
- Edit department
- Delete department
- Display employee count by department

### Products

Manages the factory product catalog.

Main capabilities:

- List products
- Search products
- Filter by status
- Add product
- Edit product
- Delete product

Each product includes:

- Product code
- Product name
- Category
- Standard unit
- Target production per shift
- Status

### Machines

Manages production machines used in factory operations.

Main capabilities:

- List machines
- Search machines
- Filter by department
- Filter by status
- Add machine
- Edit machine
- Delete machine

Each machine includes:

- Machine code
- Machine name
- Department
- Status
- Capacity per shift
- Description

### Production Records

Tracks production activity and employee performance.

Each record stores:

- Employee
- Product
- Production machine
- Record date
- Period
- Target quantity
- Actual quantity
- Defective quantity
- On-time completion score
- Planned work days
- Absent days
- Late days
- Notes

The system automatically calculates:

- Target completion score
- Quality score
- Continuity score
- Overall performance score
- Performance grade
- Bonus eligibility
- Recommendation
- Employee report summary

### Reports

Provides analytical reports for management decisions.

Included reports:

- Summary report
- Top performers
- Bonus eligible employees
- Promotion candidates
- Low continuity employees
- HR review required employees
- Department performance report

---

## Data Scale

The system includes realistic seed data for demonstration:

| Data Type | Count |
|---|---:|
| Users | 5 |
| Departments | 6 |
| Employees | 100 |
| Products | 25 |
| Production Machines | 10 |
| Production Records | 120 |

This makes the project look and behave like a realistic factory management system instead of a small demo application.

---

## Technology Stack

### Backend

- Node.js
- Express.js
- SQLite
- JWT Authentication
- bcryptjs
- Swagger API Documentation
- Jest Testing

### Frontend

- HTML
- CSS
- JavaScript
- Fetch API
- Responsive dashboard layout

### Architecture Style

The project follows a layered backend architecture:

```txt
Routes
Controllers
Services
Repositories
Database