import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { thematicCategory } = await request.json()

    if (!thematicCategory) {
      return NextResponse.json({ error: "Thematic category is required" }, { status: 400 })
    }

    const prompt = `
      Generate a vocabulary list for the thematic category: "${thematicCategory}".
      
      The vocabulary should include words in Portuguese, Kimbundu, and English.
      
      Format the response as a JSON array with the following structure:
      [
        {
          "portuguese": "água",
          "kimbundu": "maza",
          "english": "water",
          "parts": [
            {
              "portuguese": "ág",
              "kimbundu": ["ma"],
              "english": "water"
            }
          ]
        },
        {
          "portuguese": "escola",
          "kimbundu": "xikola",
          "english": "school",
          "parts": [
            {
              "portuguese": "escol",
              "kimbundu": ["xikol"],
              "english": "learn"
            }
          ]
        }
      ]
      
      Include at least 5 vocabulary items related to the thematic category.
      Ensure the JSON is valid and properly formatted.
      Only return the JSON array, no additional text.
    `

    const { text } = await generateText({
      model: groq("llama3-70b-8192"),
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
    })

    // Extract the JSON from the response
    let jsonResponse
    try {
      // Try to parse the response as JSON directly
      jsonResponse = JSON.parse(text)
    } catch (e) {
      // If direct parsing fails, try to extract JSON from the text
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        jsonResponse = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Failed to parse LLM response as JSON")
      }
    }

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("Error generating vocabulary:", error)
    return NextResponse.json({ error: "Failed to generate vocabulary" }, { status: 500 })
  }
}

