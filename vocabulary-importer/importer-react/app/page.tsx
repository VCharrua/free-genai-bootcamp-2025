import VocabularyImporter from "@/components/vocabulary-importer"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Vocabulary Language Importer</h1>
      <p className="text-center mb-8 text-muted-foreground">
        Enter a thematic category to generate vocabulary in Portuguese, Kimbundu, and English
      </p>
      <VocabularyImporter />
    </main>
  )
}

