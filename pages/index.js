import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(() => import('../components/AdminDashboard'), { ssr: false });

export default function Home() {
  return <AdminDashboard />;
}