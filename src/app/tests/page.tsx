import { redirect } from "next/navigation"

export default function TestsIndexPage() {
  // デフォルトのテストページにリダイレクト
  redirect("/tests/storage-1")
}
