import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth - ATELIER",
  description: "Authentication pages",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}