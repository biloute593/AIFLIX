export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="text-center py-20">
        <h2 className="text-4xl font-bold mb-4">Découvrez des séries et films générés par IA</h2>
        <p className="text-xl mb-8">Partagez vos créations et explorez celles des autres</p>
        <a href="/register" className="bg-red-600 px-8 py-4 rounded text-xl hover:bg-red-700">Commencer</a>
      </section>
      <section className="py-20">
        <h3 className="text-2xl font-bold text-center mb-10">Contenu populaire</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 max-w-7xl mx-auto">
          {/* Placeholder for content cards */}
          <div className="bg-gray-800 p-4 rounded">
            <div className="h-48 bg-gray-600 mb-2 rounded flex items-center justify-center">
              <span className="text-4xl">🎬</span>
            </div>
            <h4>Film IA #1</h4>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <div className="h-48 bg-gray-600 mb-2 rounded flex items-center justify-center">
              <span className="text-4xl">📺</span>
            </div>
            <h4>Série IA #1</h4>
          </div>
          <div className="bg-gray-800 p-4 rounded">
            <div className="h-48 bg-gray-600 mb-2 rounded flex items-center justify-center">
              <span className="text-4xl">🎭</span>
            </div>
            <h4>Création IA #1</h4>
          </div>
        </div>
      </section>
    </main>
  )
}