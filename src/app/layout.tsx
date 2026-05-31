import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JP-Mirai Portal",
  description: "Support portal for technical intern trainees and specified skilled workers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children
}
