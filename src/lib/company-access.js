export function companyPermissionForPath(path) {
  if (path === '/company/dashboard') return 'overview:view';
  if (path === '/company/projects/new') return 'projects:manage';
  if (/^\/company\/projects\/[^/]+\/(submissions|compare|evaluation)$/.test(path)) return 'evaluations:manage';
  if (/^\/company\/projects\/[^/]+\/decision$/.test(path)) return 'hiring:manage';
  if (/^\/company\/projects\/[^/]+\/matches$/.test(path)) return 'talent:view';
  if (/^\/company\/projects\/[^/]+\/analysis$/.test(path)) return 'projects:manage';
  if (path.startsWith('/company/projects')) return 'projects:view';
  if (path.startsWith('/company/talent')) return 'talent:view';
  if (/^\/company\/(hiring|interviews|offers)(\/|$)/.test(path)) return 'hiring:manage';
  if (path === '/company/evaluations') return 'evaluations:manage';
  if (['/company/profile', '/company/verification'].includes(path)) return 'company:manage';
  if (path === '/company/team') return 'team:view';
  if (path === '/company/payments') return 'finance:view';
  if (path === '/company/settings') return 'settings:manage';
  if (path === '/company/notifications') return 'notifications:view';
  return null;
}
export function canUseCompanyPath(user, path) {
  const permission = companyPermissionForPath(path);
  return Boolean(permission && user?.companyAccess?.permissions.includes(permission));
}
