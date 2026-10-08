import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import Typography from "@/components/typography"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { PageBuilderComponentProps } from "@/types/general"

export default function StrapiTable({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.table">
}) {
  return (
    <section>
      <Container className="py-8">
        {component.title ? (
          <Typography tag="h2" variant="heading3" className="mb-6">
            {component.title}
          </Typography>
        ) : null}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{component.firstColumnLabel}</TableHead>
              <TableHead>{component.secondColumnLabel}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {component.rows?.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.label}</TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </section>
  )
}
