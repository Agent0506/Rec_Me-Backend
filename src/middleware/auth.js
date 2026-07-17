import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS = createRemoteJWKSet(
    new URL("https://player-auth.services.api.unity.com/.well-known/jwks.json")
);

export async function verifyUnityToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Missing bearer token"
            });
        }

        const token = authHeader.substring(7);

        const { payload } = await jwtVerify(token, JWKS, {
            issuer: "https://player-auth.services.api.unity.com",
        });

        // Dočasně vypiš payload do logů
        console.log("Unity JWT payload:", payload);

        if (!payload.sub) {
            return res.status(401).json({
                error: "Token does not contain 'sub' claim"
            });
        }

        req.playerId = payload.sub;
        req.user = payload;

        next();

    } catch (err) {
        console.error("JWT verification failed:", err);

        return res.status(401).json({
            error: "Invalid or expired token"
        });
    }
}