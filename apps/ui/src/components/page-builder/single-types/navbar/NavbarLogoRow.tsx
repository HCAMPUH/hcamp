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
  const missionTitle = navbarLogoRow?.missionTitle

  if (!logos?.length && !missionTitle) return null

  const repeatCount = logos?.length
    ? Math.max(4, Math.ceil(64 / logos.length))
    : 0
  const speed = Math.min(Math.max(navbarLogoRow?.speed ?? 5, 1), 25)

  return (
    <section
      aria-label={missionTitle ?? "Partner organizations"}
      className="relative z-0 w-full overflow-hidden border-b shadow-sm"
    >
      {logos?.length ? (
        <NavbarLogoRowAnimation duration={`${logos.length * (175 / speed)}s`}>
          {Array.from({ length: 2 }, (_, sequenceIndex) => (
            <ul
              key={`navbar-logo-sequence-${sequenceIndex}`}
              className="flex shrink-0 items-center"
              {...(sequenceIndex > 0 ? { "aria-hidden": true } : {})}
            >
              {Array.from({ length: repeatCount }, (_, repetitionIndex) =>
                logos.map((logo) => (
                  <li
                    key={`navbar-logo-${sequenceIndex}-${repetitionIndex}-${logo.id}`}
                    className="h-[90px] w-auto shrink-0 list-none"
                  >
                    <StrapiBasicImage
                      component={logo}
                      loading="eager"
                      className="h-[90px] w-auto object-contain"
                      height={90}
                      preload
                      aria-hidden="true"
                      role="presentation"
                    />
                  </li>
                ))
              )}
            </ul>
          ))}
        </NavbarLogoRowAnimation>
      ) : null}
      {missionTitle ? (
        <p className="bg-background/60 text-primary px-6 py-2 text-center text-sm font-medium backdrop-blur-md">
          {missionTitle}
        </p>
      ) : null}
    </section>
  )
}

NavbarLogoRow.displayName = "NavbarLogoRow"

export default NavbarLogoRow
