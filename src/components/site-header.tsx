import { getSiteShellConfig } from "@/lib/site-config";
import { SiteHeaderClient } from "@/components/site-header-client";
import { getCurrentSession } from "@/lib/session";

export async function SiteHeader() {
  const [config, session] = await Promise.all([
    getSiteShellConfig(),
    getCurrentSession(),
  ]);

  const sessionData = session
    ? { authenticated: true as const, name: session.name, role: session.role }
    : { authenticated: false as const };

  return (
    <SiteHeaderClient
      brandName={config.brandName}
      brandSince={config.brandSince}
      navLinks={config.headerNavLinks}
      loginLink={config.headerLogin}
      cta={config.headerPrimaryCta}
      session={sessionData}
    />
  );
}
