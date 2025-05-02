import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"

// This is an API route that handles file uploads
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create timestamp for filename
    const timestamp = new Date().toISOString().replace(/:/g, "-")
    const filename = `${timestamp}_${file.name}`

    // Save to ../post_data directory relative to the project root
    // Note: process.cwd() in Next.js API routes usually points to the project root
    const uploadDir = join(process.cwd(), "..", "post_data")
    const filepath = join(uploadDir, filename)

    try {
      // Ensure the directory exists (optional, but good practice)
      // await mkdir(uploadDir, { recursive: true }); // Requires importing mkdir from 'fs/promises'

      await writeFile(filepath, buffer)

      // Return the absolute path
      return NextResponse.json({
        success: true,
        filepath: filepath, // Return the calculated absolute path
      })
    } catch (error) {
      console.error("Error writing file:", error)
      // Provide a more specific error message if possible
      let errorMessage = "Failed to save file."
      if (error instanceof Error && 'code' in error) {
        if (error.code === 'ENOENT') {
          errorMessage = `Failed to save file. The directory ${uploadDir} does not exist. Please create it.`
        } else if (error.code === 'EACCES') {
          errorMessage = `Failed to save file. Permission denied writing to ${filepath}.`
        }
      } else {
         errorMessage = `Failed to save file. Make sure the directory ${uploadDir} exists and is writable.`
      }

      return NextResponse.json(
        {
          error: errorMessage,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error processing upload:", error)
    return NextResponse.json({ error: "Failed to process upload" }, { status: 500 })
  }
}
