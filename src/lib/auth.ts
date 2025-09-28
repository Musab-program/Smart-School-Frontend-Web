export function parseJwt(token: string): unknown {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(Buffer.from(base64, "base64").toString("utf8"))
  } catch {
    return null
  }
}



