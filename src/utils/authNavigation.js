const getRoleHome = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'teacher') return '/teacher';
  return '/';
};

const canVisitManagementPath = (pathname, role) => {
  if (pathname.startsWith('/admin')) return role === 'admin';
  if (pathname.startsWith('/teacher')) return role === 'teacher' || role === 'admin';
  return true;
};

export const getPostLoginPath = (user, from) => {
  const pathname = from?.pathname;
  if (
    typeof pathname === 'string'
    && pathname.startsWith('/')
    && pathname !== '/login'
    && canVisitManagementPath(pathname, user?.role)
  ) {
    return `${pathname}${from.search || ''}${from.hash || ''}`;
  }

  return getRoleHome(user?.role);
};

