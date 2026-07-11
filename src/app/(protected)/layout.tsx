import RequireAuthLayout from "@/components/layout/RequireAuthLayout";

export default function ProtectedGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuthLayout>{children}</RequireAuthLayout>;
}
