enum KiteEndpoint {
  ALL_INSTRUMENTS = "ALL_INSTRUMENTS"
}

export const KITE_ENDPOINTS: { [key in KiteEndpoint]: string } = {
  ALL_INSTRUMENTS: "/instruments"
}