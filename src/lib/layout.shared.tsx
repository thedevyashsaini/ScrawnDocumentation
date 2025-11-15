import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image 
            src="/Scrawn_Logo.png" 
            alt="Scrawn Logo" 
            width={32} 
            height={32}
            className="shrink-0"
          />
          <span>Scrawn Docs</span>
        </>
      ),
    },
    githubUrl: 'https://github.com/ScrawnDotDev/Scrawn',
  };
}
