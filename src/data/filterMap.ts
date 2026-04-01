const hasAnyRole = (...require: string[]) => (roles: string) => roles.split(/\s*,\s*/).some(role => require.includes(role));
export const PermitAll = Symbol('PermitAll');
export type FilterCondition = { path: string; access: typeof PermitAll | ((roles: string) => boolean); exp: RegExp };

export const filterMap = [
  { path: '/admin/login', access: PermitAll },
  { path: '/admin/403', access: PermitAll },
  { path: '/admin/404', access: PermitAll },
  { path: '/admin/main**', access: hasAnyRole('MASTER', 'ADMIN', 'MANAGER') },
  { path: '/admin/project**', access: hasAnyRole('MASTER', 'ADMIN', 'MANAGER') },
  { path: '/admin/manager**', access: hasAnyRole('MASTER', 'ADMIN') },
  { path: '/admin/**', access: hasAnyRole('MASTER', 'ADMIN', 'MANAGER') },
]
  .map(row => ({ ...row, exp: new RegExp(`^${row.path.replace('**', '++').replace('*', '[^/]*').replace('++', '.*')}$`) })) as FilterCondition[];