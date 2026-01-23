export const gatewaySecurity = (req, _res, next) => {
  req.headers['x-internal-key'] = process.env.INTERNAL_KEY;
  next();
};
