// Copyright (c) ZeroC, Inc.

const footerLinks = [
  { href: 'https://zeroc.com/about', text: 'About' },
  { href: 'https://zeroc.com/privacy', text: 'Privacy Policy' },
  { href: 'https://zeroc.com/contact', text: 'Contact' }
];

export function Footer() {
  return (
    <footer className="border-hairline border-t px-[clamp(1rem,2.5vw,2rem)] py-6 text-sm">
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
