const API_BASE_URL = "http://localhost:5001/api";

const state = {
  token: localStorage.getItem("tatlee_token"),
  user: JSON.parse(localStorage.getItem("tatlee_user") || "null"),
  currentView: "dashboard",
  authMode: "login"
};

const app = document.getElementById("app");

function setAuth(token, user) {
  state.token = token;
  state.user = user;
  localStorage.setItem("tatlee_token", token);
  localStorage.setItem("tatlee_user", JSON.stringify(user));
}

function clearAuth() {
  state.token = null;
  state.user = null;
  localStorage.removeItem("tatlee_token");
  localStorage.removeItem("tatlee_user");
}

async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });
  } catch (error) {
    throw new Error("API connection failed. Please make sure the backend server is running on port 5001.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

function getBadgeClass(value) {
  if (!value) return "badge-info";

  if (
    value.includes("Excellent") ||
    value.includes("Eligible") ||
    value.includes("Promotion") ||
    value.includes("Stable")
  ) {
    return "badge-success";
  }

  if (value.includes("Monitor") || value.includes("Needs")) {
    return "badge-warning";
  }

  if (
    value.includes("Poor") ||
    value.includes("HR") ||
    value.includes("Improvement")
  ) {
    return "badge-danger";
  }

  return "badge-info";
}

function getRoleDisplayName(role) {
  const roleNames = {
    Admin: "System Admin",
    Manager: "Factory Manager",
    Production: "Production Supervisor",
    Quality: "Quality Control Specialist",
    HR: "HR Specialist",
    Viewer: "Department Viewer"
  };

  return roleNames[role] || role;
}

function getRoleDescription(role) {
  const descriptions = {
    Admin: "Full system administration and operational control.",
    Manager: "Factory-wide operational management and performance review.",
    Production: "Production output, product and machine tracking.",
    Quality: "Defect tracking, quality control and production review.",
    HR: "Employee records, workforce status and continuity monitoring.",
    Viewer: "Read-only access to limited operational summaries."
  };

  return descriptions[role] || "Authorized system user.";
}


function getRoleDisplayName(role) {
  const roleNames = {
    Admin: "System Admin",
    Manager: "Factory Manager",
    Production: "Production Supervisor",
    Quality: "Quality Control Specialist",
    HR: "HR Specialist",
    Viewer: "Department Viewer"
  };

  return roleNames[role] || role || "Authorized User";
}

function getRoleDescription(role) {
  const descriptions = {
    Admin: "Full system administration, configuration and operational control.",
    Manager: "Factory-wide operational management and performance review.",
    Production: "Production output, product usage and machine operation tracking.",
    Quality: "Defect tracking, quality control and production quality review.",
    HR: "Employee records, workforce status and continuity monitoring.",
    Viewer: "Read-only access to limited operational summaries."
  };

  return descriptions[role] || "Authorized factory portal user.";
}

function getAllowedViewsByRole(role) {
  const permissions = {
    Admin: ["dashboard", "employees", "departments", "products", "machines", "production", "reports"],
    Manager: ["dashboard", "employees", "departments", "products", "machines", "production", "reports"],
    Production: ["dashboard", "products", "machines", "production"],
    Quality: ["dashboard", "products", "production", "reports"],
    HR: ["dashboard", "employees", "departments", "reports"],
    Viewer: ["dashboard", "reports"]
  };

  return permissions[role] || ["dashboard"];
}

function canAccessView(view) {
  return getAllowedViewsByRole(state.user?.role).includes(view);
}

function renderNavigationMenu() {
  const navItems = [
    { view: "dashboard", label: "Dashboard" },
    { view: "employees", label: "Employees" },
    { view: "departments", label: "Departments" },
    { view: "products", label: "Products" },
    { view: "machines", label: "Machines" },
    { view: "production", label: "Production Records" },
    { view: "reports", label: "Reports" }
  ];

  return navItems
    .filter((item) => canAccessView(item.view))
    .map((item) => navButton(item.view, item.label))
    .join("");
}

function showMessage(element, text, type) {
  element.textContent = text;
  element.className = `message ${type}`;
  element.style.display = "block";
}

function renderLogin() {
  const isRegisterMode = state.authMode === "register";

  app.innerHTML = `
    <section class="login-page">
      <div class="login-brand">
        <div>
          <div class="brand-badge">
            <div class="brand-mark">TF</div>
            <span>Internal Factory Operations Portal</span>
          </div>

          <h1>TatLee Factory Workforce & Operations Management Portal</h1>
          <p>
            A secure internal platform for managing workforce records, production operations,
            machine usage, quality indicators and role-based performance reports.
          </p>

          <div class="login-highlights">
            <div class="highlight-card">
              <strong>Secure Access</strong>
              <span>JWT-based login and registration for authorized factory users</span>
            </div>
            <div class="highlight-card">
              <strong>Role-Based Control</strong>
              <span>Each role sees only the modules required for its responsibility</span>
            </div>
            <div class="highlight-card">
              <strong>Operational Reports</strong>
              <span>Automatic performance, quality, continuity and HR-oriented reports</span>
            </div>
          </div>
        </div>

        <p>System Analysis and Design Project · Spring 2026</p>
      </div>

      <div class="login-panel-wrap">
        <form class="login-panel auth-panel" id="${isRegisterMode ? "registerForm" : "loginForm"}">
          <div class="auth-tabs">
            <button type="button" class="auth-tab ${!isRegisterMode ? "active" : ""}" id="showLoginBtn">
              Login
            </button>
            <button type="button" class="auth-tab ${isRegisterMode ? "active" : ""}" id="showRegisterBtn">
              Register
            </button>
          </div>

          <h2>${isRegisterMode ? "Create authorized account" : "Secure access"}</h2>
          <p class="subtitle">
            ${
              isRegisterMode
                ? "Create a role-based factory account. New users receive a private isolated workspace."
                : "Sign in to access your role-based factory operations dashboard."
            }
          </p>

          <div id="authError" class="login-error"></div>

          ${
            isRegisterMode
              ? `
                <div class="form-group">
                  <label>Full Name</label>
                  <input class="form-control" id="registerFullName" type="text" placeholder="Example: Factory Operations User" />
                </div>
              `
              : ""
          }

          <div class="form-group">
            <label>Email</label>
            <input 
              class="form-control" 
              id="${isRegisterMode ? "registerEmail" : "email"}" 
              type="email" 
              value="${isRegisterMode ? "" : "admin@tatleefactory.com"}"
              placeholder="name@tatleefactory.com"
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input 
              class="form-control" 
              id="${isRegisterMode ? "registerPassword" : "password"}" 
              type="password" 
              value="${isRegisterMode ? "" : "TatLee123"}"
              placeholder="Minimum 6 characters"
            />
          </div>

          ${
            isRegisterMode
              ? `
                <div class="form-group">
                  <label>Factory Role</label>
                  <select class="form-control" id="registerRole">
                    <option value="Manager">Factory Manager</option>
                    <option value="Production">Production Supervisor</option>
                    <option value="Quality">Quality Control Specialist</option>
                    <option value="HR">HR Specialist</option>
                    <option value="Viewer">Department Viewer</option>
                  </select>
                </div>
              `
              : ""
          }

          <button class="primary-btn" type="submit">
            ${isRegisterMode ? "Create Account" : "Login to Dashboard"}
          </button>

          ${
            isRegisterMode
              ? `
                <div class="demo-box">
                  <strong>Private workspace policy</strong><br />
                  Each account can access only its own operational records.
                  Company data is protected by JWT authentication and user-based data isolation.
                </div>
              `
              : `
                <div class="demo-box">
                  <strong>Demo users</strong><br />
                  System Admin: admin@tatleefactory.com<br />
                  Factory Manager: manager@tatleefactory.com<br />
                  Production Supervisor: production@tatleefactory.com<br />
                  Quality Control Specialist: quality@tatleefactory.com<br />
                  HR Specialist: hr@tatleefactory.com<br />
                  Department Viewer: viewer@tatleefactory.com<br />
                  Password: TatLee123
                </div>
              `
          }
        </form>
      </div>
    </section>
  `;

  document.getElementById("showLoginBtn").addEventListener("click", () => {
    state.authMode = "login";
    renderLogin();
  });

  document.getElementById("showRegisterBtn").addEventListener("click", () => {
    state.authMode = "register";
    renderLogin();
  });

  if (isRegisterMode) {
    document.getElementById("registerForm").addEventListener("submit", handleRegister);
  } else {
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("authError");

  errorBox.style.display = "none";

  if (!email || !password) {
    errorBox.textContent = "Email and password are required.";
    errorBox.style.display = "block";
    return;
  }

  try {
    const result = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    setAuth(result.token, result.user);
    state.currentView = "dashboard";
    renderApp();
  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.style.display = "block";
  }
}

async function handleRegister(event) {
  event.preventDefault();

  const fullName = document.getElementById("registerFullName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const role = document.getElementById("registerRole").value;
  const errorBox = document.getElementById("authError");

  errorBox.style.display = "none";

  if (!fullName || fullName.length < 2) {
    errorBox.textContent = "Full name is required and must be at least 2 characters.";
    errorBox.style.display = "block";
    return;
  }

  if (!email || !email.includes("@")) {
    errorBox.textContent = "Valid email is required.";
    errorBox.style.display = "block";
    return;
  }

  if (!password || password.length < 6) {
    errorBox.textContent = "Password must be at least 6 characters.";
    errorBox.style.display = "block";
    return;
  }

  try {
    const result = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        fullName,
        email,
        password,
        role
      })
    });

    setAuth(result.token, result.user);
    state.currentView = "dashboard";
    state.authMode = "login";
    renderApp();
  } catch (error) {
    errorBox.textContent = error.message;
    errorBox.style.display = "block";
  }
}

function renderApp() {
  if (!state.token || !state.user) {
    renderLogin();
    return;
  }

  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar-logo">
          <div class="brand-mark">TF</div>
          <div>
            <strong>TatLee Factory</strong>
            <span>Productivity Intelligence Portal</span>
          </div>
        </div>

        <nav class="nav-menu">
          ${renderNavigationMenu()}
        </nav>

        <div class="sidebar-footer">
          <strong>${state.user.fullName}</strong>
          <span>${state.user.email}</span><br />
          <span>Role: ${getRoleDisplayName(state.user.role)}</span>
          <button class="logout-btn" id="logoutBtn">Logout</button>
        </div>
      </aside>

      <main class="main">
        <div id="view"></div>
      </main>
    </div>
  `;

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentView = button.dataset.view;
      renderCurrentView();
      updateActiveNav();
    });
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    clearAuth();
    renderLogin();
  });

  renderCurrentView();
  updateActiveNav();
}

function navButton(view, label) {
  return `
    <button class="nav-item ${state.currentView === view ? "active" : ""}" data-view="${view}">
      ${label}
    </button>
  `;
}

function updateActiveNav() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.currentView);
  });
}

function renderCurrentView() {
  if (!canAccessView(state.currentView)) {
    state.currentView = "dashboard";
  }

  if (state.currentView === "dashboard") renderDashboard();
  if (state.currentView === "employees") renderEmployees();
  if (state.currentView === "departments") renderDepartments();
  if (state.currentView === "products") renderProducts();
  if (state.currentView === "machines") renderMachines();
  if (state.currentView === "production") renderProductionRecords();
  if (state.currentView === "reports") renderReports();
}

function renderTopbar(title, subtitle) {
  return `
    <div class="topbar">
      <div>
        <h2>${title}</h2>
        <p>${subtitle}</p>
      </div>
      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
        <span class="role-pill">${getRoleDisplayName(state.user.role)}</span>
        <span class="role-pill" style="background:#f1f5f9; color:#334155; border-color:#e2e8f0;">
          TatLee Factory
        </span>
      </div>
    </div>
  `;
}

function metricCard(label, value) {
  return `
    <div class="metric-card">
      <span>${label}</span>
      <strong>${value ?? 0}</strong>
    </div>
  `;
}


function isExecutiveRole() {
  return ["Admin", "Manager"].includes(state.user.role);
}

function isProductionRole() {
  return state.user.role === "Production";
}

function isQualityRole() {
  return state.user.role === "Quality";
}

function isHrRole() {
  return state.user.role === "HR";
}

function isViewerRole() {
  return state.user.role === "Viewer";
}

function hasNoWorkspaceData(summary) {
  return (
    Number(summary.totalEmployees || 0) === 0 &&
    Number(summary.totalProductionRecords || 0) === 0 &&
    Number(summary.totalActualProduction || 0) === 0
  );
}

function renderWorkspaceEmptyState(role) {
  const roleName = getRoleDisplayName(role);

  const stepsByRole = {
    Admin: [
      "Review departments, employees, products and production machines.",
      "Create production records to generate automatic performance results.",
      "Use reports for bonus, promotion and HR review decisions."
    ],
    Manager: [
      "Review all operational modules across the factory.",
      "Track production performance and workforce productivity.",
      "Use reports to support management decisions."
    ],
    Production: [
      "Create or review products and production machines.",
      "Enter daily production records with target and actual output.",
      "Track machine status and production volume."
    ],
    Quality: [
      "Review production records from a quality perspective.",
      "Track defective quantity and quality score.",
      "Identify production records that require quality attention."
    ],
    HR: [
      "Create or review employees and departments.",
      "Track active/inactive employees and continuity indicators.",
      "Monitor absence, late days and HR review needs."
    ],
    Viewer: [
      "Review limited operational summaries.",
      "Use the dashboard in read-only mode.",
      "Contact an authorized manager for detailed access."
    ]
  };

  const steps = stepsByRole[role] || stepsByRole.Viewer;

  return `
    <div class="panel empty-state-panel">
      <div class="panel-header">
        <h3>${roleName} Workspace</h3>
      </div>
      <p class="empty-state-text">
        This private workspace does not have enough operational data yet.
        Reports and charts will become meaningful after authorized users enter data.
      </p>

      <div class="onboarding-steps">
        ${steps.map((step, index) => `
          <div class="onboarding-step">
            <strong>${index + 1}</strong>
            <span>${step}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderSimpleBarChart(title, items, valueKey, labelKey) {
  if (!items || !items.length) {
    return `<p class="loading">No chart data available.</p>`;
  }

  const maxValue = Math.max(...items.map((item) => Number(item[valueKey] || 0)), 1);

  return `
    <div class="mini-chart">
      <h4>${title}</h4>
      ${items.slice(0, 6).map((item) => {
        const value = Number(item[valueKey] || 0);
        const width = Math.max(6, Math.round((value / maxValue) * 100));

        return `
          <div class="bar-row">
            <span>${item[labelKey] || "N/A"}</span>
            <div class="bar-track">
              <div class="bar-fill" style="width:${width}%"></div>
            </div>
            <strong>${value}</strong>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderRoleInfoPanel(title, description, items) {
  return `
    <div class="panel role-info-panel">
      <div class="panel-header">
        <h3>${title}</h3>
      </div>
      <p class="empty-state-text">${description}</p>

      <div class="role-scope-list">
        ${items.map((item) => `
          <div class="role-scope-item">
            <span>✓</span>
            <p>${item}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}


function renderEmptyState(title, description, steps = []) {
  return `
    <div class="panel empty-state-panel">
      <div class="empty-state-icon">TF</div>
      <h3>${title}</h3>
      <p>${description}</p>
      ${
        steps.length
          ? `
            <div class="onboarding-steps">
              ${steps.map((step, index) => `
                <div class="onboarding-step">
                  <strong>${index + 1}</strong>
                  <span>${step}</span>
                </div>
              `).join("")}
            </div>
          `
          : ""
      }
    </div>
  `;
}

function renderRoleInsightCard(title, value, description) {
  return `
    <div class="insight-card">
      <span>${title}</span>
      <strong>${value}</strong>
      <p>${description}</p>
    </div>
  `;
}

function renderSimpleBarChart(items, valueKey, labelKey, title) {
  if (!items.length) {
    return renderEmptyState(
      `${title} is not available yet`,
      "There is not enough operational data to generate this chart."
    );
  }

  const maxValue = Math.max(...items.map((item) => Number(item[valueKey] || 0)), 1);

  return `
    <div class="chart-box">
      <h3>${title}</h3>
      <div class="bar-chart">
        ${items.map((item) => {
          const value = Number(item[valueKey] || 0);
          const width = Math.max((value / maxValue) * 100, 4);
          return `
            <div class="bar-row">
              <span>${item[labelKey] || "Unknown"}</span>
              <div class="bar-track">
                <div class="bar-fill" style="width:${width}%"></div>
              </div>
              <strong>${value}</strong>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function getDashboardSubtitleByRole() {
  const role = state.user?.role;

  if (role === "Production") {
    return "Production-focused overview of products, machines, output records and operational workload.";
  }

  if (role === "Quality") {
    return "Quality-focused overview of defect quantities, production quality and operational risk indicators.";
  }

  if (role === "HR") {
    return "HR-focused overview of workforce status, employee continuity and department distribution.";
  }

  if (role === "Viewer") {
    return "Limited read-only overview of operational activity and factory performance indicators.";
  }

  return "Executive overview of workforce productivity, operational performance and management decisions.";
}

/* DASHBOARD */

async function renderDashboard() {
  const view = document.getElementById("view");

  view.innerHTML = `
    ${renderTopbar(
      `${getRoleDisplayName(state.user.role)} Dashboard`,
      getDashboardSubtitleByRole()
    )}
    <div class="loading">Loading dashboard data...</div>
  `;

  try {
    const summaryResponse = await apiRequest("/reports/summary");
    const topPerformersResponse = canAccessView("reports")
      ? await apiRequest("/reports/top-performers")
      : { data: [] };
    const departmentResponse = canAccessView("reports")
      ? await apiRequest("/reports/department-performance")
      : { data: [] };

    const summary = summaryResponse.data;
    const topPerformers = topPerformersResponse.data;
    const departments = departmentResponse.data;

    if (summary.totalEmployees === 0 && summary.totalProductionRecords === 0) {
      view.innerHTML = `
        ${renderTopbar(
          `${getRoleDisplayName(state.user.role)} Dashboard`,
          getDashboardSubtitleByRole()
        )}

        ${renderEmptyState(
          "Your private workspace is ready",
          "This account has an isolated workspace. Start by adding the records that match your responsibility, or use the prepared demo accounts for a full presentation.",
          getRoleOnboardingSteps()
        )}
      `;
      return;
    }

    if (state.user.role === "Production") {
      view.innerHTML = renderProductionDashboard(summary, departments);
      return;
    }

    if (state.user.role === "Quality") {
      view.innerHTML = renderQualityDashboard(summary, topPerformers, departments);
      return;
    }

    if (state.user.role === "HR") {
      view.innerHTML = renderHrDashboard(summary, departments);
      return;
    }

    if (state.user.role === "Viewer") {
      view.innerHTML = renderViewerDashboard(summary, departments);
      return;
    }

    view.innerHTML = renderExecutiveDashboard(summary, topPerformers, departments);
  } catch (error) {
    view.innerHTML = `
      ${renderTopbar("Dashboard", "Unable to load dashboard data.")}
      <div class="message error" style="display:block;">${error.message}</div>
    `;
  }
}

function getRoleOnboardingSteps() {
  const role = state.user?.role;

  if (role === "Production") {
    return [
      "Review available products and machines.",
      "Create production records with target and actual quantities.",
      "Track machine usage and production output."
    ];
  }

  if (role === "Quality") {
    return [
      "Review production records assigned for quality control.",
      "Monitor defective quantity and quality score.",
      "Identify high-risk product or production records."
    ];
  }

  if (role === "HR") {
    return [
      "Create employee and department records.",
      "Track active and inactive employees.",
      "Monitor absence, late days and continuity risk."
    ];
  }

  if (role === "Viewer") {
    return [
      "Review read-only dashboard summaries.",
      "Use reports for limited operational visibility."
    ];
  }

  return [
    "Create departments and employees.",
    "Add products and production machines.",
    "Enter production records to generate automatic reports."
  ];
}

function renderExecutiveDashboard(summary, topPerformers, departments) {
  return `
    ${renderTopbar(
      `${getRoleDisplayName(state.user.role)} Dashboard`,
      getDashboardSubtitleByRole()
    )}

    <section class="card-grid">
      ${metricCard("Total Employees", summary.totalEmployees)}
      ${metricCard("Active Employees", summary.activeEmployees)}
      ${metricCard("Production Records", summary.totalProductionRecords)}
      ${metricCard("Actual Production", summary.totalActualProduction)}
      ${metricCard("Avg. Performance", summary.averagePerformanceScore)}
      ${metricCard("Avg. Quality", summary.averageQualityScore)}
      ${metricCard("Avg. Continuity", summary.averageContinuityScore)}
      ${metricCard("Bonus Eligible", summary.bonusEligibleCount)}
    </section>

    <section class="insight-grid">
      ${renderRoleInsightCard("Management Scope", "Full", "This role can review operational, HR and performance indicators.")}
      ${renderRoleInsightCard("Promotion Candidates", summary.promotionCandidateCount, "Automatically calculated from performance, quality and continuity scores.")}
      ${renderRoleInsightCard("HR Review Required", summary.hrReviewRequiredCount, "Employees with critical performance or continuity indicators.")}
    </section>

    <section class="content-grid">
      <div class="panel">
        <div class="panel-header">
          <h3>Top Performers</h3>
        </div>
        ${renderTopPerformersTable(topPerformers)}
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>Department Performance</h3>
        </div>
        ${renderDepartmentTable(departments)}
      </div>
    </section>

    ${renderSimpleBarChart(departments, "averagePerformanceScore", "departmentName", "Department Performance Chart")}
  `;
}

function renderProductionDashboard(summary, departments) {
  return `
    ${renderTopbar(
      "Production Supervisor Dashboard",
      getDashboardSubtitleByRole()
    )}

    <section class="card-grid">
      ${metricCard("Production Records", summary.totalProductionRecords)}
      ${metricCard("Actual Production", summary.totalActualProduction)}
      ${metricCard("Defective Quantity", summary.totalDefectiveQuantity)}
      ${metricCard("Avg. On-Time Score", summary.averageOnTimeCompletionScore)}
    </section>

    <section class="insight-grid">
      ${renderRoleInsightCard("Visible Modules", "Production", "Products, machines and production records are available for this role.")}
      ${renderRoleInsightCard("Restricted Data", "Protected", "Employee bonus, promotion and HR review decisions are hidden.")}
      ${renderRoleInsightCard("Operational Focus", "Output", "This dashboard focuses on target, actual production and machine usage.")}
    </section>

    ${renderSimpleBarChart(departments, "totalActualProduction", "departmentName", "Production Output by Department")}
  `;
}

function renderQualityDashboard(summary, topPerformers, departments) {
  return `
    ${renderTopbar(
      "Quality Control Specialist Dashboard",
      getDashboardSubtitleByRole()
    )}

    <section class="card-grid">
      ${metricCard("Production Records", summary.totalProductionRecords)}
      ${metricCard("Total Defects", summary.totalDefectiveQuantity)}
      ${metricCard("Avg. Quality", summary.averageQualityScore)}
      ${metricCard("Avg. Performance", summary.averagePerformanceScore)}
    </section>

    <section class="insight-grid">
      ${renderRoleInsightCard("Quality Scope", "Defects", "This role focuses on defective quantity and product quality indicators.")}
      ${renderRoleInsightCard("Decision Privacy", "Protected", "Bonus and promotion decisions are not part of quality operations.")}
      ${renderRoleInsightCard("Risk Review", summary.totalDefectiveQuantity, "Total detected defective quantity in this workspace.")}
    </section>

    <section class="content-grid">
      <div class="panel">
        <div class="panel-header">
          <h3>Quality-Oriented Records</h3>
        </div>
        ${renderTopPerformersTable(topPerformers)}
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>Department Quality Overview</h3>
        </div>
        ${renderDepartmentTable(departments)}
      </div>
    </section>
  `;
}

function renderHrDashboard(summary, departments) {
  return `
    ${renderTopbar(
      "HR Specialist Dashboard",
      getDashboardSubtitleByRole()
    )}

    <section class="card-grid">
      ${metricCard("Total Employees", summary.totalEmployees)}
      ${metricCard("Active Employees", summary.activeEmployees)}
      ${metricCard("Inactive Employees", summary.inactiveEmployees)}
      ${metricCard("Avg. Continuity", summary.averageContinuityScore)}
      ${metricCard("HR Review Required", summary.hrReviewRequiredCount)}
    </section>

    <section class="insight-grid">
      ${renderRoleInsightCard("HR Scope", "Workforce", "This role focuses on employees, departments and continuity risk.")}
      ${renderRoleInsightCard("Production Details", "Limited", "Product and machine management are not shown to HR users.")}
      ${renderRoleInsightCard("Continuity Monitoring", summary.averageContinuityScore, "Average continuity score based on absence and late days.")}
    </section>

    ${renderSimpleBarChart(departments, "recordCount", "departmentName", "Workforce Activity by Department")}
  `;
}

function renderViewerDashboard(summary, departments) {
  return `
    ${renderTopbar(
      "Department Viewer Dashboard",
      getDashboardSubtitleByRole()
    )}

    <section class="card-grid">
      ${metricCard("Total Employees", summary.totalEmployees)}
      ${metricCard("Production Records", summary.totalProductionRecords)}
      ${metricCard("Actual Production", summary.totalActualProduction)}
      ${metricCard("Avg. Performance", summary.averagePerformanceScore)}
    </section>

    <section class="insight-grid">
      ${renderRoleInsightCard("Access Type", "Read Only", "This role can review limited summaries but cannot modify records.")}
      ${renderRoleInsightCard("Sensitive Decisions", "Hidden", "Bonus, promotion and HR decisions are restricted.")}
      ${renderRoleInsightCard("Workspace", "Private", "Displayed data belongs only to this authenticated user's workspace.")}
    </section>

    ${renderSimpleBarChart(departments, "averagePerformanceScore", "departmentName", "Limited Department Overview")}
  `;
}

function renderTopPerformersTable(records) {
  if (!records.length) {
    return `<p class="loading">No top performer data available.</p>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Score</th>
            <th>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          ${records.map((record) => `
            <tr>
              <td>${record.fullName}</td>
              <td>${record.departmentName}</td>
              <td><strong>${record.overallPerformanceScore}</strong></td>
              <td><span class="badge ${getBadgeClass(record.recommendation)}">${record.recommendation}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderDepartmentTable(departments) {
  if (!departments.length) {
    return `<p class="loading">No department data available.</p>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Department</th>
            <th>Records</th>
            <th>Avg. Score</th>
            <th>Quality</th>
          </tr>
        </thead>
        <tbody>
          ${departments.map((department) => `
            <tr>
              <td>${department.departmentName}</td>
              <td>${department.recordCount}</td>
              <td><strong>${department.averagePerformanceScore}</strong></td>
              <td>${department.averageQualityScore}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

/* EMPLOYEES */

function canManageEmployees() {
  return ["Admin", "Manager"].includes(state.user.role);
}

function canDeleteEmployees() {
  return state.user.role === "Admin";
}

async function renderEmployees() {
  const view = document.getElementById("view");

  view.innerHTML = `
    ${renderTopbar(
      "Employees",
      "Manage TatLee Factory employees, department assignments and employment status."
    )}

    <div id="employeeMessage" class="message"></div>

    ${
      canManageEmployees()
        ? renderEmployeeForm()
        : `<div class="panel"><p class="loading">You have view-only access for employee records.</p></div>`
    }

    <div class="panel">
      <div class="panel-header">
        <h3>Employee Directory</h3>
      </div>

      <div class="toolbar">
        <input class="form-control" id="employeeSearch" placeholder="Search by name, code, email or position..." />
        <select class="form-control" id="employeeDepartmentFilter">
          <option value="">All departments</option>
        </select>
        <select class="form-control" id="employeeStatusFilter">
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button class="secondary-btn" id="refreshEmployeesBtn">Refresh</button>
      </div>

      <div id="employeesTable" class="loading">Loading employees...</div>
    </div>
  `;

  await loadDepartmentOptions();
  await loadEmployees();

  document.getElementById("employeeSearch").addEventListener("input", () => loadEmployees());
  document.getElementById("employeeDepartmentFilter").addEventListener("change", () => loadEmployees());
  document.getElementById("employeeStatusFilter").addEventListener("change", () => loadEmployees());
  document.getElementById("refreshEmployeesBtn").addEventListener("click", () => loadEmployees());

  const form = document.getElementById("employeeForm");
  if (form) {
    form.addEventListener("submit", handleEmployeeSubmit);
    document.getElementById("employeeCancelBtn").addEventListener("click", resetEmployeeForm);
  }
}

function renderEmployeeForm() {
  return `
    <div class="panel">
      <div class="panel-header">
        <h3 id="employeeFormTitle">Add Employee</h3>
      </div>

      <form id="employeeForm">
        <input type="hidden" id="employeeId" />

        <div class="form-grid">
          <div class="form-group">
            <label>Full Name</label>
            <input class="form-control" id="employeeFullName" placeholder="Example: Ali Vural" />
          </div>

          <div class="form-group">
            <label>Employee Code</label>
            <input class="form-control" id="employeeCode" placeholder="Example: EMP-100" />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input class="form-control" id="employeeEmail" placeholder="Example: ali.vural@tatleefactory.com" />
          </div>

          <div class="form-group">
            <label>Position</label>
            <input class="form-control" id="employeePosition" placeholder="Example: Production Operator" />
          </div>

          <div class="form-group">
            <label>Department</label>
            <select class="form-control" id="employeeDepartmentId"></select>
          </div>

          <div class="form-group">
            <label>Hire Date</label>
            <input class="form-control" id="employeeHireDate" type="date" />
          </div>

          <div class="form-group">
            <label>Status</label>
            <select class="form-control" id="employeeStatus">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div class="actions">
          <button class="primary-btn" style="width:auto;" type="submit">Save Employee</button>
          <button class="secondary-btn" type="button" id="employeeCancelBtn">Clear</button>
        </div>
      </form>
    </div>
  `;
}

async function loadDepartmentOptions() {
  const response = await apiRequest("/departments");
  const departments = response.data;

  const filterSelect = document.getElementById("employeeDepartmentFilter");
  const formSelect = document.getElementById("employeeDepartmentId");

  if (filterSelect) {
    filterSelect.innerHTML =
      `<option value="">All departments</option>` +
      departments.map((department) => `
        <option value="${department.id}">${department.departmentName}</option>
      `).join("");
  }

  if (formSelect) {
    formSelect.innerHTML = departments.map((department) => `
      <option value="${department.id}">${department.departmentName}</option>
    `).join("");
  }
}

async function loadEmployees() {
  const table = document.getElementById("employeesTable");
  const searchValue = document.getElementById("employeeSearch")?.value.trim() || "";
  const departmentValue = document.getElementById("employeeDepartmentFilter")?.value || "";
  const statusValue = document.getElementById("employeeStatusFilter")?.value || "";

  table.innerHTML = `<div class="loading">Loading employees...</div>`;

  try {
    let employees;

    if (searchValue) {
      const response = await apiRequest(`/employees/search?query=${encodeURIComponent(searchValue)}`);
      employees = response.data;
    } else if (departmentValue) {
      const response = await apiRequest(`/employees/department/${departmentValue}`);
      employees = response.data;
    } else {
      const response = await apiRequest("/employees");
      employees = response.data;
    }

    if (statusValue) {
      employees = employees.filter((employee) => employee.status === statusValue);
    }

    table.innerHTML = renderEmployeesTable(employees);
    bindEmployeeActions(employees);
  } catch (error) {
    table.innerHTML = `<div class="message error" style="display:block;">${error.message}</div>`;
  }
}

function renderEmployeesTable(employees) {
  if (!employees.length) {
    return `<p class="loading">No employees found.</p>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Full Name</th>
            <th>Department</th>
            <th>Position</th>
            <th>Email</th>
            <th>Status</th>
            <th>Hire Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${employees.map((employee) => `
            <tr>
              <td><strong>${employee.employeeCode}</strong></td>
              <td>${employee.fullName}</td>
              <td>${employee.departmentName || "-"}</td>
              <td>${employee.position}</td>
              <td>${employee.email}</td>
              <td>
                <span class="badge ${employee.status === "Active" ? "badge-success" : "badge-warning"}">
                  ${employee.status}
                </span>
              </td>
              <td>${employee.hireDate}</td>
              <td>
                <div class="actions">
                  ${canManageEmployees() ? `<button class="edit-btn" data-edit-employee="${employee.id}">Edit</button>` : ""}
                  ${canDeleteEmployees() ? `<button class="danger-btn" data-delete-employee="${employee.id}">Delete</button>` : ""}
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function bindEmployeeActions(employees) {
  document.querySelectorAll("[data-edit-employee]").forEach((button) => {
    button.addEventListener("click", () => {
      const employee = employees.find((item) => Number(item.id) === Number(button.dataset.editEmployee));
      fillEmployeeForm(employee);
    });
  });

  document.querySelectorAll("[data-delete-employee]").forEach((button) => {
    button.addEventListener("click", () => deleteEmployee(button.dataset.deleteEmployee));
  });
}

function fillEmployeeForm(employee) {
  document.getElementById("employeeFormTitle").textContent = "Edit Employee";
  document.getElementById("employeeId").value = employee.id;
  document.getElementById("employeeFullName").value = employee.fullName;
  document.getElementById("employeeCode").value = employee.employeeCode;
  document.getElementById("employeeEmail").value = employee.email;
  document.getElementById("employeePosition").value = employee.position;
  document.getElementById("employeeDepartmentId").value = employee.departmentId;
  document.getElementById("employeeHireDate").value = employee.hireDate;
  document.getElementById("employeeStatus").value = employee.status;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetEmployeeForm() {
  const form = document.getElementById("employeeForm");
  if (!form) return;

  form.reset();
  document.getElementById("employeeId").value = "";
  document.getElementById("employeeFormTitle").textContent = "Add Employee";
  document.getElementById("employeeStatus").value = "Active";
}

function getEmployeeFormData() {
  return {
    fullName: document.getElementById("employeeFullName").value.trim(),
    employeeCode: document.getElementById("employeeCode").value.trim(),
    email: document.getElementById("employeeEmail").value.trim(),
    position: document.getElementById("employeePosition").value.trim(),
    departmentId: Number(document.getElementById("employeeDepartmentId").value),
    hireDate: document.getElementById("employeeHireDate").value,
    status: document.getElementById("employeeStatus").value
  };
}

function validateEmployeeForm(data) {
  if (!data.fullName) return "Full name is required.";
  if (!data.employeeCode) return "Employee code is required.";
  if (!data.email || !data.email.includes("@")) return "Valid email is required.";
  if (!data.position) return "Position is required.";
  if (!data.departmentId) return "Department is required.";
  if (!data.hireDate) return "Hire date is required.";
  return null;
}

async function handleEmployeeSubmit(event) {
  event.preventDefault();

  const message = document.getElementById("employeeMessage");
  const employeeId = document.getElementById("employeeId").value;
  const formData = getEmployeeFormData();
  const validationError = validateEmployeeForm(formData);

  message.style.display = "none";

  if (validationError) {
    showMessage(message, validationError, "error");
    return;
  }

  try {
    if (employeeId) {
      await apiRequest(`/employees/${employeeId}`, {
        method: "PUT",
        body: JSON.stringify(formData)
      });

      showMessage(message, "Employee updated successfully.", "success");
    } else {
      await apiRequest("/employees", {
        method: "POST",
        body: JSON.stringify(formData)
      });

      showMessage(message, "Employee created successfully.", "success");
    }

    resetEmployeeForm();
    await loadEmployees();
  } catch (error) {
    showMessage(message, error.message, "error");
  }
}

async function deleteEmployee(id) {
  const confirmed = confirm("Are you sure you want to delete this employee?");
  if (!confirmed) return;

  const message = document.getElementById("employeeMessage");

  try {
    await apiRequest(`/employees/${id}`, {
      method: "DELETE"
    });

    showMessage(message, "Employee deleted successfully.", "success");
    await loadEmployees();
  } catch (error) {
    showMessage(message, error.message, "error");
  }
}

/* DEPARTMENTS */

function canManageDepartments() {
  return ["Admin", "Manager"].includes(state.user.role);
}

function canDeleteDepartments() {
  return state.user.role === "Admin";
}

async function renderDepartments() {
  const view = document.getElementById("view");

  view.innerHTML = `
    ${renderTopbar(
      "Departments",
      "Manage TatLee Factory departments, managers and organizational structure."
    )}

    <div id="departmentMessage" class="message"></div>

    ${
      canManageDepartments()
        ? renderDepartmentForm()
        : `<div class="panel"><p class="loading">You have view-only access for department records.</p></div>`
    }

    <div class="panel">
      <div class="panel-header">
        <h3>Department Directory</h3>
      </div>

      <div class="toolbar">
        <input class="form-control" id="departmentSearch" placeholder="Search by department or manager..." />
        <button class="secondary-btn" id="refreshDepartmentsBtn">Refresh</button>
      </div>

      <div id="departmentsTable" class="loading">Loading departments...</div>
    </div>
  `;

  await loadDepartments();

  document.getElementById("departmentSearch").addEventListener("input", () => loadDepartments());
  document.getElementById("refreshDepartmentsBtn").addEventListener("click", () => loadDepartments());

  const form = document.getElementById("departmentForm");
  if (form) {
    form.addEventListener("submit", handleDepartmentSubmit);
    document.getElementById("departmentCancelBtn").addEventListener("click", resetDepartmentForm);
  }
}

function renderDepartmentForm() {
  return `
    <div class="panel">
      <div class="panel-header">
        <h3 id="departmentFormTitle">Add Department</h3>
      </div>

      <form id="departmentForm">
        <input type="hidden" id="departmentId" />

        <div class="form-grid">
          <div class="form-group">
            <label>Department Name</label>
            <input class="form-control" id="departmentName" placeholder="Example: Maintenance" />
          </div>

          <div class="form-group">
            <label>Manager Name</label>
            <input class="form-control" id="departmentManagerName" placeholder="Example: Kemal Arı" />
          </div>

          <div class="form-group full">
            <label>Description</label>
            <textarea class="form-control" id="departmentDescription" rows="3" placeholder="Describe the department responsibilities..."></textarea>
          </div>
        </div>

        <div class="actions">
          <button class="primary-btn" style="width:auto;" type="submit">Save Department</button>
          <button class="secondary-btn" type="button" id="departmentCancelBtn">Clear</button>
        </div>
      </form>
    </div>
  `;
}

async function loadDepartments() {
  const table = document.getElementById("departmentsTable");
  const searchValue = document.getElementById("departmentSearch")?.value.trim().toLowerCase() || "";

  table.innerHTML = `<div class="loading">Loading departments...</div>`;

  try {
    const response = await apiRequest("/departments");
    let departments = response.data;

    if (searchValue) {
      departments = departments.filter((department) => {
        return (
          department.departmentName.toLowerCase().includes(searchValue) ||
          department.managerName.toLowerCase().includes(searchValue) ||
          (department.description || "").toLowerCase().includes(searchValue)
        );
      });
    }

    table.innerHTML = renderDepartmentsTable(departments);
    bindDepartmentActions(departments);
  } catch (error) {
    table.innerHTML = `<div class="message error" style="display:block;">${error.message}</div>`;
  }
}

function renderDepartmentsTable(departments) {
  if (!departments.length) {
    return `<p class="loading">No departments found.</p>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Department</th>
            <th>Manager</th>
            <th>Description</th>
            <th>Employees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${departments.map((department) => `
            <tr>
              <td><strong>${department.departmentName}</strong></td>
              <td>${department.managerName}</td>
              <td>${department.description || "-"}</td>
              <td><span class="badge badge-info">${department.employeeCount || 0} Employees</span></td>
              <td>
                <div class="actions">
                  ${canManageDepartments() ? `<button class="edit-btn" data-edit-department="${department.id}">Edit</button>` : ""}
                  ${canDeleteDepartments() ? `<button class="danger-btn" data-delete-department="${department.id}">Delete</button>` : ""}
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function bindDepartmentActions(departments) {
  document.querySelectorAll("[data-edit-department]").forEach((button) => {
    button.addEventListener("click", () => {
      const department = departments.find((item) => Number(item.id) === Number(button.dataset.editDepartment));
      fillDepartmentForm(department);
    });
  });

  document.querySelectorAll("[data-delete-department]").forEach((button) => {
    button.addEventListener("click", () => deleteDepartment(button.dataset.deleteDepartment));
  });
}

function fillDepartmentForm(department) {
  document.getElementById("departmentFormTitle").textContent = "Edit Department";
  document.getElementById("departmentId").value = department.id;
  document.getElementById("departmentName").value = department.departmentName;
  document.getElementById("departmentManagerName").value = department.managerName;
  document.getElementById("departmentDescription").value = department.description || "";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetDepartmentForm() {
  const form = document.getElementById("departmentForm");
  if (!form) return;

  form.reset();
  document.getElementById("departmentId").value = "";
  document.getElementById("departmentFormTitle").textContent = "Add Department";
}

function getDepartmentFormData() {
  return {
    departmentName: document.getElementById("departmentName").value.trim(),
    managerName: document.getElementById("departmentManagerName").value.trim(),
    description: document.getElementById("departmentDescription").value.trim()
  };
}

function validateDepartmentForm(data) {
  if (!data.departmentName) return "Department name is required.";
  if (data.departmentName.length < 2) return "Department name must be at least 2 characters.";
  if (!data.managerName) return "Manager name is required.";
  return null;
}

async function handleDepartmentSubmit(event) {
  event.preventDefault();

  const message = document.getElementById("departmentMessage");
  const departmentId = document.getElementById("departmentId").value;
  const formData = getDepartmentFormData();
  const validationError = validateDepartmentForm(formData);

  message.style.display = "none";

  if (validationError) {
    showMessage(message, validationError, "error");
    return;
  }

  try {
    if (departmentId) {
      await apiRequest(`/departments/${departmentId}`, {
        method: "PUT",
        body: JSON.stringify(formData)
      });

      showMessage(message, "Department updated successfully.", "success");
    } else {
      await apiRequest("/departments", {
        method: "POST",
        body: JSON.stringify(formData)
      });

      showMessage(message, "Department created successfully.", "success");
    }

    resetDepartmentForm();
    await loadDepartments();
  } catch (error) {
    showMessage(message, error.message, "error");
  }
}

async function deleteDepartment(id) {
  const confirmed = confirm(
    "Are you sure you want to delete this department? Departments with assigned employees cannot be deleted."
  );

  if (!confirmed) return;

  const message = document.getElementById("departmentMessage");

  try {
    await apiRequest(`/departments/${id}`, {
      method: "DELETE"
    });

    showMessage(message, "Department deleted successfully.", "success");
    await loadDepartments();
  } catch (error) {
    showMessage(message, error.message, "error");
  }
}

/* PRODUCTS */

function canManageProducts() {
  return ["Admin", "Manager", "Production"].includes(state.user.role);
}

function canDeleteProducts() {
  return state.user.role === "Admin";
}

async function renderProducts() {
  const view = document.getElementById("view");

  view.innerHTML = `
    ${renderTopbar(
      "Products",
      "Manage TatLee Factory product catalog, standard units and target production levels."
    )}

    <div id="productMessage" class="message"></div>

    ${
      canManageProducts()
        ? renderProductForm()
        : `<div class="panel"><p class="loading">You have view-only access for product records.</p></div>`
    }

    <div class="panel">
      <div class="panel-header">
        <h3>Product Catalog</h3>
      </div>

      <div class="toolbar">
        <input class="form-control" id="productSearch" placeholder="Search by product code, name or category..." />
        <select class="form-control" id="productStatusFilter">
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button class="secondary-btn" id="refreshProductsBtn">Refresh</button>
      </div>

      <div id="productsTable" class="loading">Loading products...</div>
    </div>
  `;

  await loadProducts();

  document.getElementById("productSearch").addEventListener("input", () => loadProducts());
  document.getElementById("productStatusFilter").addEventListener("change", () => loadProducts());
  document.getElementById("refreshProductsBtn").addEventListener("click", () => loadProducts());

  const form = document.getElementById("productForm");
  if (form) {
    form.addEventListener("submit", handleProductSubmit);
    document.getElementById("productCancelBtn").addEventListener("click", resetProductForm);
  }
}

function renderProductForm() {
  return `
    <div class="panel">
      <div class="panel-header">
        <h3 id="productFormTitle">Add Product</h3>
      </div>

      <form id="productForm">
        <input type="hidden" id="productId" />

        <div class="form-grid">
          <div class="form-group">
            <label>Product Code</label>
            <input class="form-control" id="productCode" placeholder="Example: PRD-100" />
          </div>

          <div class="form-group">
            <label>Product Name</label>
            <input class="form-control" id="productName" placeholder="Example: Chocolate Wafer Box" />
          </div>

          <div class="form-group">
            <label>Category</label>
            <input class="form-control" id="productCategory" placeholder="Example: Food Packaging" />
          </div>

          <div class="form-group">
            <label>Standard Unit</label>
            <input class="form-control" id="productStandardUnit" placeholder="Example: box, pack, bottle" />
          </div>

          <div class="form-group">
            <label>Target Per Shift</label>
            <input class="form-control" id="productTargetPerShift" type="number" min="1" placeholder="Example: 500" />
          </div>

          <div class="form-group">
            <label>Status</label>
            <select class="form-control" id="productStatus">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div class="actions">
          <button class="primary-btn" style="width:auto;" type="submit">Save Product</button>
          <button class="secondary-btn" type="button" id="productCancelBtn">Clear</button>
        </div>
      </form>
    </div>
  `;
}

async function loadProducts() {
  const table = document.getElementById("productsTable");
  const searchValue = document.getElementById("productSearch")?.value.trim().toLowerCase() || "";
  const statusValue = document.getElementById("productStatusFilter")?.value || "";

  table.innerHTML = `<div class="loading">Loading products...</div>`;

  try {
    const response = await apiRequest("/products");
    let products = response.data;

    if (searchValue) {
      products = products.filter((product) => {
        return (
          product.productCode.toLowerCase().includes(searchValue) ||
          product.productName.toLowerCase().includes(searchValue) ||
          product.category.toLowerCase().includes(searchValue) ||
          product.standardUnit.toLowerCase().includes(searchValue)
        );
      });
    }

    if (statusValue) {
      products = products.filter((product) => product.status === statusValue);
    }

    table.innerHTML = renderProductsTable(products);
    bindProductActions(products);
  } catch (error) {
    table.innerHTML = `<div class="message error" style="display:block;">${error.message}</div>`;
  }
}

function renderProductsTable(products) {
  if (!products.length) {
    return `<p class="loading">No products found.</p>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Unit</th>
            <th>Target / Shift</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${products.map((product) => `
            <tr>
              <td><strong>${product.productCode}</strong></td>
              <td>${product.productName}</td>
              <td>${product.category}</td>
              <td>${product.standardUnit}</td>
              <td><strong>${product.targetPerShift}</strong></td>
              <td>
                <span class="badge ${product.status === "Active" ? "badge-success" : "badge-warning"}">
                  ${product.status}
                </span>
              </td>
              <td>
                <div class="actions">
                  ${canManageProducts() ? `<button class="edit-btn" data-edit-product="${product.id}">Edit</button>` : ""}
                  ${canDeleteProducts() ? `<button class="danger-btn" data-delete-product="${product.id}">Delete</button>` : ""}
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function bindProductActions(products) {
  document.querySelectorAll("[data-edit-product]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = products.find((item) => Number(item.id) === Number(button.dataset.editProduct));
      fillProductForm(product);
    });
  });

  document.querySelectorAll("[data-delete-product]").forEach((button) => {
    button.addEventListener("click", () => deleteProduct(button.dataset.deleteProduct));
  });
}

function fillProductForm(product) {
  document.getElementById("productFormTitle").textContent = "Edit Product";
  document.getElementById("productId").value = product.id;
  document.getElementById("productCode").value = product.productCode;
  document.getElementById("productName").value = product.productName;
  document.getElementById("productCategory").value = product.category;
  document.getElementById("productStandardUnit").value = product.standardUnit;
  document.getElementById("productTargetPerShift").value = product.targetPerShift;
  document.getElementById("productStatus").value = product.status;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetProductForm() {
  const form = document.getElementById("productForm");
  if (!form) return;

  form.reset();
  document.getElementById("productId").value = "";
  document.getElementById("productFormTitle").textContent = "Add Product";
  document.getElementById("productStatus").value = "Active";
}

function getProductFormData() {
  return {
    productCode: document.getElementById("productCode").value.trim(),
    productName: document.getElementById("productName").value.trim(),
    category: document.getElementById("productCategory").value.trim(),
    standardUnit: document.getElementById("productStandardUnit").value.trim(),
    targetPerShift: Number(document.getElementById("productTargetPerShift").value),
    status: document.getElementById("productStatus").value
  };
}

function validateProductForm(data) {
  if (!data.productCode) return "Product code is required.";
  if (!data.productName) return "Product name is required.";
  if (!data.category) return "Category is required.";
  if (!data.standardUnit) return "Standard unit is required.";
  if (data.targetPerShift <= 0) return "Target per shift must be greater than zero.";
  return null;
}

async function handleProductSubmit(event) {
  event.preventDefault();

  const message = document.getElementById("productMessage");
  const productId = document.getElementById("productId").value;
  const formData = getProductFormData();
  const validationError = validateProductForm(formData);

  message.style.display = "none";

  if (validationError) {
    showMessage(message, validationError, "error");
    return;
  }

  try {
    if (productId) {
      await apiRequest(`/products/${productId}`, {
        method: "PUT",
        body: JSON.stringify(formData)
      });

      showMessage(message, "Product updated successfully.", "success");
    } else {
      await apiRequest("/products", {
        method: "POST",
        body: JSON.stringify(formData)
      });

      showMessage(message, "Product created successfully.", "success");
    }

    resetProductForm();
    await loadProducts();
  } catch (error) {
    showMessage(message, error.message, "error");
  }
}

async function deleteProduct(id) {
  const confirmed = confirm(
    "Are you sure you want to delete this product? Products used in production records may affect operational history."
  );

  if (!confirmed) return;

  const message = document.getElementById("productMessage");

  try {
    await apiRequest(`/products/${id}`, {
      method: "DELETE"
    });

    showMessage(message, "Product deleted successfully.", "success");
    await loadProducts();
  } catch (error) {
    showMessage(message, error.message, "error");
  }
}

/* MACHINES */

function canManageMachines() {
  return ["Admin", "Manager", "Production"].includes(state.user.role);
}

function canDeleteMachines() {
  return state.user.role === "Admin";
}

async function renderMachines() {
  const view = document.getElementById("view");

  view.innerHTML = `
    ${renderTopbar(
      "Machines",
      "Manage production machines, department assignments, status and shift capacity."
    )}

    <div id="machineMessage" class="message"></div>

    ${
      canManageMachines()
        ? renderMachineForm()
        : `<div class="panel"><p class="loading">You have view-only access for production machines.</p></div>`
    }

    <div class="panel">
      <div class="panel-header">
        <h3>Production Machine Directory</h3>
      </div>

      <div class="toolbar">
        <input class="form-control" id="machineSearch" placeholder="Search by code, name, department or status..." />
        <select class="form-control" id="machineDepartmentFilter">
          <option value="">All departments</option>
        </select>
        <select class="form-control" id="machineStatusFilter">
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button class="secondary-btn" id="refreshMachinesBtn">Refresh</button>
      </div>

      <div id="machinesTable" class="loading">Loading machines...</div>
    </div>
  `;

  await loadMachineDepartmentOptions();
  await loadMachines();

  document.getElementById("machineSearch").addEventListener("input", () => loadMachines());
  document.getElementById("machineDepartmentFilter").addEventListener("change", () => loadMachines());
  document.getElementById("machineStatusFilter").addEventListener("change", () => loadMachines());
  document.getElementById("refreshMachinesBtn").addEventListener("click", () => loadMachines());

  const form = document.getElementById("machineForm");
  if (form) {
    form.addEventListener("submit", handleMachineSubmit);
    document.getElementById("machineCancelBtn").addEventListener("click", resetMachineForm);
  }
}

function renderMachineForm() {
  return `
    <div class="panel">
      <div class="panel-header">
        <h3 id="machineFormTitle">Add Production Machine</h3>
      </div>

      <form id="machineForm">
        <input type="hidden" id="machineId" />

        <div class="form-grid">
          <div class="form-group">
            <label>Machine Code</label>
            <input class="form-control" id="machineCode" placeholder="Example: MCH-100" />
          </div>

          <div class="form-group">
            <label>Machine Name</label>
            <input class="form-control" id="machineName" placeholder="Example: Filling Line C" />
          </div>

          <div class="form-group">
            <label>Department</label>
            <select class="form-control" id="machineDepartmentId"></select>
          </div>

          <div class="form-group">
            <label>Status</label>
            <select class="form-control" id="machineStatus">
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div class="form-group">
            <label>Capacity Per Shift</label>
            <input class="form-control" id="machineCapacityPerShift" type="number" min="1" placeholder="Example: 800" />
          </div>

          <div class="form-group full">
            <label>Description</label>
            <textarea class="form-control" id="machineDescription" rows="3" placeholder="Describe machine function..."></textarea>
          </div>
        </div>

        <div class="actions">
          <button class="primary-btn" style="width:auto;" type="submit">Save Machine</button>
          <button class="secondary-btn" type="button" id="machineCancelBtn">Clear</button>
        </div>
      </form>
    </div>
  `;
}

async function loadMachineDepartmentOptions() {
  const response = await apiRequest("/departments");
  const departments = response.data;

  const filterSelect = document.getElementById("machineDepartmentFilter");
  const formSelect = document.getElementById("machineDepartmentId");

  if (filterSelect) {
    filterSelect.innerHTML =
      `<option value="">All departments</option>` +
      departments.map((department) => `
        <option value="${department.id}">${department.departmentName}</option>
      `).join("");
  }

  if (formSelect) {
    formSelect.innerHTML = departments.map((department) => `
      <option value="${department.id}">${department.departmentName}</option>
    `).join("");
  }
}

async function loadMachines() {
  const table = document.getElementById("machinesTable");
  const searchValue = document.getElementById("machineSearch")?.value.trim().toLowerCase() || "";
  const departmentValue = document.getElementById("machineDepartmentFilter")?.value || "";
  const statusValue = document.getElementById("machineStatusFilter")?.value || "";

  table.innerHTML = `<div class="loading">Loading machines...</div>`;

  try {
    const response = await apiRequest("/machines");
    let machines = response.data;

    if (searchValue) {
      machines = machines.filter((machine) => {
        return (
          machine.machineCode.toLowerCase().includes(searchValue) ||
          machine.machineName.toLowerCase().includes(searchValue) ||
          machine.status.toLowerCase().includes(searchValue) ||
          (machine.departmentName || "").toLowerCase().includes(searchValue)
        );
      });
    }

    if (departmentValue) {
      machines = machines.filter((machine) => Number(machine.departmentId) === Number(departmentValue));
    }

    if (statusValue) {
      machines = machines.filter((machine) => machine.status === statusValue);
    }

    table.innerHTML = renderMachinesTable(machines);
    bindMachineActions(machines);
  } catch (error) {
    table.innerHTML = `<div class="message error" style="display:block;">${error.message}</div>`;
  }
}

function renderMachinesTable(machines) {
  if (!machines.length) {
    return `<p class="loading">No machines found.</p>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Machine</th>
            <th>Department</th>
            <th>Status</th>
            <th>Capacity / Shift</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${machines.map((machine) => `
            <tr>
              <td><strong>${machine.machineCode}</strong></td>
              <td>${machine.machineName}</td>
              <td>${machine.departmentName || "-"}</td>
              <td>
                <span class="badge ${
                  machine.status === "Active"
                    ? "badge-success"
                    : machine.status === "Maintenance"
                    ? "badge-warning"
                    : "badge-danger"
                }">
                  ${machine.status}
                </span>
              </td>
              <td><strong>${machine.capacityPerShift}</strong></td>
              <td>${machine.description || "-"}</td>
              <td>
                <div class="actions">
                  ${canManageMachines() ? `<button class="edit-btn" data-edit-machine="${machine.id}">Edit</button>` : ""}
                  ${canDeleteMachines() ? `<button class="danger-btn" data-delete-machine="${machine.id}">Delete</button>` : ""}
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function bindMachineActions(machines) {
  document.querySelectorAll("[data-edit-machine]").forEach((button) => {
    button.addEventListener("click", () => {
      const machine = machines.find((item) => Number(item.id) === Number(button.dataset.editMachine));
      fillMachineForm(machine);
    });
  });

  document.querySelectorAll("[data-delete-machine]").forEach((button) => {
    button.addEventListener("click", () => deleteMachine(button.dataset.deleteMachine));
  });
}

function fillMachineForm(machine) {
  document.getElementById("machineFormTitle").textContent = "Edit Production Machine";
  document.getElementById("machineId").value = machine.id;
  document.getElementById("machineCode").value = machine.machineCode;
  document.getElementById("machineName").value = machine.machineName;
  document.getElementById("machineDepartmentId").value = machine.departmentId;
  document.getElementById("machineStatus").value = machine.status;
  document.getElementById("machineCapacityPerShift").value = machine.capacityPerShift;
  document.getElementById("machineDescription").value = machine.description || "";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetMachineForm() {
  const form = document.getElementById("machineForm");
  if (!form) return;

  form.reset();
  document.getElementById("machineId").value = "";
  document.getElementById("machineFormTitle").textContent = "Add Production Machine";
  document.getElementById("machineStatus").value = "Active";
}

function getMachineFormData() {
  return {
    machineCode: document.getElementById("machineCode").value.trim(),
    machineName: document.getElementById("machineName").value.trim(),
    departmentId: Number(document.getElementById("machineDepartmentId").value),
    status: document.getElementById("machineStatus").value,
    capacityPerShift: Number(document.getElementById("machineCapacityPerShift").value),
    description: document.getElementById("machineDescription").value.trim()
  };
}

function validateMachineForm(data) {
  if (!data.machineCode) return "Machine code is required.";
  if (!data.machineName) return "Machine name is required.";
  if (!data.departmentId) return "Department is required.";
  if (!data.status) return "Machine status is required.";
  if (data.capacityPerShift <= 0) return "Capacity per shift must be greater than zero.";
  return null;
}

async function handleMachineSubmit(event) {
  event.preventDefault();

  const message = document.getElementById("machineMessage");
  const machineId = document.getElementById("machineId").value;
  const formData = getMachineFormData();
  const validationError = validateMachineForm(formData);

  message.style.display = "none";

  if (validationError) {
    showMessage(message, validationError, "error");
    return;
  }

  try {
    if (machineId) {
      await apiRequest(`/machines/${machineId}`, {
        method: "PUT",
        body: JSON.stringify(formData)
      });

      showMessage(message, "Production machine updated successfully.", "success");
    } else {
      await apiRequest("/machines", {
        method: "POST",
        body: JSON.stringify(formData)
      });

      showMessage(message, "Production machine created successfully.", "success");
    }

    resetMachineForm();
    await loadMachines();
  } catch (error) {
    showMessage(message, error.message, "error");
  }
}

async function deleteMachine(id) {
  const confirmed = confirm(
    "Are you sure you want to delete this production machine? Machines used in production records may affect operational history."
  );

  if (!confirmed) return;

  const message = document.getElementById("machineMessage");

  try {
    await apiRequest(`/machines/${id}`, {
      method: "DELETE"
    });

    showMessage(message, "Production machine deleted successfully.", "success");
    await loadMachines();
  } catch (error) {
    showMessage(message, error.message, "error");
  }
}

/* PRODUCTION RECORDS */

function canManageProductionRecords() {
  return ["Admin", "Manager", "Production"].includes(state.user.role);
}

function canDeleteProductionRecords() {
  return state.user.role === "Admin";
}

async function renderProductionRecords() {
  const view = document.getElementById("view");

  view.innerHTML = `
    ${renderTopbar(
      "Production Records",
      "Track production output, quality, continuity and employee performance recommendations."
    )}

    <div id="productionMessage" class="message"></div>

    ${
      canManageProductionRecords()
        ? renderProductionRecordForm()
        : `<div class="panel"><p class="loading">You have view-only access for production records.</p></div>`
    }

    <div class="panel">
      <div class="panel-header">
        <h3>Production Performance Records</h3>
      </div>

      <div class="toolbar">
        <select class="form-control" id="productionEmployeeFilter">
          <option value="">All employees</option>
        </select>
        <select class="form-control" id="productionGradeFilter">
          <option value="">All grades</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Needs Improvement">Needs Improvement</option>
          <option value="Poor">Poor</option>
        </select>
        <select class="form-control" id="productionRecommendationFilter">
          <option value="">All recommendations</option>
          <option value="Promotion Candidate">Promotion Candidate</option>
          <option value="Stable Performer">Stable Performer</option>
          <option value="Monitor Closely">Monitor Closely</option>
          <option value="Performance Improvement Plan Required">Improvement Plan Required</option>
          <option value="HR Review Required">HR Review Required</option>
        </select>
        <button class="secondary-btn" id="refreshProductionBtn">Refresh</button>
      </div>

      <div id="productionRecordsTable" class="loading">Loading production records...</div>
    </div>
  `;

  await loadProductionEmployeeOptions();
  await loadProductionRecords();

  document.getElementById("productionEmployeeFilter").addEventListener("change", () => loadProductionRecords());
  document.getElementById("productionGradeFilter").addEventListener("change", () => loadProductionRecords());
  document.getElementById("productionRecommendationFilter").addEventListener("change", () => loadProductionRecords());
  document.getElementById("refreshProductionBtn").addEventListener("click", () => loadProductionRecords());

  const form = document.getElementById("productionRecordForm");
  if (form) {
    form.addEventListener("submit", handleProductionRecordSubmit);
    document.getElementById("productionCancelBtn").addEventListener("click", resetProductionRecordForm);
  }
}

function renderProductionRecordForm() {
  return `
    <div class="panel">
      <div class="panel-header">
        <h3 id="productionFormTitle">Add Production Record</h3>
      </div>

      <form id="productionRecordForm">
        <input type="hidden" id="productionRecordId" />

        <div class="form-grid">
          <div class="form-group">
            <label>Employee</label>
            <select class="form-control" id="productionEmployeeId"></select>
          </div>

          <div class="form-group">
            <label>Product</label>
            <select class="form-control" id="productionProductId"></select>
          </div>

          <div class="form-group">
            <label>Production Machine</label>
            <select class="form-control" id="productionMachineId"></select>
          </div>

          <div class="form-group">
            <label>Record Date</label>
            <input class="form-control" id="productionRecordDate" type="date" />
          </div>

          <div class="form-group">
            <label>Period</label>
            <input class="form-control" id="productionPeriod" placeholder="Example: 2026-Q2" />
          </div>

          <div class="form-group">
            <label>Product Type</label>
            <input class="form-control" id="productionProductType" placeholder="Example: Chocolate Wafer Box" />
          </div>

          <div class="form-group">
            <label>Target Quantity</label>
            <input class="form-control" id="productionTargetQuantity" type="number" min="1" placeholder="Example: 500" />
          </div>

          <div class="form-group">
            <label>Actual Quantity</label>
            <input class="form-control" id="productionActualQuantity" type="number" min="1" placeholder="Example: 465" />
          </div>

          <div class="form-group">
            <label>Defective Quantity</label>
            <input class="form-control" id="productionDefectiveQuantity" type="number" min="0" placeholder="Example: 12" />
          </div>

          <div class="form-group">
            <label>On-Time Completion Score</label>
            <input class="form-control" id="productionOnTimeScore" type="number" min="0" max="100" placeholder="0 - 100" />
          </div>

          <div class="form-group">
            <label>Planned Work Days</label>
            <input class="form-control" id="productionPlannedDays" type="number" min="1" placeholder="Example: 22" />
          </div>

          <div class="form-group">
            <label>Absent Days</label>
            <input class="form-control" id="productionAbsentDays" type="number" min="0" placeholder="Example: 1" />
          </div>

          <div class="form-group">
            <label>Late Days</label>
            <input class="form-control" id="productionLateDays" type="number" min="0" placeholder="Example: 2" />
          </div>

          <div class="form-group full">
            <label>Notes</label>
            <textarea class="form-control" id="productionNotes" rows="3" placeholder="Optional operational note..."></textarea>
          </div>
        </div>

        <div class="actions">
          <button class="primary-btn" style="width:auto;" type="submit">Save Production Record</button>
          <button class="secondary-btn" type="button" id="productionCancelBtn">Clear</button>
        </div>
      </form>
    </div>
  `;
}

async function loadProductionEmployeeOptions() {
  const [employeeResponse, productResponse, machineResponse] = await Promise.all([
    apiRequest("/employees"),
    apiRequest("/products"),
    apiRequest("/machines")
  ]);

  const employees = employeeResponse.data;
  const products = productResponse.data;
  const machines = machineResponse.data;

  const filterSelect = document.getElementById("productionEmployeeFilter");
  const employeeSelect = document.getElementById("productionEmployeeId");
  const productSelect = document.getElementById("productionProductId");
  const machineSelect = document.getElementById("productionMachineId");

  if (filterSelect) {
    filterSelect.innerHTML =
      `<option value="">All employees</option>` +
      employees.map((employee) => `
        <option value="${employee.id}">${employee.employeeCode} - ${employee.fullName}</option>
      `).join("");
  }

  if (employeeSelect) {
    employeeSelect.innerHTML = employees.map((employee) => `
      <option value="${employee.id}">${employee.employeeCode} - ${employee.fullName}</option>
    `).join("");
  }

  if (productSelect) {
    productSelect.innerHTML = products.map((product) => `
      <option value="${product.id}">${product.productCode} - ${product.productName}</option>
    `).join("");
  }

  if (machineSelect) {
    machineSelect.innerHTML = machines.map((machine) => `
      <option value="${machine.id}">${machine.machineCode} - ${machine.machineName}</option>
    `).join("");
  }
}

async function loadProductionRecords() {
  const table = document.getElementById("productionRecordsTable");
  const employeeFilter = document.getElementById("productionEmployeeFilter")?.value || "";
  const gradeFilter = document.getElementById("productionGradeFilter")?.value || "";
  const recommendationFilter = document.getElementById("productionRecommendationFilter")?.value || "";

  table.innerHTML = `<div class="loading">Loading production records...</div>`;

  try {
    let records;

    if (employeeFilter) {
      const response = await apiRequest(`/production-records/employee/${employeeFilter}`);
      records = response.data;
    } else {
      const response = await apiRequest("/production-records");
      records = response.data;
    }

    if (gradeFilter) {
      records = records.filter((record) => record.performanceGrade === gradeFilter);
    }

    if (recommendationFilter) {
      records = records.filter((record) => record.recommendation === recommendationFilter);
    }

    table.innerHTML = renderProductionRecordsTable(records);
    bindProductionRecordActions(records);
  } catch (error) {
    table.innerHTML = `<div class="message error" style="display:block;">${error.message}</div>`;
  }
}

function renderProductionRecordsTable(records) {
  if (!records.length) {
    return `<p class="loading">No production records found.</p>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Product / Machine</th>
            <th>Target / Actual</th>
            <th>Defective</th>
            <th>Quality</th>
            <th>Continuity</th>
            <th>Score</th>
            <th>Grade</th>
            <th>Bonus</th>
            <th>Recommendation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${records.map((record) => `
            <tr>
              <td>
                <strong>${record.fullName}</strong><br />
                <span class="loading">${record.departmentName || "-"}</span>
              </td>
              <td>
                <strong>${record.productName || record.productType}</strong><br />
                <span class="loading">${record.productCode || "-"} · ${record.recordDate} · ${record.period}</span><br />
                <span class="loading">${record.machineCode || "-"} · ${record.machineName || "-"}</span>
              </td>
              <td>${record.targetQuantity} / <strong>${record.actualQuantity}</strong></td>
              <td>${record.defectiveQuantity}</td>
              <td>${record.qualityScore}</td>
              <td>${record.continuityScore}</td>
              <td><strong>${record.overallPerformanceScore}</strong></td>
              <td><span class="badge ${getBadgeClass(record.performanceGrade)}">${record.performanceGrade}</span></td>
              <td>
                <span class="badge ${record.bonusEligible ? "badge-success" : "badge-warning"}">
                  ${record.bonusEligible ? "Eligible" : "Not Eligible"}
                </span>
              </td>
              <td><span class="badge ${getBadgeClass(record.recommendation)}">${record.recommendation}</span></td>
              <td>
                <div class="actions">
                  ${canManageProductionRecords() ? `<button class="edit-btn" data-edit-production="${record.id}">Edit</button>` : ""}
                  ${canDeleteProductionRecords() ? `<button class="danger-btn" data-delete-production="${record.id}">Delete</button>` : ""}
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="11" style="background:#f8fafc;">
                <strong>Employee Report:</strong> ${record.reportSummary}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function bindProductionRecordActions(records) {
  document.querySelectorAll("[data-edit-production]").forEach((button) => {
    button.addEventListener("click", () => {
      const record = records.find((item) => Number(item.id) === Number(button.dataset.editProduction));
      fillProductionRecordForm(record);
    });
  });

  document.querySelectorAll("[data-delete-production]").forEach((button) => {
    button.addEventListener("click", () => deleteProductionRecord(button.dataset.deleteProduction));
  });
}

function fillProductionRecordForm(record) {
  document.getElementById("productionFormTitle").textContent = "Edit Production Record";
  document.getElementById("productionRecordId").value = record.id;
  document.getElementById("productionEmployeeId").value = record.employeeId;
  document.getElementById("productionProductId").value = record.productId;
  document.getElementById("productionMachineId").value = record.machineId;
  document.getElementById("productionRecordDate").value = record.recordDate;
  document.getElementById("productionPeriod").value = record.period;
  document.getElementById("productionProductType").value = record.productType;
  document.getElementById("productionTargetQuantity").value = record.targetQuantity;
  document.getElementById("productionActualQuantity").value = record.actualQuantity;
  document.getElementById("productionDefectiveQuantity").value = record.defectiveQuantity;
  document.getElementById("productionOnTimeScore").value = record.onTimeCompletionScore;
  document.getElementById("productionPlannedDays").value = record.plannedWorkDays;
  document.getElementById("productionAbsentDays").value = record.absentDays;
  document.getElementById("productionLateDays").value = record.lateDays;
  document.getElementById("productionNotes").value = record.notes || "";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetProductionRecordForm() {
  const form = document.getElementById("productionRecordForm");
  if (!form) return;

  form.reset();
  document.getElementById("productionRecordId").value = "";
  document.getElementById("productionFormTitle").textContent = "Add Production Record";
}

function getProductionRecordFormData() {
  return {
    employeeId: Number(document.getElementById("productionEmployeeId").value),
    productId: Number(document.getElementById("productionProductId").value),
    machineId: Number(document.getElementById("productionMachineId").value),
    recordDate: document.getElementById("productionRecordDate").value,
    period: document.getElementById("productionPeriod").value.trim(),
    productType: document.getElementById("productionProductType").value.trim(),
    targetQuantity: Number(document.getElementById("productionTargetQuantity").value),
    actualQuantity: Number(document.getElementById("productionActualQuantity").value),
    defectiveQuantity: Number(document.getElementById("productionDefectiveQuantity").value),
    onTimeCompletionScore: Number(document.getElementById("productionOnTimeScore").value),
    plannedWorkDays: Number(document.getElementById("productionPlannedDays").value),
    absentDays: Number(document.getElementById("productionAbsentDays").value),
    lateDays: Number(document.getElementById("productionLateDays").value),
    notes: document.getElementById("productionNotes").value.trim()
  };
}

function validateProductionRecordForm(data) {
  if (!data.employeeId) return "Employee is required.";
  if (!data.productId) return "Product is required.";
  if (!data.machineId) return "Production machine is required.";
  if (!data.recordDate) return "Record date is required.";
  if (!data.period) return "Period is required.";
  if (!data.productType) return "Product type is required.";
  if (data.targetQuantity <= 0) return "Target quantity must be greater than zero.";
  if (data.actualQuantity <= 0) return "Actual quantity must be greater than zero.";
  if (data.defectiveQuantity < 0) return "Defective quantity cannot be negative.";
  if (data.defectiveQuantity > data.actualQuantity) return "Defective quantity cannot be greater than actual quantity.";
  if (data.onTimeCompletionScore < 0 || data.onTimeCompletionScore > 100) return "On-time completion score must be between 0 and 100.";
  if (data.plannedWorkDays <= 0) return "Planned work days must be greater than zero.";
  if (data.absentDays < 0) return "Absent days cannot be negative.";
  if (data.lateDays < 0) return "Late days cannot be negative.";
  if (data.absentDays > data.plannedWorkDays) return "Absent days cannot be greater than planned work days.";
  return null;
}

async function handleProductionRecordSubmit(event) {
  event.preventDefault();

  const message = document.getElementById("productionMessage");
  const recordId = document.getElementById("productionRecordId").value;
  const formData = getProductionRecordFormData();
  const validationError = validateProductionRecordForm(formData);

  message.style.display = "none";

  if (validationError) {
    showMessage(message, validationError, "error");
    return;
  }

  try {
    if (recordId) {
      await apiRequest(`/production-records/${recordId}`, {
        method: "PUT",
        body: JSON.stringify(formData)
      });

      showMessage(message, "Production record updated successfully.", "success");
    } else {
      await apiRequest("/production-records", {
        method: "POST",
        body: JSON.stringify(formData)
      });

      showMessage(message, "Production record created successfully.", "success");
    }

    resetProductionRecordForm();
    await loadProductionRecords();
  } catch (error) {
    showMessage(message, error.message, "error");
  }
}

async function deleteProductionRecord(id) {
  const confirmed = confirm("Are you sure you want to delete this production record?");
  if (!confirmed) return;

  const message = document.getElementById("productionMessage");

  try {
    await apiRequest(`/production-records/${id}`, {
      method: "DELETE"
    });

    showMessage(message, "Production record deleted successfully.", "success");
    await loadProductionRecords();
  } catch (error) {
    showMessage(message, error.message, "error");
  }
}

/* REPORTS */

async function renderReports() {
  const view = document.getElementById("view");
  const role = state.user.role;
  const roleName = getRoleDisplayName(role);

  view.innerHTML = `
    ${renderTopbar(
      `${roleName} Reports`,
      "Loading role-specific operational reports..."
    )}

    <div class="loading">Loading reports...</div>
  `;

  try {
    const [
      summaryResponse,
      topPerformersResponse,
      bonusResponse,
      promotionResponse,
      lowContinuityResponse,
      hrReviewResponse,
      departmentResponse
    ] = await Promise.all([
      apiRequest("/reports/summary"),
      apiRequest("/reports/top-performers"),
      apiRequest("/reports/bonus-eligible"),
      apiRequest("/reports/promotion-candidates"),
      apiRequest("/reports/low-continuity"),
      apiRequest("/reports/hr-review-required"),
      apiRequest("/reports/department-performance")
    ]);

    const summary = summaryResponse.data;
    const topPerformers = topPerformersResponse.data;
    const bonusEligible = bonusResponse.data;
    const promotionCandidates = promotionResponse.data;
    const lowContinuity = lowContinuityResponse.data;
    const hrReviewRequired = hrReviewResponse.data;
    const departments = departmentResponse.data;

    const emptyState = hasNoWorkspaceData(summary)
      ? renderWorkspaceEmptyState(role)
      : "";

    if (isExecutiveRole()) {
      view.innerHTML = `
        ${renderTopbar(
          "Executive Performance Reports",
          "Detailed decision reports for productivity, bonus eligibility, promotion candidates and HR review."
        )}

        <section class="card-grid">
          ${metricCard("Total Employees", summary.totalEmployees)}
          ${metricCard("Production Records", summary.totalProductionRecords)}
          ${metricCard("Avg. Performance", summary.averagePerformanceScore)}
          ${metricCard("Avg. Quality", summary.averageQualityScore)}
          ${metricCard("Avg. Continuity", summary.averageContinuityScore)}
          ${metricCard("Bonus Eligible", summary.bonusEligibleCount)}
          ${metricCard("Promotion Candidates", summary.promotionCandidateCount)}
          ${metricCard("HR Review Required", summary.hrReviewRequiredCount)}
        </section>

        ${emptyState}

        <section class="content-grid">
          <div class="panel">
            <div class="panel-header">
              <h3>Executive Decision Summary</h3>
            </div>
            ${renderExecutiveDecisionSummary(summary)}
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>Department Performance Chart</h3>
            </div>
            ${renderSimpleBarChart("Average Score by Department", departments, "averagePerformanceScore", "departmentName")}
          </div>
        </section>

        <section class="content-grid" style="margin-top:22px;">
          <div class="panel">
            <div class="panel-header">
              <h3>Top Performers</h3>
            </div>
            ${renderReportRecordTable(topPerformers, "No top performer records found.")}
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>Bonus Eligible Employees</h3>
            </div>
            ${renderReportRecordTable(bonusEligible, "No bonus eligible employees found.")}
          </div>
        </section>

        <section class="content-grid" style="margin-top:22px;">
          <div class="panel">
            <div class="panel-header">
              <h3>Promotion Candidates</h3>
            </div>
            ${renderReportRecordTable(promotionCandidates, "No promotion candidates found.")}
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>HR Review Required</h3>
            </div>
            ${renderReportRecordTable(hrReviewRequired, "No HR review required records found.")}
          </div>
        </section>

        <section class="content-grid" style="margin-top:22px;">
          <div class="panel">
            <div class="panel-header">
              <h3>Low Continuity Employees</h3>
            </div>
            ${renderContinuityTable(lowContinuity)}
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>Department Performance Table</h3>
            </div>
            ${renderDepartmentReportTable(departments)}
          </div>
        </section>
      `;
      return;
    }

    if (isProductionRole()) {
      view.innerHTML = `
        ${renderTopbar(
          "Production Reports",
          "Production output, machine usage and target-vs-actual operational summary."
        )}

        <section class="card-grid">
          ${metricCard("Production Records", summary.totalProductionRecords)}
          ${metricCard("Actual Production", summary.totalActualProduction)}
          ${metricCard("Defective Quantity", summary.totalDefectiveQuantity)}
          ${metricCard("Avg. On-Time Score", summary.averageOnTimeCompletionScore)}
        </section>

        ${emptyState}

        <section class="content-grid">
          <div class="panel">
            <div class="panel-header">
              <h3>Production Output Chart</h3>
            </div>
            ${renderSimpleBarChart("Actual Production by Department", departments, "totalActualProduction", "departmentName")}
          </div>

          ${renderRoleInfoPanel(
            "Restricted Decision Data",
            "Production Supervisors can review production activity, products and machines. Employee bonus, promotion and HR decision reports are intentionally hidden.",
            [
              "Can monitor production volume and operational output.",
              "Can work with products, machines and production records.",
              "Cannot access sensitive employee decision reports."
            ]
          )}
        </section>

        <section class="panel" style="margin-top:22px;">
          <div class="panel-header">
            <h3>Department Production Summary</h3>
          </div>
          ${renderProductionDepartmentReportTable(departments)}
        </section>
      `;
      return;
    }

    if (isQualityRole()) {
      view.innerHTML = `
        ${renderTopbar(
          "Quality Control Reports",
          "Defect tracking, quality score monitoring and quality risk review."
        )}

        <section class="card-grid">
          ${metricCard("Production Records", summary.totalProductionRecords)}
          ${metricCard("Total Defects", summary.totalDefectiveQuantity)}
          ${metricCard("Avg. Quality", summary.averageQualityScore)}
          ${metricCard("Avg. On-Time Score", summary.averageOnTimeCompletionScore)}
        </section>

        ${emptyState}

        <section class="content-grid">
          <div class="panel">
            <div class="panel-header">
              <h3>Defect Quantity Chart</h3>
            </div>
            ${renderSimpleBarChart("Defects by Department", departments, "totalDefectiveQuantity", "departmentName")}
          </div>

          ${renderRoleInfoPanel(
            "Quality Report Scope",
            "Quality Control Specialists focus on defect levels, quality score and production quality risks. Bonus and promotion decisions are hidden.",
            [
              "Can review production quality indicators.",
              "Can monitor defective quantity and quality score.",
              "Cannot access HR-sensitive bonus or promotion decisions."
            ]
          )}
        </section>

        <section class="panel" style="margin-top:22px;">
          <div class="panel-header">
            <h3>Department Quality Summary</h3>
          </div>
          ${renderQualityDepartmentReportTable(departments)}
        </section>
      `;
      return;
    }

    if (isHrRole()) {
      view.innerHTML = `
        ${renderTopbar(
          "HR Workforce Reports",
          "Employee status, workforce continuity, absence and HR review monitoring."
        )}

        <section class="card-grid">
          ${metricCard("Total Employees", summary.totalEmployees)}
          ${metricCard("Active Employees", summary.activeEmployees)}
          ${metricCard("Inactive Employees", summary.inactiveEmployees)}
          ${metricCard("Avg. Continuity", summary.averageContinuityScore)}
          ${metricCard("HR Review Required", summary.hrReviewRequiredCount)}
          ${metricCard("Low Continuity Records", lowContinuity.length)}
        </section>

        ${emptyState}

        <section class="content-grid">
          <div class="panel">
            <div class="panel-header">
              <h3>Continuity Risk Employees</h3>
            </div>
            ${renderContinuityTable(lowContinuity)}
          </div>

          <div class="panel">
            <div class="panel-header">
              <h3>HR Review Required</h3>
            </div>
            ${renderHrReviewTable(hrReviewRequired)}
          </div>
        </section>

        <section class="content-grid" style="margin-top:22px;">
          <div class="panel">
            <div class="panel-header">
              <h3>Department Workforce Chart</h3>
            </div>
            ${renderSimpleBarChart("Records by Department", departments, "recordCount", "departmentName")}
          </div>

          ${renderRoleInfoPanel(
            "HR Report Scope",
            "HR Specialists focus on employees, department distribution, continuity risk and HR follow-up needs. Product and machine management reports are hidden.",
            [
              "Can review employee continuity and HR review indicators.",
              "Can monitor active and inactive employee status.",
              "Cannot manage production machines or product targets."
            ]
          )}
        </section>
      `;
      return;
    }

    if (isViewerRole()) {
      view.innerHTML = `
        ${renderTopbar(
          "Summary Reports",
          "Read-only limited report summary for department viewers."
        )}

        <section class="card-grid">
          ${metricCard("Total Employees", summary.totalEmployees)}
          ${metricCard("Production Records", summary.totalProductionRecords)}
          ${metricCard("Actual Production", summary.totalActualProduction)}
          ${metricCard("Avg. On-Time Score", summary.averageOnTimeCompletionScore)}
        </section>

        ${emptyState}

        ${renderRoleInfoPanel(
          "Limited Report Access",
          "Department Viewers can access only high-level summaries. Sensitive employee scores, bonus decisions and promotion recommendations are hidden.",
          [
            "Read-only report access.",
            "No employee decision details.",
            "No create, update or delete permissions."
          ]
        )}
      `;
      return;
    }
  } catch (error) {
    view.innerHTML = `
      ${renderTopbar("Reports", "Unable to load report data.")}
      <div class="message error" style="display:block;">${error.message}</div>
    `;
  }
}


function renderExecutiveDecisionSummary(summary) {
  const riskLevel =
    Number(summary.hrReviewRequiredCount || 0) > 0
      ? "Attention Required"
      : Number(summary.averagePerformanceScore || 0) >= 85
      ? "Strong"
      : "Monitor";

  return `
    <div class="decision-summary">
      <div class="decision-summary-item">
        <span>Operational Risk Level</span>
        <strong>${riskLevel}</strong>
      </div>
      <div class="decision-summary-item">
        <span>Management Focus</span>
        <strong>${summary.hrReviewRequiredCount > 0 ? "HR Review" : "Performance Growth"}</strong>
      </div>
      <div class="decision-summary-item">
        <span>Automated Decision Support</span>
        <strong>Enabled</strong>
      </div>
    </div>
    <p class="empty-state-text" style="margin-top:14px;">
      The report engine automatically evaluates production output, quality indicators,
      continuity data and on-time completion scores to support management decisions.
    </p>
  `;
}

function renderProductionDepartmentReportTable(departments) {
  if (!departments.length) {
    return `<p class="loading">No production department data found.</p>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Department</th>
            <th>Records</th>
            <th>Total Production</th>
            <th>Defective Quantity</th>
            <th>Avg. On-Time</th>
          </tr>
        </thead>
        <tbody>
          ${departments.map((department) => `
            <tr>
              <td><strong>${department.departmentName}</strong></td>
              <td>${department.recordCount}</td>
              <td><strong>${department.totalActualProduction}</strong></td>
              <td>${department.totalDefectiveQuantity || 0}</td>
              <td>${department.averageOnTimeCompletionScore || 0}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderQualityDepartmentReportTable(departments) {
  if (!departments.length) {
    return `<p class="loading">No quality department data found.</p>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Department</th>
            <th>Records</th>
            <th>Defects</th>
            <th>Avg. Quality</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          ${departments.map((department) => {
            const defects = Number(department.totalDefectiveQuantity || 0);
            const risk = defects > 100 ? "High" : defects > 30 ? "Medium" : "Low";

            return `
              <tr>
                <td><strong>${department.departmentName}</strong></td>
                <td>${department.recordCount}</td>
                <td>${defects}</td>
                <td><strong>${department.averageQualityScore || 0}</strong></td>
                <td><span class="badge ${risk === "High" ? "badge-danger" : risk === "Medium" ? "badge-warning" : "badge-success"}">${risk}</span></td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderHrReviewTable(records) {
  if (!records.length) {
    return `<p class="loading">No HR review required records found.</p>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Continuity</th>
            <th>Absent</th>
            <th>Late</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          ${records.map((record) => `
            <tr>
              <td>
                <strong>${record.fullName}</strong><br />
                <span class="loading">${record.employeeCode || ""}</span>
              </td>
              <td>${record.departmentName || "-"}</td>
              <td><strong>${record.continuityScore}</strong></td>
              <td>${record.absentDays}</td>
              <td>${record.lateDays}</td>
              <td><span class="badge badge-danger">${record.recommendation}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}


function renderReportRecordTable(records, emptyMessage) {
  if (!records.length) {
    return `<p class="loading">${emptyMessage}</p>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Score</th>
            <th>Grade</th>
            <th>Bonus</th>
            <th>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          ${records.map((record) => `
            <tr>
              <td>
                <strong>${record.fullName}</strong><br />
                <span class="loading">${record.employeeCode || ""}</span>
              </td>
              <td>${record.departmentName || "-"}</td>
              <td><strong>${record.overallPerformanceScore}</strong></td>
              <td><span class="badge ${getBadgeClass(record.performanceGrade)}">${record.performanceGrade}</span></td>
              <td>
                <span class="badge ${record.bonusEligible ? "badge-success" : "badge-warning"}">
                  ${record.bonusEligible ? "Eligible" : "Not Eligible"}
                </span>
              </td>
              <td><span class="badge ${getBadgeClass(record.recommendation)}">${record.recommendation}</span></td>
            </tr>
            <tr>
              <td colspan="6" style="background:#f8fafc;">
                <strong>Report Summary:</strong> ${record.reportSummary}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderContinuityTable(records) {
  if (!records.length) {
    return `<p class="loading">No low continuity employees found.</p>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Continuity</th>
            <th>Absent</th>
            <th>Late</th>
            <th>Recommendation</th>
          </tr>
        </thead>
        <tbody>
          ${records.map((record) => `
            <tr>
              <td>
                <strong>${record.fullName}</strong><br />
                <span class="loading">${record.employeeCode || ""}</span>
              </td>
              <td>${record.departmentName || "-"}</td>
              <td><strong>${record.continuityScore}</strong></td>
              <td>${record.absentDays}</td>
              <td>${record.lateDays}</td>
              <td><span class="badge ${getBadgeClass(record.recommendation)}">${record.recommendation}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderDepartmentReportTable(departments) {
  if (!departments.length) {
    return `<p class="loading">No department performance data found.</p>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Department</th>
            <th>Records</th>
            <th>Total Production</th>
            <th>Avg. Score</th>
            <th>Quality</th>
            <th>Continuity</th>
          </tr>
        </thead>
        <tbody>
          ${departments.map((department) => `
            <tr>
              <td><strong>${department.departmentName}</strong></td>
              <td>${department.recordCount}</td>
              <td>${department.totalActualProduction}</td>
              <td><strong>${department.averagePerformanceScore}</strong></td>
              <td>${department.averageQualityScore}</td>
              <td>${department.averageContinuityScore}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

renderApp();