
import { NextRequest, NextResponse } from "next/server";
import { importSPKI, jwtVerify } from "jose";

const PUBLIC_PATHS = ["/", "/login", "/register"];

const ADMIN_HOME = "/admin/dashboard";
const CUSTOMER_HOME = "/home";

async function getUserRole(
  token: string
): Promise<string | null> {
  try {
    const encodedPublicKey = process.env.JWT_PUBLIC_KEY;

    if (!encodedPublicKey) {
      throw new Error("JWT_PUBLIC_KEY is not configured");
    }

    // Decode Base64 menjadi PEM
    const publicKey = Buffer
      .from(encodedPublicKey.trim(), "base64")
      .toString("utf8")
      .trim();

    // Pastikan hasil decode merupakan PEM SPKI
    if (
      !publicKey.startsWith("-----BEGIN PUBLIC KEY-----") ||
      !publicKey.includes("-----END PUBLIC KEY-----")
    ) {
      throw new Error("Decoded public key is not valid SPKI PEM");
    }

    // Import public key RSA
    const key = await importSPKI(
      publicKey,
      "RS256"
    );

    // Verifikasi signature dan expiration JWT
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["RS256"],
    });

    // Validasi role
    if (
      payload.role !== "ADMIN" &&
      payload.role !== "USER"
    ) {
      return null;
    }

    return payload.role;

  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken =
    request.cookies.get("access_token")?.value;

  const isPublicPage = PUBLIC_PATHS.includes(pathname);

  // User belum login
  if (!accessToken) {
    if (isPublicPage) {
      return NextResponse.next();
    }

    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Verifikasi token dan ambil role
  const role = await getUserRole(accessToken);

  // Token invalid, expired, atau role tidak tersedia
  if (!role) {
    if (isPublicPage) {
      return NextResponse.next();
    }

    const response = NextResponse.redirect(
      new URL("/login", request.url)
    );

    response.cookies.delete("access_token");

    return response;
  }

  // User sudah login tidak boleh membuka public page
  if (isPublicPage) {
    const destination =
      role === "ADMIN"
        ? ADMIN_HOME
        : role === "USER"
          ? CUSTOMER_HOME
          : "/login";

    return NextResponse.redirect(
      new URL(destination, request.url)
    );
  }

  // Proteksi halaman admin
  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN") {
      return NextResponse.redirect(
        new URL(CUSTOMER_HOME, request.url)
      );
    }
  }

  // Proteksi halaman customer
  if (
    pathname === CUSTOMER_HOME ||
    pathname.startsWith(`${CUSTOMER_HOME}/`)
  ) {
    if (role !== "USER") {
      return NextResponse.redirect(
        new URL(ADMIN_HOME, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/admin/:path*",
    "/home",
  ],
};
