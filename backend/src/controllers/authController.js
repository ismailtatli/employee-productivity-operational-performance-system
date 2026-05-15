const authService = require("../services/authService");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json({
      message: "Login successful.",
      token: result.token,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.user.id);

    res.status(200).json({
      user
    });
  } catch (error) {
    next(error);
  }
}

function logout(req, res) {
  res.status(200).json({
    message: "Logout successful. Please remove the token on the client side."
  });
}

module.exports = {
  login,
  me,
  logout
};