import {
  ActionIcon,
  CopyButton,
  Group,
  Radio,
  Select,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { validTrains } from "lib/contants"
import { formattedStops } from "lib/helpers"

export const StopSelect = () => {
  const form = useForm({
    initialValues: {
      stop: "168",
      train: "A",
      direction: "north",
    },
  })
  return (
    <form>
      <Stack>
        <Select
          searchable
          label="Choose Train"
          data={validTrains}
          {...form.getInputProps("train")}
        />
        <Select
          searchable
          clearable
          label="Choose Station"
          data={formattedStops}
          {...form.getInputProps("stop")}
        />
        <Radio.Group label="Direction" {...form.getInputProps("direction")}>
          <Radio value="north" label="Uptown" />
          <Radio value="south" label="Downtown" />
        </Radio.Group>
        <Group>
          <Text weight="bold" color="green">
            Path: /api/{form.values.train}/{form.values.stop}/
            {form.values.direction}
          </Text>
          <CopyButton value={`/api/${form.values.train}/${form.values.stop}/
            ${form.values.direction}`} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? "Copied" : "Copy"}
                withArrow
                position="right"
              >
                <ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Stack>
    </form>
  )
}
