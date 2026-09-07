// Copyright (c) ZeroC, Inc.

// The corporate links every ZeroC site carries, the same three as the IceRPC
// docs footer. Everything about the product lives in the header and the
// sidebar; the footer is only where the company is.
const footerLinks = [
  { href: 'https://zeroc.com/about', text: 'About' },
  { href: 'https://zeroc.com/privacy', text: 'Privacy Policy' },
  { href: 'https://zeroc.com/contact', text: 'Contact' }
];

// The one global footer, identical on every page. It shares the header's
// horizontal padding so the copyright lines up under the site name and the
// links under the theme toggle, and it sits at the bottom of the viewport on a
// short page rather than halfway up it.
export function IceFooter() {
  return (
    <footer className="border-hairline mt-auto border-t px-[clamp(1rem,2.5vw,2rem)] py-6 text-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-ink-secondary">
          © {new Date().getFullYear()} ZeroC
        </span>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-ink-secondary hover:text-ink transition-colors"
              >
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
