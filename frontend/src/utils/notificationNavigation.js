export function getNotificationLink(notif) {
  if (!notif) return '/notifications';

  let meta = {};
  try {
    meta = typeof notif.metadata_json === 'string'
      ? JSON.parse(notif.metadata_json)
      : (notif.metadata_json || {});
  } catch (e) {
    meta = {};
  }

  // 1. Support Tickets
  if (meta.ticketId || notif.source_type?.startsWith('support.ticket')) {
    const rolePrefix = notif.for_role === 'super_admin' ? '/super-admin' : '/dashboard';
    return `${rolePrefix}`;
  }

  // 2. Security Alerts / MDM Device Exceeded
  if (notif.source_type === 'auth.security' || notif.type === 'Security' || meta.resourceType === 'active_devices') {
    return '/dashboard';
  }

  // 3. User Approvals
  if (notif.type === 'Approval' || meta.resourceType === 'active_users') {
    return notif.for_role === 'super_admin' ? '/super-admin' : '/admin';
  }

  // 4. Learning Resources
  if (notif.source_type === 'learning' || meta.resourceType === 'learning') {
    return '/learning';
  }

  // 5. Todos
  if (notif.source_type === 'todos' || meta.resourceType === 'todos') {
    return '/todos';
  }

  // 6. Projects
  if (notif.source_type === 'projects' || meta.resourceType === 'projects') {
    return '/projects';
  }

  // 7. Custom direct link in metadata
  if (meta.link) {
    return meta.link;
  }

  return '/notifications';
}

