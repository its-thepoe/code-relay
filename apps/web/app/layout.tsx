import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Coderelay",
  description: "Local MVP-B dashboard for exports.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-dvh bg-zinc-50">
          <div className="mx-auto flex w-full max-w-[1280px] gap-10 px-6 py-6">
            <aside className="hidden w-[240px] shrink-0 md:block">
              <div className="flex items-center gap-2 px-2 py-3">
                <div className="grid size-8 place-items-center rounded-full bg-zinc-950 text-white">
                  <LogoMark className="size-4" />
                </div>
                <div className="text-sm font-extrabold tracking-tight">
                  Coderelay
                </div>
              </div>

              <nav className="mt-4 grid gap-1">
                <NavItem href="/" label="Home" />
                <NavItem href="/jobs" label="Jobs" />
              </nav>

              <div className="mt-6 rounded-2xl bg-zinc-100 px-4 py-3 text-xs text-zinc-700">
                Local MVP
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              <div className="mb-5 flex items-center justify-between gap-4 md:hidden">
                <div className="flex items-center gap-2">
                  <div className="grid size-9 place-items-center rounded-full bg-zinc-950 text-white">
                    <LogoMark className="size-4" />
                  </div>
                  <div className="text-base font-extrabold tracking-tight">
                    Coderelay
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <Link
                    className="underline underline-offset-4 hover:text-zinc-900"
                    href="/jobs"
                  >
                    Jobs
                  </Link>
                </div>
              </div>

              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
    >
      <span className="grid size-8 place-items-center rounded-full bg-zinc-100 text-zinc-700">
        <DotIcon className="size-4" />
      </span>
      {label}
    </Link>
  );
}

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M6 8.5h12v2H6v-2Zm0 5h8v2H6v-2Z" fill="currentColor" />
    </svg>
  );
}

function DotIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 7.25a.9.9 0 0 1 .9.9v7.7a.9.9 0 1 1-1.8 0v-7.7a.9.9 0 0 1 .9-.9Z"
        fill="currentColor"
      />
      <path
        d="M7.25 12a.9.9 0 0 1 .9-.9h7.7a.9.9 0 1 1 0 1.8h-7.7a.9.9 0 0 1-.9-.9Z"
        fill="currentColor"
      />
    </svg>
  );
}
