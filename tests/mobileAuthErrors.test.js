import { describe, expect, it } from "vitest";
import {
  AUTH_ERROR_CODES,
  resolveAuthFailure
} from "../apps/mobile/services/authErrors.js";

const apiError = (status, error, message) => ({
  status,
  message: message || error,
  payload: { error, ...(message ? { message } : {}) }
});

describe("xử lý lỗi xác thực trên mobile", () => {
  it.each([
    [
      AUTH_ERROR_CODES.ACCOUNT_LOCKED,
      "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên."
    ],
    [
      AUTH_ERROR_CODES.PRIVILEGED_ACCOUNT_LINK_REQUIRED,
      "Tài khoản quản trị hoặc giáo viên cần liên kết đăng nhập Google từ hồ sơ hiện tại."
    ]
  ])("hủy phiên và dùng thông báo tiếng Việt cho lỗi 403 %s", (code, message) => {
    expect(resolveAuthFailure(apiError(403, code))).toEqual({
      code,
      message,
      shouldInvalidateSession: true
    });
  });

  it("không đăng xuất với lỗi 403 phân quyền thông thường", () => {
    expect(resolveAuthFailure(apiError(403, "FORBIDDEN", "Bạn không có quyền thực hiện thao tác này.")))
      .toEqual({
        code: "FORBIDDEN",
        message: "Bạn không có quyền thực hiện thao tác này.",
        shouldInvalidateSession: false
      });
  });

  it("hủy phiên khi refresh profile hoặc heartbeat nhận lỗi 401", () => {
    expect(resolveAuthFailure(apiError(401, "INVALID_SESSION", "Phiên đăng nhập không còn hợp lệ.")))
      .toMatchObject({
        code: "INVALID_SESSION",
        message: "Phiên đăng nhập không còn hợp lệ.",
        shouldInvalidateSession: true
      });
  });

  it("chuẩn hóa thông báo đăng nhập trên thiết bị khác", () => {
    expect(resolveAuthFailure(apiError(401, AUTH_ERROR_CODES.DUAL_LOGIN))).toMatchObject({
      message: "Phiên đăng nhập đã hết hạn vì tài khoản đang được đăng nhập ở thiết bị khác.",
      shouldInvalidateSession: true
    });
  });
});
