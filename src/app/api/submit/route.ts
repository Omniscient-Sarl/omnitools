import { NextRequest, NextResponse } from "next/server"
import { getServiceClient } from "@/lib/supabase/service"

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

    const { error } = await getServiceClient().from("tool_submissions").insert({
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
