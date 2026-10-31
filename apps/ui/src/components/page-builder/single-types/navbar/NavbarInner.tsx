import "server-only"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiImageWithLink from "@/components/page-builder/components/utilities/StrapiImageWithLink"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import NavbarLogoRow from "@/components/page-builder/single-types/navbar/NavbarLogoRow"
import {
  NavbarMobileNavigation,
  NavbarMobileProvider,
  NavbarMobileToggle,
} from "@/components/page-builder/single-types/navbar/NavbarMobileControls"
import NavbarSearch from "@/components/page-builder/single-types/navbar/NavbarSearch"
import type { BetterAuthSessionWithStrapi } from "@/types/better-auth"

import { DesktopNavigation } from "./DesktopNavigation"

export function NavbarInner({
  locale,
  navbarData,
  session,
}: {
  readonly locale: Locale
  readonly navbarData?: Data.ContentType<"api::navbar.navbar">
  readonly session?: BetterAuthSessionWithStrapi | null
}) {
  const hasNavbarLogoRow =
    !!navbarData?.navbarLogoRow?.logos?.length ||
    !!navbarData?.navbarLogoRow?.missionTitle

  return (
    <NavbarMobileProvider>
      <div className="sticky top-0 z-50">
        <header
          className={`bg-background/60 relative z-10 h-16 w-full backdrop-blur-md transition-colors duration-300 ${
            hasNavbarLogoRow ? "" : "shadow-sm"
          }`}
        >
          <div className="flex h-16 items-center">
            <Container className="flex h-full items-center justify-between px-6">
              {/* LEFT SIDE */}
              <div className="flex items-center gap-2">
                {/* Logo */}
                {navbarData?.logoImage?.image && navbarData.logoImage.link ? (
                  <StrapiImageWithLink
                    component={navbarData.logoImage}
                    imageProps={{
                      className: "icon--invert-on-dark shrink-0 object-contain",
                      width: undefined,
                      height: undefined,
                      preload: true,
                    }}
                  />
                ) : null}
                {navbarData?.logoImage?.image && !navbarData.logoImage.link ? (
                  <StrapiBasicImage
                    component={navbarData.logoImage.image}
                    preload
                    className="icon--invert-on-dark shrink-0 object-contain"
                  />
                ) : null}
                {/* Desktop Navigation */}
                <DesktopNavigation navbarItems={navbarData?.navbarItems} />
              </div>

              {/* RIGHT SIDE */}
              <div className="hidden h-full items-center gap-2 pl-4 lg:flex">
                <NavbarSearch />
                {/*   <NavbarAuthSection sessionSSR={session} />
                <LocaleSwitcher locale={locale} /> */}
                {/* <div className="flex h-8 w-px flex-1 bg-black/70" /> */}
                {navbarData?.primaryButtons?.map((button) => (
                  <StrapiLink key={button.id} component={button} />
                ))}
              </div>
              <div className="flex items-center gap-1 lg:hidden">
                <NavbarSearch />
                <NavbarMobileToggle />
              </div>
            </Container>
          </div>
        </header>
        <NavbarLogoRow navbarLogoRow={navbarData?.navbarLogoRow} />
      </div>
      <NavbarMobileNavigation
        navbarItems={navbarData?.navbarItems}
        primaryButtons={navbarData?.primaryButtons}
        session={session}
        locale={locale}
      />
    </NavbarMobileProvider>
  )
}
NavbarInner.displayName = "NavbarInner"

export default NavbarInner
