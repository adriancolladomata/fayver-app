export const requireAuth = (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'No autorizado'})
  }
}
