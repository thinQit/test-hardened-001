import './globals.css';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import Navigation from '@/components/layout/Navigation';

export const metadata = {
  title: 'Marketing Landing Page',
  description: 'A simple, modern landing page with a contact form and admin dashboard.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <Navigation />
            <main className="min-h-screen">{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
