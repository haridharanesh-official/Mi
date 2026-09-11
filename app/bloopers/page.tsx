import BloopersExperience from '@/components/BloopersExperience';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Bloopers · For Adya',
  description: 'Because the 1,200 km journey wasn’t cinematic every second.',
};

export default function BloopersPage() {
  return <BloopersExperience />;
}
