// lib/zpl-preview.ts
export async function generateZPLPreview(zpl: string) {

  const width = 4
  const height = 6
  const dpmm = 8

  const response = await fetch(
    `https://api.labelary.com/v1/printers/${dpmm}dpmm/labels/${width}x${height}/0/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: zpl
    }
  )

  if (!response.ok) {
    throw new Error("Error generando preview ZPL")
  }

  const blob = await response.blob()

  return URL.createObjectURL(blob)
}