import jwt from 'jsonwebtoken';

export const verifyUnityToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ error: "Missing token" })
  
  const token = authHeader.split(" ")[1];

  try {
    const decode = jwt.decode(token);

    req.playerId = decode?.sub;

    next();
  }
  catch(err) {
    return res.status(401).json({ error:"Invalid token" })
  }
}