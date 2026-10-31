// @jsxImportSource react
import type { ReactNode } from 'react';

// Ported from hominem services/api/src/routes/login/app/account-shell.tsx. The account routes are left
// out: this playground has no Usage, Billing or Data pages. Class names match the hominem file.
export function AccountShell({ children }: { children: ReactNode }) {
  return (
    <div className="root">
      <div className="content">{children}</div>
    </div>
  );
}
