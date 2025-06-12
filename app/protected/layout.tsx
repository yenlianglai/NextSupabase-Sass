export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full pricing-hero">{children}</div>;
}
