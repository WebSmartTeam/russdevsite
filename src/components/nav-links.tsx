"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SPECIMENS } from "@/lib/specimens";

// Direction for the page slide: moving to a later specimen goes forward, to an earlier one goes back.
function direction(from: string, to: string): "nav-forward" | "nav-back" {
  const index = (path: string) => SPECIMENS.findIndex((s) => s.href === path);
  return index(to) > index(from) ? "nav-forward" : "nav-back";
}

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Specimens" className="site-nav">
      <ul>
        {SPECIMENS.map((s) => {
          const current = pathname === s.href;
          return (
            <li key={s.slug}>
              <Link
                href={s.href}
                aria-current={current ? "page" : undefined}
                transitionTypes={[direction(pathname, s.href)]}
              >
                {s.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
