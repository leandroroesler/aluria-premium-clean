export const shippingByState: Record<string, number> = {
  SC: 18,
  PR: 22,
  RS: 24,
  SP: 28,
  RJ: 32,
  MG: 30,
  ES: 30,

  DF: 32,
  GO: 32,
  MT: 35,
  MS: 35,

  BA: 38,
  SE: 38,
  AL: 38,
  PE: 38,
  PB: 38,
  RN: 38,
  CE: 38,
  PI: 40,
  MA: 40,

  PA: 45,
  AP: 45,
  AM: 48,
  RR: 48,
  RO: 48,
  AC: 50,
  TO: 45,
}

export function calculateShipping(
  state: string,
  totalItems: number
) {
  const baseShipping =
    shippingByState[state] || 0

  let multiplier = 1

if (totalItems > 2) {

  const extraFaixas =
    Math.floor((totalItems - 3) / 2) + 1

  multiplier =
    1 + extraFaixas * 0.25

}

  return Number(
    (baseShipping * multiplier).toFixed(2)
  )
}