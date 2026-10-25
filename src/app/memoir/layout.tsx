import type { ReactNode } from 'react';

export default function MemoirLayout({ children }: { children: ReactNode }) {
  return (
    <div className="memoir-app">
      <meta name="robots" content="noindex, nofollow" />
      {children}
    </div>
  );
}
