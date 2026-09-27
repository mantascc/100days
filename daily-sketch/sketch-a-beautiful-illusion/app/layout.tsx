import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'A Beautiful Illusion',description:'The machine generates the pattern. The human supplies the mind. An interactive perspective study in language.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
