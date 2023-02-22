import { Group } from "@mantine/core"
import { StopSelect } from "components/StopSelect"

export default function HomePage() {
  return (
    <Group mt={50} position="center">
      <StopSelect />
    </Group>
  )
}
