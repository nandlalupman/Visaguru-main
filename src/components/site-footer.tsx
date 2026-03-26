import Link from "next/link";
import { getSiteShellConfig, type EditableLink } from "@/lib/site-config";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12z" />
    </svg>
  );
}

function isExternalLink(href: string, forceExternal?: boolean) {
  if (forceExternal) return true;
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function FooterLink({ link }: { link: EditableLink }) {
  if (isExternalLink(link.href, link.external)) {
    return (
      <a
        href={link.href}
        className="transition hover:text-[var(--color-navy)] hover:translate-x-0.5"
        target="_blank"
        rel="noreferrer"
      >
        {link.label}
      </a>
    );
  }
  return (
    <Link
      href={link.href}
      className="transition hover:text-[var(--color-navy)] hover:translate-x-0.5"
    >
      {link.label}
    </Link>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  const normalized = platform.toLowerCase();
  if (normalized.includes("linkedin")) return <LinkedInIcon />;
  if (normalized.includes("instagram")) return <InstagramIcon />;
  if (normalized.includes("youtube")) return <YouTubeIcon />;
  return (
    <span className="text-xs font-semibold uppercase">
      {platform.slice(0, 1)}
    </span>
  );
}

export async function SiteFooter() {
  const config = await getSiteShellConfig();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="text-lg font-semibold text-[var(--color-navy)]">
              {config.newsletterTitle}
            </p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {config.newsletterSubtitle}
            </p>
          </div>
          <div className="flex w-full gap-2 md:w-auto">
            <input
              type="email"
              placeholder={config.newsletterPlaceholder}
              className="w-full rounded-full border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[var(--color-gold)] md:w-64"
            />
            <button
              type="button"
              className="whitespace-nowrap rounded-full bg-[var(--color-navy)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-navy-light)]"
            >
              {config.newsletterButton}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-14 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="md:max-w-sm md:flex-[1.4]">
          <p className="text-2xl font-semibold text-[var(--color-navy)]">
            {config.brandName}
          </p>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            {config.brandTagline}
          </p>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            {config.footerDescription}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-[var(--color-muted)]">
            {config.footerDisclaimer}
          </p>
          <div className="mt-5 flex items-center gap-3">
            {config.footerSocialLinks.map((item) => (
              <a
                key={`${item.platform}-${item.href}`}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.platform}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-muted)] transition-all duration-200 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] hover:shadow-sm"
              >
                <SocialIcon platform={item.platform} />
              </a>
            ))}
          </div>
        </div>

        <div className="grid flex-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {config.footerLinkGroups.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-navy)]">
                {group.title}
              </p>
              <div className="mt-3 flex flex-col gap-2 text-sm text-[var(--color-muted)]">
                {group.links.map((link) => (
                  <FooterLink
                    key={`${group.title}-${link.href}-${link.label}`}
                    link={link}
                  />
                ))}
              </div>
            </div>
          ))}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-navy)]">
              Contact
            </p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-[var(--color-muted)]">
              {config.footerContactLinks.map((link) => (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="transition hover:text-[var(--color-navy)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 text-xs text-[var(--color-muted)] md:px-6">
          <p>{config.footerBottomText}</p>
        </div>
      </div>
    </footer>
  );
}
