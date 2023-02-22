import { Select, Stack, Text } from "@mantine/core"
import { formattedStops } from "lib/stops"
import { useState } from "react"

export const StopSelect = () => {
  const [stopId, setStopId] = useState<string | null>("")
  return (
    <Stack>
      <Select
        searchable
        value={stopId}
        onChange={setStopId}
        label="Choose Station"
        data={formattedStops}
      />
      <Text>Stop ID: {stopId}</Text>
    </Stack>
  )
}
