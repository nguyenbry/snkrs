const ERROR_TYPES = {
  EXPECTED: "EXPECTED",
  UNEXPECTED: "UNEXPECTED",
}

function applyStatusAndError(res, code, error, type) {
  return res.status(code).json({ message: error, type })
}

module.exports = {
  applyStatusAndError,
  ERROR_TYPES,
}
