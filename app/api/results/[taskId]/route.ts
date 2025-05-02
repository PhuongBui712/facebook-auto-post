// This is an API route that fetches results from the backend
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { taskId: string } }) {
  const { taskId } = await params

  try {
    // Use the new results endpoint from the FastAPI backend
    const response = await fetch(`http://localhost:8000/results/${taskId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Get the response data
    const data = await response.json()

    // Return the data with the appropriate status code
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error fetching result:", error)
    return NextResponse.json({ error: "Failed to fetch result" }, { status: 500 })
  }
}
