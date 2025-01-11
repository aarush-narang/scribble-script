import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

export const FontInter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

export const FontRounded = localFont({
    src: '../public/fonts/font.woff2',
    display: 'swap',
    variable: '--font-rounded',
});
