const API_BASE_URL = "http://localhost:5001/api";

const state = {
  token: localStorage.getItem("tatlee_token"),
  user: JSON.parse(localStorage.getItem("tatlee_user") || "null"),
  currentView: "dashboard",
  authMode: "login",
  selectedEmployeeReportId: null,
  selectedEmployeeReportName: null
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
  if (view === "reports") {
    return ["Admin", "Factory Manager"].includes(getNormalizedRole());
  }

  return getAllowedViewsByRole().includes(view);
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
      const targetView = button.dataset.view;

      if (!canAccessView(targetView)) {
        state.currentView = "dashboard";
      } else {
        state.currentView = targetView;
      }

      if (targetView === "reports") {
        state.selectedEmployeeReportId = null;
        state.selectedEmployeeReportName = null;
      }

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


function getNormalizedRole() {
  const role = state.user?.role || "";

  const roleMap = {
    "Admin": "Admin",
    "Manager": "Factory Manager",
    "Factory Manager": "Factory Manager",
    "Production": "Production Supervisor",
    "Production Supervisor": "Production Supervisor",
    "Quality": "Quality Control Specialist",
    "Quality Control Specialist": "Quality Control Specialist",
    "HR": "HR Specialist",
    "Human Resources": "HR Specialist",
    "HR Specialist": "HR Specialist",
    "Viewer": "Department Viewer",
    "Department Viewer": "Department Viewer"
  };

  return roleMap[role] || role;
}

function getAllowedViewsByRole() {
  const role = getNormalizedRole();

  const permissions = {
    "Admin": ["dashboard", "employees", "departments", "products", "machines", "production", "reports"],
    "Factory Manager": ["dashboard", "employees", "departments", "products", "machines", "production", "reports"],
    "Production Supervisor": ["dashboard", "employees", "products", "machines", "production"],
    "Quality Control Specialist": ["dashboard", "products", "production"],
    "HR Specialist": ["dashboard", "employees", "departments"],
    "Department Viewer": ["dashboard"]
  };

  return permissions[role] || ["dashboard"];
}

function canAccessView(view) {
  if (view === "reports") {
    return ["Admin", "Factory Manager"].includes(getNormalizedRole());
  }

  return getAllowedViewsByRole().includes(view);
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

function getDashboardTitleByRole() {
  const role = getNormalizedRole();

  if (role === "Admin") return "System Admin Dashboard";
  if (role === "Factory Manager") return "Factory Manager Dashboard";
  if (role === "Production Supervisor") return "Production Overview";
  if (role === "Quality Control Specialist") return "Quality Control Overview";
  if (role === "HR Specialist") return "HR Performance Dashboard";
  if (role === "Department Viewer") return "Factory Status Board";

  return "Dashboard";
}

function getDashboardSubtitleByRole() {
  const role = getNormalizedRole();

  if (role === "Admin") {
    return "Full system visibility across workforce, production, quality, machines and reports.";
  }

  if (role === "Factory Manager") {
    return "Management-level overview of operational performance, bonus candidates and promotion decisions.";
  }

  if (role === "Production Supervisor") {
    return "Production-focused overview of machines, products, daily output and production records.";
  }

  if (role === "Quality Control Specialist") {
    return "Quality-focused overview of product quality, defects and production inspection indicators.";
  }

  if (role === "HR Specialist") {
    return "HR-focused overview of employees, bonus eligibility, promotion candidates and HR review cases.";
  }

  if (role === "Department Viewer") {
    return "Read-only factory status overview for display and monitoring purposes.";
  }

  return "Role-based operational dashboard.";
}

function roleLabel() {
  return getNormalizedRole();
}


function canUpdateMachineStatusOnly() {
  return getNormalizedRole() === "Production Supervisor";
}

function canQualityEditProductionRecordsOnly() {
  return getNormalizedRole() === "Quality Control Specialist";
}

function isViewerRole() {
  return getNormalizedRole() === "Department Viewer";
}

function isReadOnlyProductsRole() {
  return ["Production Supervisor", "Quality Control Specialist"].includes(getNormalizedRole());
}

function canSeeEmployeeReportButton() {
  return ["Admin", "Factory Manager"].includes(getNormalizedRole());
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
  const role = getNormalizedRole();

  view.innerHTML = `
    ${renderTopbar(
      getDashboardTitleByRole(),
      getDashboardSubtitleByRole()
    )}
    <div class="loading">Loading role-based dashboard...</div>
  `;

  try {
    const safeRequest = async (path) => {
      try {
        return await apiRequest(path);
      } catch (error) {
        return { data: [] };
      }
    };

    const [summaryResponse, employeesResponse, productsResponse, machinesResponse, productionResponse] =
      await Promise.all([
        safeRequest("/reports/summary"),
        safeRequest("/employees"),
        safeRequest("/products"),
        safeRequest("/machines"),
        safeRequest("/production-records")
      ]);

    const summary = summaryResponse.data || {};
    const employees = Array.isArray(employeesResponse.data) ? employeesResponse.data : [];
    const products = Array.isArray(productsResponse.data) ? productsResponse.data : [];
    const machines = Array.isArray(machinesResponse.data) ? machinesResponse.data : [];
    const productionRecords = Array.isArray(productionResponse.data) ? productionResponse.data : [];

    if (role === "Production Supervisor") {
      view.innerHTML = renderProductionDashboard(summary, employees, products, machines, productionRecords);
      return;
    }

    if (role === "Quality Control Specialist") {
      view.innerHTML = renderQualityDashboard(summary, products, productionRecords);
      return;
    }

    if (role === "HR Specialist") {
      view.innerHTML = renderHrDashboard(summary, employees);
      return;
    }

    if (role === "Department Viewer") {
      view.innerHTML = renderViewerDashboard(summary, machines, productionRecords);
      return;
    }

    view.innerHTML = renderManagementDashboard(summary, employees, products, machines, productionRecords, role);
  } catch (error) {
    view.innerHTML = `
      ${renderTopbar("Dashboard", "Unable to load dashboard data.")}
      <div class="message error" style="display:block;">${error.message}</div>
    `;
  }
}

function renderManagementDashboard(summary, employees, products, machines, productionRecords, role) {
  const managerActions = role === "Factory Manager"
    ? `
      <section class="action-panel-grid">
        <div class="action-panel">
          <span>Pending Management Action</span>
          <h3>${summary.bonusEligibleCount || 0} Bonus Candidate Records</h3>
          <p>Review employees who meet automatic bonus criteria.</p>
        </div>
        <div class="action-panel">
          <span>Career Review</span>
          <h3>${summary.promotionCandidateCount || 0} Promotion Candidate Records</h3>
          <p>Evaluate high performers for leadership or promotion review.</p>
        </div>
      </section>
    `
    : `
      <section class="action-panel-grid">
        <div class="action-panel">
          <span>System Scope</span>
          <h3>Full Administrative Access</h3>
          <p>System Admin can view and manage all operational modules.</p>
        </div>
        <div class="action-panel">
          <span>System Status</span>
          <h3>Role-Based Access Enabled</h3>
          <p>Menus and dashboards are filtered according to user responsibility.</p>
        </div>
      </section>
    `;

  return `
    ${renderTopbar(getDashboardTitleByRole(), getDashboardSubtitleByRole())}

    <section class="card-grid">
      ${metricCard("Total Employees", summary.totalEmployees || employees.length)}
      ${metricCard("Production Records", summary.totalProductionRecords || productionRecords.length)}
      ${metricCard("Products", products.length)}
      ${metricCard("Machines", machines.length)}
      ${metricCard("Avg. Performance", summary.averagePerformanceScore || 0)}
      ${metricCard("Bonus Eligible", summary.bonusEligibleCount || 0)}
      ${metricCard("Promotion Candidates", summary.promotionCandidateCount || 0)}
      ${metricCard("HR Review Required", summary.hrReviewRequiredCount || 0)}
    </section>

    ${managerActions}
  `;
}

function renderProductionDashboard(summary, employees, products, machines, productionRecords) {
  const activeMachines = machines.filter((machine) => machine.status === "Active").length;
  const totalTarget = productionRecords.reduce((sum, item) => sum + Number(item.targetQuantity || 0), 0);
  const totalActual = productionRecords.reduce((sum, item) => sum + Number(item.actualQuantity || 0), 0);
  const targetAttainment = totalTarget > 0 ? Math.round((totalActual / totalTarget) * 10000) / 100 : 0;

  return `
    ${renderTopbar("Production Overview", getDashboardSubtitleByRole())}

    <section class="card-grid">
      ${metricCard("Active Machines", activeMachines)}
      ${metricCard("Total Machines", machines.length)}
      ${metricCard("Products", products.length)}
      ${metricCard("Production Records", productionRecords.length)}
      ${metricCard("Daily Target Attainment", `${targetAttainment}%`)}
      ${metricCard("Actual Production", totalActual)}
      ${metricCard("Target Production", totalTarget)}
      ${metricCard("Active Workers", employees.filter((employee) => employee.status === "Active").length)}
    </section>

    <section class="role-info-panel">
      <h3>Production Supervisor Scope</h3>
      <p>
        This role focuses on machines, products and production record entry.
        HR reports, bonus decisions and promotion reports are hidden.
      </p>
    </section>
  `;
}

function renderQualityDashboard(summary, products, productionRecords) {
  const totalDefects = productionRecords.reduce((sum, item) => sum + Number(item.defectiveQuantity || 0), 0);
  const totalActual = productionRecords.reduce((sum, item) => sum + Number(item.actualQuantity || 0), 0);
  const defectRate = totalActual > 0 ? Math.round((totalDefects / totalActual) * 10000) / 100 : 0;

  return `
    ${renderTopbar("Quality Control Overview", getDashboardSubtitleByRole())}

    <section class="card-grid">
      ${metricCard("Products Under Control", products.length)}
      ${metricCard("Production Records", productionRecords.length)}
      ${metricCard("Total Defects", totalDefects)}
      ${metricCard("Defect Rate", `${defectRate}%`)}
      ${metricCard("Avg. Quality", summary.averageQualityScore || 0)}
      ${metricCard("Actual Production", totalActual)}
    </section>

    <section class="role-info-panel">
      <h3>Quality Control Scope</h3>
      <p>
        This role focuses on product quality and production record review.
        Employee management, HR decisions and financial reports are hidden.
      </p>
    </section>
  `;
}

function renderHrDashboard(summary, employees) {
  return `
    ${renderTopbar("HR Performance Dashboard", getDashboardSubtitleByRole())}

    <section class="card-grid">
      ${metricCard("Total Employees", summary.totalEmployees || employees.length)}
      ${metricCard("Active Employees", summary.activeEmployees || employees.filter((employee) => employee.status === "Active").length)}
      ${metricCard("Inactive Employees", summary.inactiveEmployees || employees.filter((employee) => employee.status === "Inactive").length)}
      ${metricCard("Bonus Eligible", summary.bonusEligibleCount || 0)}
      ${metricCard("Promotion Candidates", summary.promotionCandidateCount || 0)}
      ${metricCard("HR Review Required", summary.hrReviewRequiredCount || 0)}
      ${metricCard("Avg. Performance", summary.averagePerformanceScore || 0)}
      ${metricCard("Avg. Continuity", summary.averageContinuityScore || 0)}
    </section>

    <section class="role-info-panel">
      <h3>HR Specialist Scope</h3>
      <p>
        HR users manage employees, departments and smart employee reports.
        Product, machine and production operation modules are hidden.
      </p>
    </section>
  `;
}

function renderViewerDashboard(summary, machines, productionRecords) {
  const activeMachines = machines.filter((machine) => machine.status === "Active").length;

  return `
    ${renderTopbar("Factory Status Board", getDashboardSubtitleByRole())}

    <section class="card-grid">
      ${metricCard("Production Records", summary.totalProductionRecords || productionRecords.length)}
      ${metricCard("Actual Production", summary.totalActualProduction || 0)}
      ${metricCard("Active Machines", activeMachines)}
      ${metricCard("Avg. Performance", summary.averagePerformanceScore || 0)}
      ${metricCard("Avg. Quality", summary.averageQualityScore || 0)}
      ${metricCard("Avg. Continuity", summary.averageContinuityScore || 0)}
    </section>

    <section class="role-info-panel">
      <h3>Read-Only Department Viewer</h3>
      <p>
        This account is designed for display screens and general monitoring.
        Editing, detailed reports and operational management modules are hidden.
      </p>
    </section>
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
  return ["Admin", "Factory Manager", "HR Specialist"].includes(getNormalizedRole());
}

function canDeleteEmployees() {
  return ["Admin", "HR Specialist"].includes(getNormalizedRole());
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
                  ${canSeeEmployeeReportButton() ? `<button class="secondary-btn small-action" data-report-employee="${employee.id}">Report</button>` : ""}
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
  document.querySelectorAll("[data-report-employee]").forEach((button) => {
    button.addEventListener("click", () => {
      const employee = employees.find((item) => Number(item.id) === Number(button.dataset.reportEmployee));

      state.selectedEmployeeReportId = button.dataset.reportEmployee;
      state.selectedEmployeeReportName = employee ? employee.fullName : "Selected Employee";
      state.currentView = "reports";

      renderCurrentView();
      updateActiveNav();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

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
  return ["Admin", "Factory Manager", "HR Specialist"].includes(getNormalizedRole());
}

function canDeleteDepartments() {
  return ["Admin"].includes(getNormalizedRole());
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
  return ["Admin", "Factory Manager"].includes(getNormalizedRole());
}

function canDeleteProducts() {
  return ["Admin", "Factory Manager"].includes(getNormalizedRole());
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
        : `<div class="panel"><p class="loading">You have read-only access to product definitions and standards.</p></div>`
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
  return ["Admin", "Factory Manager"].includes(getNormalizedRole());
}

function canDeleteMachines() {
  return ["Admin", "Factory Manager"].includes(getNormalizedRole());
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
        : canUpdateMachineStatusOnly()
          ? `<div class="panel"><p class="loading">Production Supervisor can monitor machines and update machine status. Machine create/delete is restricted to Admin and Factory Manager.</p></div>`
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
  return ["Admin", "Factory Manager", "Production Supervisor"].includes(getNormalizedRole());
}

function canDeleteProductionRecords() {
  return ["Admin", "Factory Manager"].includes(getNormalizedRole());
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
        : canQualityEditProductionRecordsOnly()
          ? `<div class="panel"><p class="loading">Quality Control can review production records and validate defect/quality information. Production quantity editing is restricted.</p></div>`
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

  if (!["Admin", "Factory Manager"].includes(getNormalizedRole())) {
    state.selectedEmployeeReportId = null;
    state.selectedEmployeeReportName = null;
    state.currentView = "dashboard";
    renderDashboard();
    updateActiveNav();
    return;
  }

  const view = document.getElementById("view");

  view.innerHTML = `
    ${renderTopbar(
      "Employee Report Center",
      "Search employees and open automatic performance reports."
    )}
    <div class="loading">Loading employee reports...</div>
  `;

  try {
    const [summaryResponse, recordsResponse, departmentResponse] = await Promise.all([
      apiRequest("/reports/summary"),
      apiRequest("/production-records"),
      apiRequest("/reports/department-performance")
    ]);

    const summary = summaryResponse.data || {};
    const records = Array.isArray(recordsResponse.data) ? recordsResponse.data : [];
    const departments = Array.isArray(departmentResponse.data) ? departmentResponse.data : [];

    const employeeReports = buildEmployeeReportProfiles(records, departments);

    if (state.selectedEmployeeReportId) {
      const profile = employeeReports.find(
        (item) => String(item.employeeId) === String(state.selectedEmployeeReportId)
      );

      view.innerHTML = renderSingleEmployeeSmartReport(profile, employeeReports, summary);
      bindBackToReportCenter();
      return;
    }

    view.innerHTML = `
      ${renderTopbar(
        "Employee Report Center",
        "Search employees and open automatic performance reports."
      )}

      <section class="smart-report-hero">
        <div>
          <span>Management Report Directory</span>
          <h2>Employee-based performance reports</h2>
          <p>
            The system evaluates each employee using production output, quality, attendance,
            continuity and on-time completion data. Open a report to view the full automatic
            score-based decision template.
          </p>
        </div>

        <div class="smart-report-score">
          <small>Average Score</small>
          <strong>${summary.averagePerformanceScore || 0}</strong>
          <span>${employeeReports.length} Employee Profiles</span>
        </div>
      </section>

      <section class="smart-kpi-grid">
        ${renderSmartKpi("Employees", summary.totalEmployees || employeeReports.length, "Employee profiles")}
        ${renderSmartKpi("Records", summary.totalProductionRecords || records.length, "Analyzed records")}
        ${renderSmartKpi("Bonus Eligible", summary.bonusEligibleCount || 0, "Eligible records")}
        ${renderSmartKpi("Promotion", summary.promotionCandidateCount || 0, "Candidate records")}
        ${renderSmartKpi("HR Review", summary.hrReviewRequiredCount || 0, "Follow-up records")}
      </section>

      <section class="smart-directory-card">
        <div class="smart-directory-header">
          <div>
            <h3>Employee Report List</h3>
            <p>
              First 20 employees are listed below. Search by name, employee code or department
              to find another employee.
            </p>
          </div>
          <div class="smart-directory-count">
            <strong>${employeeReports.length}</strong>
            <span>Total Reports</span>
          </div>
        </div>

        <div class="smart-search-row">
          <input
            id="employeeReportSearch"
            class="form-control"
            placeholder="Search employee by name, code or department..."
          />
          <button class="secondary-btn" id="clearEmployeeReportSearchBtn">Clear</button>
        </div>

        <div id="employeeReportList">
          ${renderSmartEmployeeReportList(employeeReports)}
        </div>
      </section>
    `;

    bindReportCenterEvents(employeeReports);
  } catch (error) {
    view.innerHTML = `
      ${renderTopbar("Reports", "Unable to load report data.")}
      <div class="message error" style="display:block;">${error.message}</div>
    `;
  }
}

function renderSmartKpi(label, value, note) {
  return `
    <div class="smart-kpi-card">
      <span>${label}</span>
      <strong>${value}</strong>
      <p>${note}</p>
    </div>
  `;
}

function buildEmployeeReportProfiles(records, departments) {
  const grouped = new Map();

  records.forEach((record) => {
    const employeeId = Number(record.employeeId);
    if (!employeeId) return;

    if (!grouped.has(employeeId)) {
      grouped.set(employeeId, {
        employeeId,
        fullName: record.fullName || record.employeeName || "Unknown Employee",
        employeeCode: record.employeeCode || "Employee Record",
        departmentName: record.departmentName || "-",
        records: []
      });
    }

    grouped.get(employeeId).records.push(record);
  });

  return Array.from(grouped.values())
    .map((employee) => createEmployeeProfile(employee, departments))
    .sort((a, b) => b.score - a.score);
}

function profileAverage(records, key) {
  if (!records.length) return 0;
  const total = records.reduce((sum, item) => sum + Number(item[key] || 0), 0);
  return Math.round((total / records.length) * 100) / 100;
}

function createEmployeeProfile(employee, departments) {
  const records = employee.records;
  const latest = records[0] || {};

  const score = profileAverage(records, "overallPerformanceScore");
  const qualityScore = profileAverage(records, "qualityScore");
  const continuityScore = profileAverage(records, "continuityScore");
  const onTimeScore = profileAverage(records, "onTimeCompletionScore");

  const totalTarget = records.reduce((sum, item) => sum + Number(item.targetQuantity || 0), 0);
  const totalActual = records.reduce((sum, item) => sum + Number(item.actualQuantity || 0), 0);
  const totalDefective = records.reduce((sum, item) => sum + Number(item.defectiveQuantity || 0), 0);
  const absentDays = records.reduce((sum, item) => sum + Number(item.absentDays || 0), 0);
  const lateDays = records.reduce((sum, item) => sum + Number(item.lateDays || 0), 0);

  const departmentRows = departments.filter((item) => item.departmentName === employee.departmentName);
  const departmentAverage = departmentRows.length
    ? Number(departmentRows[0].averagePerformanceScore || 0)
    : 0;

  const trend = calculateProfileTrend(records);
  const badges = calculateSmartBadges(score, qualityScore, continuityScore, onTimeScore, absentDays, lateDays);
  const decision = calculateSmartDecision(score, qualityScore, continuityScore, onTimeScore, absentDays, lateDays);
  const bonus = calculateBonusStatus(score, qualityScore, continuityScore);
  const promotion = calculatePromotionStatus(score, qualityScore, continuityScore, onTimeScore);

  return {
    ...employee,
    latest,
    score,
    qualityScore,
    continuityScore,
    onTimeScore,
    totalTarget,
    totalActual,
    totalDefective,
    absentDays,
    lateDays,
    departmentAverage,
    trend,
    badges,
    decision,
    bonus,
    promotion,
    recordCount: records.length
  };
}

function calculateSmartBadges(score, quality, continuity, onTime, absent, late) {
  const badges = [];

  if (score >= 90 && quality >= 90 && continuity >= 85) {
    badges.push("🏆 Bonus Earned");
  }

  if (score >= 92 && quality >= 90 && continuity >= 90 && onTime >= 85) {
    badges.push("🚀 Promotion Candidate");
  }

  if (score >= 96 && quality >= 95 && absent <= 1) {
    badges.push("⭐ Star of the Month");
  }

  if (score < 75 || quality < 75 || continuity < 75 || absent >= 4 || late >= 4) {
    badges.push("⚠️ Needs Improvement");
  }

  if (!badges.length) {
    badges.push("✅ Stable Performance");
  }

  return badges;
}

function calculateSmartDecision(score, quality, continuity, onTime, absent, late) {
  if (score >= 95 && quality >= 95 && continuity >= 90) {
    return "Outstanding Performer";
  }

  if (score >= 90 && quality >= 90 && continuity >= 85) {
    return "High Performer";
  }

  if (score >= 80) {
    return "Stable Performer";
  }

  if (score >= 65) {
    return "Needs Improvement";
  }

  return "Critical Review Required";
}

function calculateBonusStatus(score, quality, continuity) {
  if (score >= 90 && quality >= 90 && continuity >= 85) {
    return {
      eligible: true,
      label: "Bonus Earned",
      band: score >= 96 ? "A+ Barem" : score >= 92 ? "A Barem" : "B Barem",
      note: "Bonus criteria have been met for this evaluation period."
    };
  }

  const missing = Math.max(0, Math.ceil(90 - score));
  return {
    eligible: false,
    label: "Bonus Not Earned",
    band: "-",
    note: `Approximately ${missing} more score points are required to qualify for bonus.`
  };
}

function calculatePromotionStatus(score, quality, continuity, onTime) {
  const percentage = Math.min(
    100,
    Math.round(((score / 92) * 0.45 + (quality / 90) * 0.2 + (continuity / 90) * 0.2 + (onTime / 85) * 0.15) * 100)
  );

  return {
    percentage,
    label: percentage >= 100 ? "Eligible for Promotion" : percentage >= 85 ? "Close to Promotion" : "Not Eligible Yet"
  };
}

function calculateProfileTrend(records) {
  if (records.length < 2) {
    return {
      label: "Not enough data for trend analysis",
      direction: "neutral",
      difference: 0
    };
  }

  const latest = Number(records[0].overallPerformanceScore || 0);
  const previous = Number(records[1].overallPerformanceScore || 0);
  const difference = Math.round((latest - previous) * 100) / 100;

  if (difference > 0) {
    return {
      label: `Compared to the latest previous record +${difference} point increase`,
      direction: "up",
      difference
    };
  }

  if (difference < 0) {
    return {
      label: `Compared to the latest previous record ${difference} point decrease`,
      direction: "down",
      difference
    };
  }

  return {
    label: "Performance is stable",
    direction: "neutral",
    difference
  };
}

function renderSmartEmployeeReportList(employeeReports, query = "") {
  if (!employeeReports.length) {
    return `
      <div class="clean-empty">
        <strong>No employee reports found</strong>
        <p>No employee matched your search.</p>
      </div>
    `;
  }

  const visibleReports = query ? employeeReports : employeeReports.slice(0, 20);

  return `
    <div class="smart-list-info">
      <span>
        ${query
          ? `${visibleReports.length} matching employee(s)`
          : `Showing first ${visibleReports.length} employee(s)`
        }
      </span>
      ${!query && employeeReports.length > 20 ? `<strong>Use search to find remaining employees.</strong>` : ""}
    </div>

    <div class="smart-report-table">
      <div class="smart-report-head">
        <span>Employee</span>
        <span>Score</span>
        <span>Metrics</span>
        <span>Status</span>
        <span>Action</span>
      </div>

      ${visibleReports.map((employee) => `
        <div class="smart-report-row">
          <div class="smart-employee-cell">
            <div class="smart-avatar">
              ${employee.fullName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h4>${employee.fullName}</h4>
              <p>${employee.employeeCode} · ${employee.departmentName}</p>
            </div>
          </div>

          <div class="smart-score-cell">
            <strong>${employee.score}</strong>
            <span>${employee.decision}</span>
          </div>

          <div class="smart-metrics-cell">
            <span>Quality: <strong>${employee.qualityScore}</strong></span>
            <span>Continuity: <strong>${employee.continuityScore}</strong></span>
            <span>Absent/Late: <strong>${employee.absentDays}/${employee.lateDays}</strong></span>
          </div>

          <div class="smart-status-cell">
            ${employee.badges.slice(0, 2).map((badge) => `<span>${badge}</span>`).join("")}
          </div>

          <button class="smart-open-report-btn" data-open-employee-report="${employee.employeeId}">
            Open Report
          </button>
        </div>
      `).join("")}
    </div>
  `;
}

function bindReportCenterEvents(employeeReports) {
  const searchInput = document.getElementById("employeeReportSearch");
  const clearButton = document.getElementById("clearEmployeeReportSearchBtn");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    const filteredReports = employeeReports.filter((employee) => {
      return (
        employee.fullName.toLowerCase().includes(query) ||
        employee.employeeCode.toLowerCase().includes(query) ||
        employee.departmentName.toLowerCase().includes(query)
      );
    });

    document.getElementById("employeeReportList").innerHTML =
      renderSmartEmployeeReportList(filteredReports, query);

    bindOpenReportButtons(employeeReports);
  });

  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    document.getElementById("employeeReportList").innerHTML =
      renderSmartEmployeeReportList(employeeReports);

    bindOpenReportButtons(employeeReports);
  });

  bindOpenReportButtons(employeeReports);
}

function bindOpenReportButtons(employeeReports) {
  document.querySelectorAll("[data-open-employee-report]").forEach((button) => {
    button.addEventListener("click", () => {
      const employeeId = button.dataset.openEmployeeReport;
      const employee = employeeReports.find((item) => String(item.employeeId) === String(employeeId));

      state.selectedEmployeeReportId = employeeId;
      state.selectedEmployeeReportName = employee ? employee.fullName : "Selected Employee";

      renderReports();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function bindBackToReportCenter() {
  const button = document.getElementById("backToReportCenterBtn");
  if (!button) return;

  button.addEventListener("click", () => {
    state.selectedEmployeeReportId = null;
    state.selectedEmployeeReportName = null;
    renderReports();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function renderSingleEmployeeSmartReport(profile, employeeReports, summary) {
  if (!profile) {
    return `
      ${renderTopbar("Employee Report", "No report data found.")}
      <button class="secondary-btn" id="backToReportCenterBtn">Back to Report Center</button>
      <div style="margin-top:18px;">
        ${renderEmptyState(
          "No personal report found",
          "This employee does not have reportable production records."
        )}
      </div>
    `;
  }

  const departmentCompare = profile.departmentAverage
    ? profile.score >= profile.departmentAverage
      ? `${Math.round((profile.score - profile.departmentAverage) * 100) / 100} points above department average`
      : `${Math.round((profile.departmentAverage - profile.score) * 100) / 100} points below department average`
    : "Department average is not available";

  const strengths = generateStrengths(profile);
  const improvements = generateImprovements(profile);
  const nextSteps = generateNextSteps(profile);

  return `
    ${renderTopbar(
      "Employee Smart Performance Report",
      `Automatic score-based report for ${profile.fullName}.`
    )}

    <button class="secondary-btn" id="backToReportCenterBtn">Back to Report Center</button>

    <section class="smart-personal-report">
      <div class="smart-personal-hero">
        <div>
          <span>Confidential Performance Report</span>
          <h2>${profile.fullName}</h2>
          <p>${profile.employeeCode} · ${profile.departmentName} · ${profile.recordCount} evaluated record(s)</p>
        </div>

        <div class="smart-personal-score">
          <small>General Efficiency Score</small>
          <strong>${profile.score}</strong>
          <span>${profile.decision}</span>
        </div>
      </div>

      <div class="smart-badge-strip">
        ${profile.badges.map((badge) => `<span>${badge}</span>`).join("")}
      </div>

      <div class="smart-detail-grid">
        <div class="smart-detail-card">
          <h3>1. General Evaluation</h3>
          <table>
            <tbody>
              <tr><th>General Efficiency Score</th><td>${profile.score} / 100</td></tr>
              <tr><th>System Decision</th><td>${profile.decision}</td></tr>
              <tr><th>Trend</th><td>${profile.trend.label}</td></tr>
              <tr><th>Department Comparison</th><td>${departmentCompare}</td></tr>
            </tbody>
          </table>
        </div>

        <div class="smart-detail-card">
          <h3>2. Performance Metrics</h3>
          <table>
            <tbody>
              <tr><th>Completed Work</th><td>${profile.totalActual} / ${profile.totalTarget}</td></tr>
              <tr><th>Speed / Time Management</th><td>${profile.onTimeScore} / 100</td></tr>
              <tr><th>Quality Score</th><td>${profile.qualityScore} / 100</td></tr>
              <tr><th>Attendance Continuity</th><td>${profile.continuityScore} / 100</td></tr>
              <tr><th>Absence / Late Arrival</th><td>${profile.absentDays} / ${profile.lateDays}</td></tr>
            </tbody>
          </table>
        </div>

        <div class="smart-detail-card">
          <h3>3. Bonus and Career Eligibility</h3>
          <table>
            <tbody>
              <tr><th>Bonus Status</th><td>${profile.bonus.label}</td></tr>
              <tr><th>Bonus Band</th><td>${profile.bonus.band}</td></tr>
              <tr><th>Bonus Note</th><td>${profile.bonus.note}</td></tr>
              <tr><th>Promotion Status</th><td>${profile.promotion.label}</td></tr>
              <tr><th>Promotion Criteria Completion</th><td>${profile.promotion.percentage}%</td></tr>
            </tbody>
          </table>
        </div>

        <div class="smart-detail-card">
          <h3>4. Analysis and Trends</h3>
          <table>
            <tbody>
              <tr><th>Trend Analysis</th><td>${profile.trend.label}</td></tr>
              <tr><th>Department Average</th><td>${profile.departmentAverage || "N/A"}</td></tr>
              <tr><th>Employee Score</th><td>${profile.score}</td></tr>
              <tr><th>Comparison</th><td>${departmentCompare}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="smart-advice-section">
        <div>
          <h3>Strengths</h3>
          <ul>${strengths.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div>
          <h3>Areas for Improvement</h3>
          <ul>${improvements.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div>
          <h3>System Recommendation / Next Steps</h3>
          <ul>${nextSteps.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
      </div>

      <div class="smart-report-note">
        <h3>Automatic Report Summary</h3>
        <p>
          ${generateExecutiveReportText(profile, departmentCompare)}
        </p>
      </div>
    </section>
  `;
}

function generateStrengths(profile) {
  const items = [];

  if (profile.score >= 90) items.push("The employee has a high overall performance score.");
  if (profile.qualityScore >= 90) items.push("The quality score is strong and the defect rate is under control.");
  if (profile.continuityScore >= 90) items.push("Attendance Continuity ve dakiklik performansı başarılıdır.");
  if (profile.onTimeScore >= 85) items.push("The employee performs well in completing work on time.");
  if (!items.length) items.push("The employee's current performance is at a monitorable level.");

  return items;
}

function generateImprovements(profile) {
  const items = [];

  if (profile.qualityScore < 85) items.push("The quality score should be improved and the defect rate should be reduced.");
  if (profile.continuityScore < 85) items.push("Absence and late arrival patterns should be monitored closely.");
  if (profile.onTimeScore < 80) items.push("Time management and delivery discipline should be improved.");
  if (profile.score < 80) items.push("Overall productivity performance should be supported with an improvement plan.");
  if (!items.length) items.push("There is no critical improvement area; the current performance level should be maintained.");

  return items;
}

function generateNextSteps(profile) {
  if (profile.decision === "Outstanding Performer" || profile.decision === "High Performer") {
    return [
      "The employee can be included in the bonus evaluation process.",
      "The employee can be considered for a management review regarding promotion or leadership potential.",
      "A motivation reward can be planned to sustain high performance."
    ];
  }

  if (profile.decision === "Needs Improvement") {
    return [
      "A short-term performance monitoring plan should be prepared for the employee.",
      "Quality and time management metrics should be reviewed weekly.",
      "If necessary, a mentoring process with an experienced employee should be started."
    ];
  }

  if (profile.decision === "Critical Review Required") {
    return [
      "A formal review meeting should be held with HR and the relevant manager.",
      "The causes of absence, quality issues or production performance problems should be analyzed.",
      "An improvement plan and follow-up schedule should be documented."
    ];
  }

  return [
    "The current performance should be monitored regularly.",
    "Quality and attendance continuity targets can be strengthened to move the score above 90.",
    "Trend changes should be checked in the next evaluation period."
  ];
}

function generateExecutiveReportText(profile, departmentCompare) {
  return `${profile.fullName} has been evaluated based on ${profile.recordCount} production record(s) in the ${profile.departmentName} department. The employee has a general efficiency score of ${profile.score}/100. The quality score is ${profile.qualityScore}, the continuity score is ${profile.continuityScore}, and the on-time completion score is ${profile.onTimeScore}. The employee's absence/late arrival status is ${profile.absentDays}/${profile.lateDays}. The final system-assigned status is "${profile.decision}", and the bonus result is "${profile.bonus.label}". In department comparison, ${departmentCompare}. Based on these results, the recommended action is: ${generateNextSteps(profile)[0]}`;
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