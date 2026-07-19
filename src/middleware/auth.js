import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS = createRemoteJWKSet(
  new URL("https://player-auth.services.api.unity.com/.well-known/jwks.json")
);

export async function verifyUnityToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Missing Bearer token",
      });
    }

    const token = authHeader.substring(7);

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: "https://player-auth.services.api.unity.com",
    });

    if (
      process.env.UNITY_PROJECT_ID &&
      payload.project_id !== process.env.UNITY_PROJECT_ID
    ) {
      return res.status(403).json({
        error: "Invalid Unity project"
      })
    }

    req.playerId = payload.sub;
    req.player = payload.sub;

    next();
  }
  catch(err) {
    console.error(err);

    return res.status(401).json({
      error: "Invalid token",
    });
  }
}