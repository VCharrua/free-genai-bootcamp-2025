"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Copy, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function VocabularyImporter() {
  const [thematicCategory, setThematicCategory] = useState("")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!thematicCategory.trim()) {
      setError("Please enter a thematic category")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/generate-vocabulary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ thematicCategory }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate vocabulary")
      }

      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      alert("Vocabulary copied to clipboard!")
    } catch (err) {
      setError("Failed to copy to clipboard")
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="thematic-category">Thematic Category</Label>
              <Input
                id="thematic-category"
                placeholder="Enter a thematic category (e.g., food, education, family)"
                value={thematicCategory}
                onChange={(e) => setThematicCategory(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Vocabulary"
              )}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="result">Generated Vocabulary</Label>
                <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-1">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <Textarea id="result" value={result} readOnly className="font-mono text-sm h-96" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

