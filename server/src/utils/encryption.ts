import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.JWT_SIGNING_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(userId: string, expiresAt: number | string | Date = "1h") {
    return new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expiresAt)
        .sign(encodedKey);
}

export async function decrypt(data: string | undefined = "") {
    try {
        const { payload } = await jwtVerify(data, encodedKey, { algorithms: ["HS256"] });
        return {
            ok: true,
            payload: payload as { userId: string },
        };
    } catch (error) {
        return {
            ok: false,
            payload: null,
            error: error as { code: string },
        };
    }
}
