import "server-only"

import type { Data } from "@repo/strapi-types"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"

import NavbarLogoRowAnimation from "./NavbarLogoRowAnimation"

type NavbarLogoRowData = Data.ContentType<"api::navbar.navbar">["navbarLogoRow"]

export function NavbarLogoRow({
  navbarLogoRow,
}: {
  readonly navbarLogoRow?: NavbarLogoRowData
}) {
  const logos = navbarLogoRow?.logos

  if (!logos?.length && !navbarLogoRow?.missionTitle) return null

  const repeatCount = logos?.length
    ? Math.max(4, Math.ceil(64 / logos.length))
    : 0
  const speed = Math.min(Math.max(navbarLogoRow?.speed ?? 5, 1), 25)

  return (
    <div className="relative z-0 w-full overflow-hidden border-b shadow-sm">
      {logos?.length ? (
        <NavbarLogoRowAnimation duration={`${logos.length * (175 / speed)}s`}>
          {Array.from({ length: 2 }, (_, sequenceIndex) => (
            <ul
              key={`navbar-logo-sequence-${sequenceIndex}`}
              className="flex shrink-0 items-center"
              aria-hidden={sequenceIndex > 0}
            >
              {Array.from({ length: repeatCount }, (_, repetitionIndex) =>
                logos.map((logo) => (
                  <li
                    key={`navbar-logo-${sequenceIndex}-${repetitionIndex}-${logo.id}`}
                    className="h-12 w-auto shrink-0 list-none"
                    aria-hidden={sequenceIndex > 0}
                  >
                    <StrapiBasicImage
                      component={logo}
                      loading="eager"
                      className="h-12 w-auto object-contain"
                      height={48}
                      preload
                    />
                  </li>
                ))
              )}
            </ul>
          ))}
        </NavbarLogoRowAnimation>
      ) : null}
      {navbarLogoRow?.missionTitle ? (
        <p className="bg-background/60 text-foreground px-6 py-2 text-center text-sm font-medium backdrop-blur-md">
          {navbarLogoRow.missionTitle}
        </p>
      ) : null}
    </div>
  )
}

NavbarLogoRow.displayName = "NavbarLogoRow"

export default NavbarLogoRow
