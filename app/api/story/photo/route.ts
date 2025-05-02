import { NextResponse } from "next/server"

// This is a mock API endpoint that would normally handle the story photo submission
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.task_id || !body.photo) {
      return NextResponse.json({ error: "Missing required fields: task_id and/or photo" }, { status: 400 })
    }

    // In a real implementation, this would process the request
    // and save the task for asynchronous processing

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 18000))

    return NextResponse.json({
      status: "accepted",
      msg: "Story photo task accepted for processing",
    })
  } catch (error) {
    console.error("Error processing story photo:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
