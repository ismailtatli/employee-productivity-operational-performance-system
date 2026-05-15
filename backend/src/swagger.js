const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Employee Productivity and Operational Performance Management System API",
      version: "1.0.0",
      description:
        "RESTful API documentation for TatLee Factory Employee Productivity and Operational Performance Management System."
    },
    servers: [
      {
        url: "http://localhost:5001",
        description: "Local development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              example: "admin@tatleefactory.com"
            },
            password: {
              type: "string",
              example: "TatLee123"
            }
          }
        },
        Department: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            departmentName: { type: "string", example: "Production" },
            managerName: { type: "string", example: "Factory Manager" },
            description: {
              type: "string",
              example: "Main production operations department"
            },
            employeeCount: { type: "integer", example: 3 }
          }
        },
        Employee: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            fullName: { type: "string", example: "Ahmet Yılmaz" },
            employeeCode: { type: "string", example: "EMP-001" },
            email: {
              type: "string",
              example: "ahmet.yilmaz@tatleefactory.com"
            },
            position: { type: "string", example: "Production Operator" },
            departmentId: { type: "integer", example: 1 },
            departmentName: { type: "string", example: "Production" },
            hireDate: { type: "string", example: "2024-02-12" },
            status: { type: "string", example: "Active" }
          }
        },
        ProductionRecord: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            employeeId: { type: "integer", example: 1 },
            recordDate: { type: "string", example: "2026-05-01" },
            period: { type: "string", example: "2026-Q2" },
            productType: { type: "string", example: "Packaging Unit" },
            targetQuantity: { type: "integer", example: 500 },
            actualQuantity: { type: "integer", example: 465 },
            defectiveQuantity: { type: "integer", example: 12 },
            onTimeCompletionScore: { type: "number", example: 90 },
            plannedWorkDays: { type: "integer", example: 22 },
            absentDays: { type: "integer", example: 1 },
            lateDays: { type: "integer", example: 2 },
            targetCompletionScore: { type: "number", example: 93 },
            qualityScore: { type: "number", example: 97.42 },
            continuityScore: { type: "number", example: 90.91 },
            overallPerformanceScore: { type: "number", example: 93.09 },
            performanceGrade: { type: "string", example: "Excellent" },
            bonusEligible: { type: "boolean", example: true },
            recommendation: { type: "string", example: "Promotion Candidate" },
            reportSummary: {
              type: "string",
              example:
                "The employee exceeded the expected operational performance level."
            },
            notes: {
              type: "string",
              example: "Good production result with minor defect risk."
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    paths: {
      "/": {
        get: {
          summary: "API health check",
          tags: ["System"],
          security: [],
          responses: {
            200: {
              description: "API is running"
            }
          }
        }
      },
      "/api/auth/login": {
        post: {
          summary: "Login with email and password",
          tags: ["Authentication"],
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginRequest"
                }
              }
            }
          },
          responses: {
            200: {
              description: "Login successful"
            },
            401: {
              description: "Invalid email or password"
            }
          }
        }
      },
      "/api/auth/me": {
        get: {
          summary: "Get current authenticated user",
          tags: ["Authentication"],
          responses: {
            200: {
              description: "Current user returned"
            },
            401: {
              description: "Access token is required"
            }
          }
        }
      },
      "/api/employees": {
        get: {
          summary: "Get all employees",
          tags: ["Employees"],
          responses: {
            200: {
              description: "Employee list returned"
            }
          }
        },
        post: {
          summary: "Create a new employee",
          tags: ["Employees"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "fullName",
                    "employeeCode",
                    "email",
                    "position",
                    "departmentId",
                    "hireDate"
                  ],
                  properties: {
                    fullName: { type: "string", example: "Ali Vural" },
                    employeeCode: { type: "string", example: "EMP-100" },
                    email: {
                      type: "string",
                      example: "ali.vural@tatleefactory.com"
                    },
                    position: {
                      type: "string",
                      example: "Production Operator"
                    },
                    departmentId: { type: "integer", example: 1 },
                    hireDate: { type: "string", example: "2026-05-10" },
                    status: { type: "string", example: "Active" }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: "Employee created successfully"
            },
            400: {
              description: "Validation error"
            }
          }
        }
      },
      "/api/employees/{id}": {
        get: {
          summary: "Get employee by id",
          tags: ["Employees"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" }
            }
          ],
          responses: {
            200: { description: "Employee returned" },
            404: { description: "Employee not found" }
          }
        },
        put: {
          summary: "Update employee by id",
          tags: ["Employees"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" }
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Employee"
                }
              }
            }
          },
          responses: {
            200: { description: "Employee updated successfully" }
          }
        },
        delete: {
          summary: "Delete employee by id",
          tags: ["Employees"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" }
            }
          ],
          responses: {
            200: { description: "Employee deleted successfully" }
          }
        }
      },
      "/api/employees/search": {
        get: {
          summary: "Search employees",
          tags: ["Employees"],
          parameters: [
            {
              in: "query",
              name: "query",
              required: true,
              schema: { type: "string" },
              example: "Ahmet"
            }
          ],
          responses: {
            200: { description: "Search result returned" }
          }
        }
      },
      "/api/employees/department/{departmentId}": {
        get: {
          summary: "Get employees by department",
          tags: ["Employees"],
          parameters: [
            {
              in: "path",
              name: "departmentId",
              required: true,
              schema: { type: "integer" }
            }
          ],
          responses: {
            200: { description: "Employees returned by department" }
          }
        }
      },
      "/api/departments": {
        get: {
          summary: "Get all departments",
          tags: ["Departments"],
          responses: {
            200: { description: "Department list returned" }
          }
        },
        post: {
          summary: "Create a new department",
          tags: ["Departments"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["departmentName", "managerName"],
                  properties: {
                    departmentName: { type: "string", example: "Maintenance" },
                    managerName: { type: "string", example: "Kemal Arı" },
                    description: {
                      type: "string",
                      example:
                        "Responsible for machine maintenance and technical support"
                    }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: "Department created successfully" }
          }
        }
      },
      "/api/departments/{id}": {
        get: {
          summary: "Get department by id",
          tags: ["Departments"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" }
            }
          ],
          responses: {
            200: { description: "Department returned" }
          }
        },
        put: {
          summary: "Update department by id",
          tags: ["Departments"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" }
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Department"
                }
              }
            }
          },
          responses: {
            200: { description: "Department updated successfully" }
          }
        },
        delete: {
          summary: "Delete department by id",
          tags: ["Departments"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" }
            }
          ],
          responses: {
            200: { description: "Department deleted successfully" }
          }
        }
      },
      "/api/production-records": {
        get: {
          summary: "Get all production records with performance analysis",
          tags: ["Production Records"],
          responses: {
            200: {
              description: "Production records returned with calculated performance analysis"
            }
          }
        },
        post: {
          summary: "Create a new production record",
          tags: ["Production Records"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "employeeId",
                    "recordDate",
                    "period",
                    "productType",
                    "targetQuantity",
                    "actualQuantity",
                    "defectiveQuantity",
                    "onTimeCompletionScore",
                    "plannedWorkDays",
                    "absentDays",
                    "lateDays"
                  ],
                  properties: {
                    employeeId: { type: "integer", example: 4 },
                    recordDate: { type: "string", example: "2026-05-15" },
                    period: { type: "string", example: "2026-Q2" },
                    productType: {
                      type: "string",
                      example: "Production Line B"
                    },
                    targetQuantity: { type: "integer", example: 550 },
                    actualQuantity: { type: "integer", example: 590 },
                    defectiveQuantity: { type: "integer", example: 6 },
                    onTimeCompletionScore: { type: "number", example: 97 },
                    plannedWorkDays: { type: "integer", example: 22 },
                    absentDays: { type: "integer", example: 0 },
                    lateDays: { type: "integer", example: 0 },
                    notes: {
                      type: "string",
                      example:
                        "Excellent production result with strong quality and continuity."
                    }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: "Production record created successfully"
            }
          }
        }
      },
      "/api/production-records/{id}": {
        get: {
          summary: "Get production record by id",
          tags: ["Production Records"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" }
            }
          ],
          responses: {
            200: { description: "Production record returned" }
          }
        },
        put: {
          summary: "Update production record by id",
          tags: ["Production Records"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" }
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProductionRecord"
                }
              }
            }
          },
          responses: {
            200: { description: "Production record updated successfully" }
          }
        },
        delete: {
          summary: "Delete production record by id",
          tags: ["Production Records"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" }
            }
          ],
          responses: {
            200: { description: "Production record deleted successfully" }
          }
        }
      },
      "/api/production-records/employee/{employeeId}": {
        get: {
          summary: "Get production records by employee",
          tags: ["Production Records"],
          parameters: [
            {
              in: "path",
              name: "employeeId",
              required: true,
              schema: { type: "integer" }
            }
          ],
          responses: {
            200: { description: "Production records returned by employee" }
          }
        }
      },
      "/api/reports/summary": {
        get: {
          summary: "Get dashboard summary report",
          tags: ["Reports"],
          responses: {
            200: { description: "Summary report returned" }
          }
        }
      },
      "/api/reports/top-performers": {
        get: {
          summary: "Get top performers",
          tags: ["Reports"],
          responses: {
            200: { description: "Top performers returned" }
          }
        }
      },
      "/api/reports/bonus-eligible": {
        get: {
          summary: "Get bonus eligible employees",
          tags: ["Reports"],
          responses: {
            200: { description: "Bonus eligible employees returned" }
          }
        }
      },
      "/api/reports/promotion-candidates": {
        get: {
          summary: "Get promotion candidates",
          tags: ["Reports"],
          responses: {
            200: { description: "Promotion candidates returned" }
          }
        }
      },
      "/api/reports/low-continuity": {
        get: {
          summary: "Get employees with low continuity score",
          tags: ["Reports"],
          responses: {
            200: { description: "Low continuity employees returned" }
          }
        }
      },
      "/api/reports/hr-review-required": {
        get: {
          summary: "Get employees requiring HR review",
          tags: ["Reports"],
          responses: {
            200: { description: "HR review required employees returned" }
          }
        }
      },
      "/api/reports/department-performance": {
        get: {
          summary: "Get department performance report",
          tags: ["Reports"],
          responses: {
            200: { description: "Department performance report returned" }
          }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;