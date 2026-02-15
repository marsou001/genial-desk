import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to organizations page (or sign in if not authenticated)
  redirect('/organizations');
}
