import { ClientShell } from "@/components/ClientShell";

export default function ClientLayout({ children }: LayoutProps<"/app">) {
  return <ClientShell>{children}</ClientShell>;
}
