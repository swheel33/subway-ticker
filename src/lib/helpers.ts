import { stops } from "lib/contants"

const getUniqueValues = (arr: any[]) =>
  arr?.filter((element, index, array) => array.indexOf(element) === index)

export const formattedStops = getUniqueValues(
  stops.map((stop) => stop.stop_name)
).map((stop, i) => ({ value: (i + 1).toString(), label: stop }))

export const getStopMap = (id: string) =>
  stops
    .filter(
      (stop) =>
        stop.stop_name ===
        formattedStops.find((stop) => stop.value === id)?.label
    )
    .map((stop) => stop.stop_id)
    .flat()

export const getTrainSet = (train: string) => {
  if (["F", "B", "D", "M"].includes(train)) {
    return "-bdfm"
  } else if (["N", "Q", "R", "W"].includes(train)) {
    return "-nqrw"
  } else if (["A", "C", "E"].includes(train)) {
    return "-ace"
  } else if (["J", "Z"].includes(train)) {
    return "-jz"
  } else if (train === "G") {
    return "-g"
  } else {
    return ""
  }
}
