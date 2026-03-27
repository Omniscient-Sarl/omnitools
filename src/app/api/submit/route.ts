import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, url, description, submitted_by, email } = body

    if (!name || !url) {
      return NextResponse.json(
        { error: "Name and URL are required" },
        { status: 400 }
      )
    }

    const { error } = await supabase.from("tool_submissions").insert({
      name: name.trim().slice(0, 200),
      url: url.trim().slice(0, 500),
      description: description?.trim().slice(0, 2000) || null,
      submitted_by: submitted_by?.trim().slice(0, 100) || null,
      email: email?.trim().slice(0, 200) || null,
    })

    if (error) {
      console.error("Submission error:", error)
      return NextResponse.json(
        { error: "Failed to submit" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
