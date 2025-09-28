export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" }).format(date)
}



