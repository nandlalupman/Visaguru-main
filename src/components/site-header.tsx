import { getSiteShellConfig } from "@/lib/site-config";
import { SiteHeaderClient } from "@/components/site-header-client";

export async function SiteHeader() {
  const config = await getSiteShellConfig();

  return (
    <SiteHeaderClient
      brandName={config.brandName}
      brandSince={config.brandSince}
      navLinks={config.headerNavLinks}
      loginLink={config.headerLogin}
      cta={config.headerPrimaryCta}
    />
  );
}
