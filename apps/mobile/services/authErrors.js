export const AUTH_ERROR_CODES = Object.freeze({
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED",
  PRIVILEGED_ACCOUNT_LINK_REQUIRED: "PRIVILEGED_ACCOUNT_LINK_REQUIRED",
  DUAL_LOGIN: "DUAL_LOGIN"
});

const AUTH_ERROR_MESSAGES = Object.freeze({
  [AUTH_ERROR_CODES.ACCOUNT_LOCKED]:
    "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
  [AUTH_ERROR_CODES.PRIVILEGED_ACCOUNT_LINK_REQUIRED]:
    "Tài khoản quản trị hoặc giáo viên cần liên kết đăng nhập Google từ hồ sơ hiện tại.",
  [AUTH_ERROR_CODES.DUAL_LOGIN]:
    "Phiên đăng nhập đã hết hạn vì tài khoản đang được đăng nhập ở thiết bị khác."
});

const SESSION_TERMINATING_403_CODES = new Set([
  AUTH_ERROR_CODES.ACCOUNT_LOCKED,
  AUTH_ERROR_CODES.PRIVILEGED_ACCOUNT_LINK_REQUIRED
]);

const normalizeString = (value) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

export const getAuthErrorCode = (error) =>
  normalizeString(error?.payload?.error) || normalizeString(error?.code);

export const getAuthErrorMessage = (error) => {
  const code = getAuthErrorCode(error);
  if (code && AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code];

  return normalizeString(error?.payload?.message)
    || normalizeString(error?.message)
    || "Không thể xác thực tài khoản. Vui lòng thử lại.";
};

export const resolveAuthFailure = (error) => {
  const status = Number(error?.status);
  const code = getAuthErrorCode(error);

  return {
    code,
    message: getAuthErrorMessage(error),
    shouldInvalidateSession:
      status === 401 || (status === 403 && SESSION_TERMINATING_403_CODES.has(code))
  };
};
