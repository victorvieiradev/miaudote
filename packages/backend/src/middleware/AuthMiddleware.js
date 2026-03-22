/**
 * Middleware de Autenticação para Administrador
 * Valida credenciais via header Authorization (Basic Auth)
 * Usa UserRepository para abstração de persistência
 */

/**
 * Decode Basic Auth header
 * Formato esperado: "Basic base64(email:password)"
 * @param {string} authHeader - Header Authorization
 * @returns {Object|null} {email, password} ou null se inválido
 */
const decodeBasicAuth = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return null;
  }

  try {
    const base64Credentials = authHeader.slice(6);
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [email, password] = credentials.split(':');
    return { email, password };
  } catch (error) {
    return null;
  }
};

/**
 * Factory para criar middleware de autenticação
 * Permite injeção de dependência do UserRepository
 * @param {UserRepository} userRepository - Instância do UserRepository
 * @returns {Function} Middleware function
 */
export const createAuthMiddleware = (userRepository) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Header Authorization é obrigatório para essa operação',
      });
    }

    const credentials = decodeBasicAuth(authHeader);

    if (!credentials) {
      return res.status(401).json({
        error: 'Invalid Authorization Header',
        message: 'Header Authorization malformado',
      });
    }

    const { email, password } = credentials;

    const user = userRepository.validateCredentials(email, password);
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Credenciais inválidas',
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      tenant_id: user.tenant_id || null,
    };
    req.tenantId = req.user.role === 'superadmin' ? null : req.user.tenant_id;

    return next();
  };
};

export default createAuthMiddleware;
