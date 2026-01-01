import DashboardLayout from '@/shared/components/DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
