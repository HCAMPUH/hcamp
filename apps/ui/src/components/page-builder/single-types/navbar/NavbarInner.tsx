import "server-only"

import type { Data } from "@repo/strapi-types"
import type { Locale } from "next-intl"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiImageWithLink from "@/components/page-builder/components/utilities/StrapiImageWithLink"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import { NavbarAccessibilityButton } from "@/components/page-builder/single-types/navbar/NavbarAccessibilityButton"
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
  return (
    <NavbarMobileProvider>
      <header className="bg-background/60 sticky top-0 z-50 h-16 w-full shadow-sm backdrop-blur-md transition-colors duration-300">
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
            <div className="flex h-full items-center gap-1 pl-4 lg:gap-2">
              {navbarData?.showAccessibilityButton !== false ? (
                <NavbarAccessibilityButton />
              ) : null}
              {navbarData?.showSearchButton !== false ? <NavbarSearch /> : null}
              {navbarData?.showEmergencyActionPlanButton !== false &&
              navbarData?.emergencyActionPlanLink ? (
                <StrapiLink
                  component={navbarData.emergencyActionPlanLink}
                  className="bg-brand-red hover:bg-brand-red/90 h-12 w-[120px] shrink-0 justify-center overflow-hidden rounded-[16px] border border-white/80 bg-clip-padding px-2 py-1 text-center text-sm leading-tight font-normal break-words whitespace-normal text-white no-underline shadow-sm hover:text-white"
                />
              ) : null}
              <div className="hidden items-center gap-2 lg:flex">
                {/*   <NavbarAuthSection sessionSSR={session} />
                  <LocaleSwitcher locale={locale} /> */}
                {/* <div className="flex h-8 w-px flex-1 bg-black/70" /> */}
                {navbarData?.primaryButtons?.map((button) => (
                  <StrapiLink key={button.id} component={button} />
                ))}
              </div>
              <div className="lg:hidden">
                <NavbarMobileToggle />
              </div>
            </div>
          </Container>
        </div>
      </header>
      <NavbarMobileNavigation
        navbarItems={navbarData?.navbarItems}
        primaryButtons={navbarData?.primaryButtons}
        session={session}
        locale={locale}
      />
      <NavbarLogoRow navbarLogoRow={navbarData?.navbarLogoRow} />
    </NavbarMobileProvider>
  )
}
NavbarInner.displayName = "NavbarInner"

export default NavbarInner
