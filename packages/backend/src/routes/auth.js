import express from 'express';

export const createAuthRouter = (userRepository) => {
  const router = express.Router();

  router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Bad Request', message: 'Email e password são obrigatórios' });
    }

    const user = userRepository.validateCredentials(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Credenciais inválidas' });
    }

    const token = Buffer.from(`${email}:${password}`).toString('base64');

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenant_id: user.tenant_id || null,
      },
      token,
    });
  });

  return router;
};

export default createAuthRouter;
