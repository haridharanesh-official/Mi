import PhotoboothExperience from '@/components/PhotoboothExperience';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photobooth · For Adya',
  description: 'Some memories deserve their own wall.',
};

export default function PhotoboothPage() {
  return <PhotoboothExperience />;
}
