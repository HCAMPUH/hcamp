import type { Data } from "@repo/strapi-types"

import StrapiTable from "@/components/page-builder/components/sections/StrapiTable"

const data = {
  id: 1,
  __component: "sections.table",
  title: "Table",
  firstColumnLabel: "Name",
  secondColumnLabel: "Value",
  rows: [
    { id: 1, label: "Item A", value: "1" },
    { id: 2, label: "Item B", value: "2" },
    { id: 3, label: "Item C", value: "3" },
  ],
} as unknown as Data.Component<"sections.table">

export default function MockedStrapiTable() {
  return <StrapiTable component={data} />
}
