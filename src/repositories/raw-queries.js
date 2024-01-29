function getUserEmail(userId) {
  return `SELECT email FROM Users where id = ${userId};`;
}

module.exports = {
  getUserEmail,
};
