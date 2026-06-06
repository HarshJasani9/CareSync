import Navbar from '@/components/landing/Navbar';

export default function DoctorsLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
