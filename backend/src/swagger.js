const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Employee Productivity and Operational Performance Management System API",
      version: "1.0.0",
      description:
        "RESTful API documentation for TatLee Factory Employee Productivity and Operational Performance Management System. The API supports authentication, employee management, department management, product catalog management, production machine management, production record tracking and operational performance reports."
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
            employeeCount: { type: "integer", example: 40 }
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

        Product: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            productCode: { type: "string", example: "PRD-001" },
            productName: { type: "string", example: "Chocolate Wafer Box" },
            category: { type: "string", example: "Food Packaging" },
            standardUnit: { type: "string", example: "box" },
            targetPerShift: { type: "integer", example: 500 },
            status: { type: "string", example: "Active" },
            createdAt: {
              type: "string",
              example: "2026-05-16 08:51:22"
            }
          }
        },

        ProductionMachine: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            machineCode: { type: "string", example: "MCH-001" },
            machineName: { type: "string", example: "Filling Line A" },
            departmentId: { type: "integer", example: 1 },
            departmentName: { type: "string", example: "Production" },
            status: { type: "string", example: "Active" },
            capacityPerShift: { type: "integer", example: 1200 },
            description: {
              type: "string",
              example: "High-volume filling and primary production line"
            },
            createdAt: {
              type: "string",
              example: "2026-05-16 08:51:22"
            }
          }
        },

        ProductionRecord: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            employeeId: { type: "integer", example: 1 },
            productId: { type: "integer", example: 1 },
            machineId: { type: "integer", example: 1 },
            recordDate: { type: "string", example: "2026-05-01" },
            period: { type: "string", example: "2026-Q2" },
            productType: {
              type: "string",
              example: "Chocolate Wafer Box"
            },
            targetQuantity: { type: "integer", example: 500 },
            actualQuantity: { type: "integer", example: 465 },
            defectiveQuantity: { type: "integer", example: 12 },
            onTimeCompletionScore: { type: "number", example: 90 },
            plannedWorkDays: { type: "integer", example: 22 },
            absentDays: { type: "integer", example: 1 },
            lateDays: { type: "integer", example: 2 },
            fullName: { type: "string", example: "Ahmet Yılmaz" },
            employeeCode: { type: "string", example: "EMP-001" },
            position: { type: "string", example: "Production Operator" },
            departmentName: { type: "string", example: "Production" },
            productCode: { type: "string", example: "PRD-001" },
            productName: { type: "string", example: "Chocolate Wafer Box" },
            productCategory: { type: "string", example: "Food Packaging" },
            standardUnit: { type: "string", example: "box" },
            machineCode: { type: "string", example: "MCH-001" },
            machineName: { type: "string", example: "Filling Line A" },
            machineStatus: { type: "string", example: "Active" },
            targetCompletionScore: { type: "number", example: 93 },
            qualityScore: { type: "number", example: 97.42 },
            continuityScore: { type: "number", example: 90.91 },
            overallPerformanceScore: { type: "number", example: 93.09 },
            performanceGrade: { type: "string", example: "Excellent" },
            bonusEligible: { type: "boolean", example: true },
            recommendation: {
              type: "string",
              example: "Promotion Candidate"
            },
            reportSummary: {
              type: "string",
              example:
                "Ahmet Yılmaz from Production exceeded the expected operational performance level with strong quality, continuity, and on-time completion indicators."
            },
            notes: {
              type: "string",
              example: "Good production result with minor defect risk."
            },
            createdAt: {
              type: "string",
              example: "2026-05-16 08:51:22"
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
                    employeeCode: { type: "string", example: "EMP-101" },
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
            },
            403: {
              description: "Forbidden"
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
            200: { description: "Employee updated successfully" },
            400: { description: "Validation error" },
            404: { description: "Employee not found" }
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
            200: { description: "Employee deleted successfully" },
            403: { description: "Forbidden" },
            404: { description: "Employee not found" }
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
            201: { description: "Department created successfully" },
            400: { description: "Validation error" },
            403: { description: "Forbidden" }
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
            200: { description: "Department returned" },
            404: { description: "Department not found" }
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
            200: { description: "Department updated successfully" },
            400: { description: "Validation error" },
            404: { description: "Department not found" }
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
            200: { description: "Department deleted successfully" },
            403: { description: "Forbidden" },
            404: { description: "Department not found" }
          }
        }
      },

      "/api/products": {
        get: {
          summary: "Get all products",
          tags: ["Products"],
          responses: {
            200: {
              description: "Product list returned"
            }
          }
        },
        post: {
          summary: "Create a new product",
          tags: ["Products"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "productCode",
                    "productName",
                    "category",
                    "standardUnit",
                    "targetPerShift"
                  ],
                  properties: {
                    productCode: { type: "string", example: "PRD-100" },
                    productName: {
                      type: "string",
                      example: "Chocolate Wafer Box"
                    },
                    category: {
                      type: "string",
                      example: "Food Packaging"
                    },
                    standardUnit: { type: "string", example: "box" },
                    targetPerShift: { type: "integer", example: 500 },
                    status: { type: "string", example: "Active" }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: "Product created successfully" },
            400: { description: "Validation error" },
            403: { description: "Forbidden" }
          }
        }
      },

      "/api/products/{id}": {
        get: {
          summary: "Get product by id",
          tags: ["Products"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" }
            }
          ],
          responses: {
            200: { description: "Product returned" },
            404: { description: "Product not found" }
          }
        },
        put: {
          summary: "Update product by id",
          tags: ["Products"],
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
                  $ref: "#/components/schemas/Product"
                }
              }
            }
          },
          responses: {
            200: { description: "Product updated successfully" },
            400: { description: "Validation error" },
            404: { description: "Product not found" }
          }
        },
        delete: {
          summary: "Delete product by id",
          tags: ["Products"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" }
            }
          ],
          responses: {
            200: { description: "Product deleted successfully" },
            403: { description: "Forbidden" },
            404: { description: "Product not found" }
          }
        }
      },

      "/api/machines": {
        get: {
          summary: "Get all production machines",
          tags: ["Machines"],
          responses: {
            200: {
              description: "Production machine list returned"
            }
          }
        },
        post: {
          summary: "Create a new production machine",
          tags: ["Machines"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: [
                    "machineCode",
                    "machineName",
                    "departmentId",
                    "capacityPerShift"
                  ],
                  properties: {
                    machineCode: { type: "string", example: "MCH-100" },
                    machineName: {
                      type: "string",
                      example: "Filling Line C"
                    },
                    departmentId: { type: "integer", example: 1 },
                    status: { type: "string", example: "Active" },
                    capacityPerShift: { type: "integer", example: 800 },
                    description: {
                      type: "string",
                      example:
                        "High-volume production line for packaged goods."
                    }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: "Production machine created successfully"
            },
            400: { description: "Validation error" },
            403: { description: "Forbidden" }
          }
        }
      },

      "/api/machines/{id}": {
        get: {
          summary: "Get production machine by id",
          tags: ["Machines"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" }
            }
          ],
          responses: {
            200: { description: "Production machine returned" },
            404: { description: "Production machine not found" }
          }
        },
        put: {
          summary: "Update production machine by id",
          tags: ["Machines"],
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
                  $ref: "#/components/schemas/ProductionMachine"
                }
              }
            }
          },
          responses: {
            200: {
              description: "Production machine updated successfully"
            },
            400: { description: "Validation error" },
            404: { description: "Production machine not found" }
          }
        },
        delete: {
          summary: "Delete production machine by id",
          tags: ["Machines"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" }
            }
          ],
          responses: {
            200: {
              description: "Production machine deleted successfully"
            },
            403: { description: "Forbidden" },
            404: { description: "Production machine not found" }
          }
        }
      },

      "/api/production-records": {
        get: {
          summary: "Get all production records with performance analysis",
          tags: ["Production Records"],
          responses: {
            200: {
              description:
                "Production records returned with calculated performance analysis"
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
                    "productId",
                    "machineId",
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
                    productId: { type: "integer", example: 1 },
                    machineId: { type: "integer", example: 1 },
                    recordDate: { type: "string", example: "2026-05-15" },
                    period: { type: "string", example: "2026-Q2" },
                    productType: {
                      type: "string",
                      example: "Chocolate Wafer Box"
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
            },
            400: {
              description: "Validation error"
            },
            403: {
              description: "Forbidden"
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
            200: { description: "Production record returned" },
            404: { description: "Production record not found" }
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
            200: {
              description: "Production record updated successfully"
            },
            400: {
              description: "Validation error"
            },
            404: {
              description: "Production record not found"
            }
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
            200: {
              description: "Production record deleted successfully"
            },
            403: {
              description: "Forbidden"
            },
            404: {
              description: "Production record not found"
            }
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
            200: {
              description: "Production records returned by employee"
            }
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