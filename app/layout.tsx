import type { Metadata } from 'next';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/manrope/400.css';
import './globals.css';
import './gift-story.css';
import StoryNav from '@/components/StoryNav';
import HeartEffects from '@/components/HeartEffects';
import { Music } from '@/components/Shared';
export const metadata: Metadata = { title: 'For Adya · A gift with a journey', description: 'Some stories deserve a slower telling.', robots: { index: false, follow: false } };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body><StoryNav/><HeartEffects/>{children}<Music/></body></html>}

