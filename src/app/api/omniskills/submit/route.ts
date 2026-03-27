import { NextRequest, NextResponse } from "next/server"
import { createOmniskillsServiceClient } from "@/lib/supabase/omniskills-server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, url, description, email } = body

  if (!name || !url || !email) {
    return NextResponse.json({ error: "name, url, and email are required" }, { status: 400 })
  }

  const supabase = createOmniskillsServiceClient()

  const { error } = await supabase
    .from("skill_submissions")
    .insert({ name, url, description, email })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
