import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import dotenv from "dotenv";

dotenv.config();

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}/discovery/v2.0/keys`,
});

// Function to get the signing key from JWKS
async function getSigningKey(kid: string): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err) {
        reject(err);
      } else {
        const signingKey = key?.getPublicKey();
        resolve(signingKey);
      }
    });
  });
}

// Middleware to verify token
async function verifyToken(token: string) {
  try {
    const decodedHeader: any = jwt.decode(token, { complete: true });

    if (!decodedHeader || !decodedHeader.header || !decodedHeader.header.kid) {
      throw new Error("Invalid token header.");
    }

    const signingKey = await getSigningKey(decodedHeader.header.kid);
    if (!signingKey) {
      throw new Error("Could not get signing key.");
    }

    return jwt.verify(token, signingKey, {
      algorithms: ["RS256"],
      audience: `${process.env.NEXT_PUBLIC_AZURE_BACKEND_APP_ID}`,
      issuer: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}/v2.0`,
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    // Mock protected data
    const products = [
      { name: "Laptop", price: 1000 },
      { name: "Mouse", price: 50 },
      { name: "Keyboard", price: 100 },
    ];

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error in authentication:", error);
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}
