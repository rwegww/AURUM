export const parseAdminMutationResponse = async (res) => {
  const data = await res.json().catch(() => ({}));

  if (res.status === 202 && data?.requiresSecondAdminApproval) {
    return {
      pendingApproval: true,
      data,
      message: data.message || 'Yêu cầu đã được tạo và đang chờ quản trị viên còn lại xác nhận.',
    };
  }

  if (!res.ok) {
    throw new Error(data.message || data.error || 'Thao tác không thành công.');
  }

  return {
    pendingApproval: false,
    data,
    message: data.message || (data.approval ? 'Thay đổi đã được hai quản trị viên xác nhận và thực thi.' : ''),
  };
};

export const notifyAdminApprovalResult = (result) => {
  if (!result?.message) return;
  window.alert(result.message);
};
