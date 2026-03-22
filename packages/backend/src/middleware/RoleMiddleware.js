export const requireRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Usuário não autenticado' });
  }

  if (req.user.role !== role) {
    return res.status(403).json({ error: 'Forbidden', message: 'Permissão insuficiente' });
  }

  next();
};

export const requireTenant = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Usuário não autenticado' });
  }

  if (!req.tenantId) {
    return res.status(403).json({ error: 'Forbidden', message: 'TenantId obrigatório para operação' });
  }

  next();
};
