import { NextRequest, NextResponse } from "next/server"
import { getServiceClient } from "@/lib/supabase/service"

// GET: list all submissions
export async function GET() {
  const { data, error } = await getServiceClient()
    .from("tool_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ submissions: data })
}

// PATCH: update submission status
export async function PATCH(request: NextRequest) {
  const { id, status } = await request.json()

  if (!id || !["approved", "rejected", "pending"].includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const { error } = await getServiceClient()
    .from("tool_submissions")
    .update({ status })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
