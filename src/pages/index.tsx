import { Container, Grid, Group, List, Stack, Text } from "@mantine/core"
import { StopSelect } from "components/StopSelect"
import Image from "next/image"
import layoutBox from "public/layout-box.png"
import customApiBox from "public/custom-api-box.png"

export default function HomePage() {
  return (
    <Container mt={50} size="lg">
      <Grid gutterLg={150}>
        <Grid.Col lg={6} sm={12}>
          <Stack>
            <Text weight="bold" size="xl">
              Welcome to the NYC Subway LED Ticker Api
            </Text>
            <Text>
              To be used with{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://ledtickers.com/"
              >
                https://ledtickers.com/
              </a>
            </Text>
            <StopSelect />
          </Stack>
        </Grid.Col>
        <Grid.Col lg={6} sm={12}>
          <Stack>
            <Text weight="bold" size="xl">
              Setup Instructions:{" "}
            </Text>
            <List type="ordered">
              <List.Item>
                After walking through setup on ticker manual navigate to{" "}
                <a target="_blank" rel="noreferrer" href="http://ticker.local">
                  http://ticker.local
                </a>
              </List.Item>
              <Stack mb='md'>
                <List.Item>
                  Set all options in the Layout box to Custom API
                </List.Item>
                <Image src={layoutBox} alt="layout-settings" />
              </Stack>
              <Stack>
                <List.Item>
                  In the Custom API box set the host to subway-ticker.vercel.app
                  and the path to the path generated from selecting your train
                  options
                </List.Item>
                <Image src={customApiBox} alt="custom-api-settings" />
              </Stack>
            </List>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  )
}
