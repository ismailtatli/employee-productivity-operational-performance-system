const ADMIN_OWNER_ID = 1;

function canAccessAllData(user) {
  return Boolean(user);
}

// Every route already checks role permissions.
// If a role is allowed to open a module, that role must read ALL records in that module.
function getReadScopeUserId(user) {
  return user ? null : undefined;
}

// New records are written to the shared demo workspace so registered users
// with the same role behave like the demo users and can use existing related data.
function getWriteScopeUserId(user) {
  return user ? ADMIN_OWNER_ID : undefined;
}

module.exports = {
  canAccessAllData,
  getReadScopeUserId,
  getWriteScopeUserId
};
