const API_BASE_URL = "http://localhost:5001/api";

const state = {
  token: localStorage.getItem("tatlee_token"),
  user: JSON.parse(localStorage.getItem("tatlee_user") || "null"),
  currentView: "dashboard"
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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

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

  if (
    value.includes("Monitor") ||
    value.includes("Needs")
  ) {
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

function renderLogin() {
  app.innerHTML = `
    <section class="login-page">
      <div class="login-brand">
        <div>
          <div class="brand-badge">
            <div class="brand-mark">TF</div>
            <span>Authorized Factory Management Portal</span>
          </div>

          <h1>Operational performance starts with measurable work.</h1>
<p>
  TatLee Factory uses this system to manage employees, departments,
  production records, quality indicators, continuity scores and
  performance-based recommendations through a secure internal dashboard.
</p>

          <div class="login-highlights">
            <div class="highlight-card">
              <strong>KPI</strong>
              <span>Production, quality, on-time completion and continuity tracking</span>
            </div>
            <div class="highlight-card">
              <strong>RBAC</strong>
              <span>Role-based authorized access for factory users</span>
            </div>
            <div class="highlight-card">
              <strong>Reports</strong>
              <span>Bonus, promotion, monitoring and HR review recommendations</span>
            </div>
          </div>
        </div>

        <p>System Analysis and Design Project · Spring 2026</p>
      </div>

      <div class="login-panel-wrap">
        <form class="login-panel" id="loginForm">
          <h2>Sign in</h2>
          <p class="subtitle">
            Use one of the authorized TatLee Factory accounts to access the system.
          </p>

          <div id="loginError" class="login-error"></div>

          <div class="form-group">
            <label>Email</label>
            <input class="form-control" id="email" type="email" value="admin@tatleefactory.com" />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input class="form-control" id="password" type="password" value="TatLee123" />
          </div>

          <button class="primary-btn" type="submit">Login to Dashboard</button>

          <div class="demo-box">
            <strong>Demo users</strong><br />
            admin@tatleefactory.com · Admin<br />
            manager@tatleefactory.com · Manager<br />
            production@tatleefactory.com · Production<br />
            quality@tatleefactory.com · Quality<br />
            viewer@tatleefactory.com · Viewer<br />
            Password: TatLee123
          </div>
        </form>
      </div>
    </section>
  `;

  document.getElementById("loginForm").addEventListener("submit", handleLogin);
}

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("loginError");

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
            <span>Operational Performance Portal</span>
          </div>
        </div>

        <nav class="nav-menu">
          ${navButton("dashboard", "Dashboard")}
          ${navButton("employees", "Employees")}
          ${navButton("departments", "Departments")}
          ${navButton("production", "Production Records")}
          ${navButton("reports", "Reports")}
        </nav>

        <div class="sidebar-footer">
          <strong>${state.user.fullName}</strong>
          <span>${state.user.email}</span><br />
          <span>Role: ${state.user.role}</span>
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
  if (state.currentView === "dashboard") renderDashboard();
  if (state.currentView === "employees") renderPlaceholder("Employees", "Employee management screen will be connected in the next step.");
  if (state.currentView === "departments") renderPlaceholder("Departments", "Department management screen will be connected in the next step.");
  if (state.currentView === "production") renderPlaceholder("Production Records", "Production records and performance analysis screen will be connected in the next step.");
  if (state.currentView === "reports") renderPlaceholder("Reports", "Detailed operational reports will be connected in the next step.");
}

function renderTopbar(title, subtitle) {
  return `
    <div class="topbar">
      <div>
        <h2>${title}</h2>
        <p>${subtitle}</p>
      </div>
      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
        <span class="role-pill">${state.user.role}</span>
        <span class="role-pill" style="background:#f1f5f9; color:#334155; border-color:#e2e8f0;">
          TatLee Factory
        </span>
      </div>
    </div>
  `;
}

async function renderDashboard() {
  const view = document.getElementById("view");

  view.innerHTML = `
    ${renderTopbar(
      "Dashboard",
      "Overview of employee productivity, operational performance and recommendation indicators."
    )}
    <div class="loading">Loading dashboard data...</div>
  `;

  try {
    const summaryResponse = await apiRequest("/reports/summary");
    const topPerformersResponse = await apiRequest("/reports/top-performers");
    const departmentResponse = await apiRequest("/reports/department-performance");

    const summary = summaryResponse.data;
    const topPerformers = topPerformersResponse.data;
    const departments = departmentResponse.data;

    view.innerHTML = `
      ${renderTopbar(
        "Dashboard",
        "Overview of employee productivity, operational performance and recommendation indicators."
      )}

      <section class="card-grid">
        ${metricCard("Total Employees", summary.totalEmployees)}
        ${metricCard("Active Employees", summary.activeEmployees)}
        ${metricCard("Avg. Performance", `${summary.averagePerformanceScore}`)}
        ${metricCard("Avg. Quality", `${summary.averageQualityScore}`)}
        ${metricCard("Avg. Continuity", `${summary.averageContinuityScore}`)}
        ${metricCard("Bonus Eligible", summary.bonusEligibleCount)}
        ${metricCard("Promotion Candidates", summary.promotionCandidateCount)}
        ${metricCard("HR Review Required", summary.hrReviewRequiredCount)}
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
    `;
  } catch (error) {
    view.innerHTML = `
      ${renderTopbar("Dashboard", "Unable to load dashboard data.")}
      <div class="message error" style="display:block;">${error.message}</div>
    `;
  }
}

function metricCard(label, value) {
  return `
    <div class="metric-card">
      <span>${label}</span>
      <strong>${value ?? 0}</strong>
    </div>
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

function renderPlaceholder(title, text) {
  document.getElementById("view").innerHTML = `
    ${renderTopbar(title, text)}
    <div class="panel">
      <h3>${title}</h3>
      <p class="loading">${text}</p>
    </div>
  `;
}

renderApp();