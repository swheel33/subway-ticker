import type { NextApiRequest, NextApiResponse } from "next"
import gtfs from "gtfs-realtime-bindings"
import { getStopMap, getTrainSet } from "lib/helpers"
import { validTrains } from "lib/contants"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path } = req.query
  const train = path?.at(0)?.toUpperCase() as string
  const stop = path?.at(1)?.toUpperCase() as string
  const direction = path?.at(2)?.toLowerCase() as string

  if (!train || !stop || !direction) {
    res
      .status(400)
      .json({ error: "Missing information, check homepage for api format" })
  }
  if (!(direction === "north" || direction === "south")) {
    res.status(400).json({ error: "Invalid Direction" })
    return
  }

  if (!validTrains.includes(train)) {
    res.status(400).json({ error: "Invalid Train" })
    return
  }

  if (parseInt(stop, 10) > 380) {
    res.status(400).json({ error: "Invalid Stop Id" })
    return
  }

  const trainSet = getTrainSet(train)
  const stopMap = getStopMap(stop)

  const mtaRes = await fetch(
    `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs${trainSet}`,
    {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_MTA_API_KEY,
      } as HeadersInit,
    }
  )

  const buffer = await mtaRes.arrayBuffer()
  const { entity: trainData } = gtfs.transit_realtime.FeedMessage.decode(
    new Uint8Array(buffer)
  )
  const now = new Date().getTime()

  const allStopData = trainData
    .map((data) => data.tripUpdate)
    .filter((data) => data?.trip.routeId === train)
    .map((data) => data?.stopTimeUpdate)

  const stopData = stopMap
    .map((stop) =>
      allStopData.map((data) =>
        data?.filter((data) => data.stopId?.includes(stop))
      )
    )
    .map((data) => data.filter((data) => (data?.length as number) > 0))
    .filter((data) => (data?.length as number) > 0)[0]

  const uptown = stopData
    .map((data) => data?.filter((data) => data?.stopId?.includes("N"))[0])
    .filter((data) => data)
    .map((data) => data?.arrival?.time)
    .filter((data) => (data as number) * 1000 > now)
    .sort()
  const downtown = stopData
    .map((data) => data?.filter((data) => data?.stopId?.includes("S"))[0])
    .filter((data) => data)
    .map((data) => data?.arrival?.time)
    .filter((data) => (data as number) * 1000 > now)
    .sort()

  const uptownFormatted = uptown
    .map((data) => new Date((data as number) * 1000))
    .map((data) =>
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        timeZone: "America/Toronto",
      }).format(data)
    )
  const downtownFormatted = downtown
    .map((data) => new Date((data as number) * 1000))
    .map((data) =>
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        timeZone: "America/Toronto",
      }).format(data)
    )

  //Subtract a minute to account for api latency and ticker refresh every 60 seconds (rather be early than late)
  const nextUptown = uptown.map((data) =>
    Math.round(((data as number) * 1000 - now) / 1000 / 60 - 1)
  )
  const nextDowntown = downtown.map((data) =>
    Math.round(((data as number) * 1000 - now) / 1000 / 60 - 1)
  )
  const finalUptown = nextUptown
    .map((data, i) => ({
      relative: data,
      absolute: uptownFormatted[i],
    }))
    .slice(0, 2)
  const finalDowntown = nextDowntown
    .map((data, i) => ({
      relative: data,
      absolute: downtownFormatted[i],
    }))
    .slice(0, 2)
  const finalStops = direction === "north" ? finalUptown : finalDowntown

  res.status(200).json([
    {
      shape: "circle",
      x: 11,
      y: 6,
      r: 5,
      filled: true,
      color: "bd4002",
    },
    {
      text: train,
      x: 9,
      y: 9,
      size: 2,
      color: "ffffff",
    },
    {
      text: direction === "north" ? "Uptown" : "Downtown",
      x: 20,
      y: 9,
      size: 2,
      color: "ffffff",
    },
    {
      text:
        finalStops[0].relative !== 0
          ? `${finalStops[0].relative} minute${
              finalStops[0].relative !== 1 ? "s" : ""
            }`
          : "Now",
      x: 31,
      y: 20,
      align: "C",
      size: 2,
      color: "ffffff",
    },
    {
      text: `${finalStops[1].relative} minute${
        finalStops[1].relative !== 1 ? "s" : ""
      }`,
      x: 31,
      y: 29,
      align: "C",
      size: 2,
      color: "ffffff",
    },
  ])
}
