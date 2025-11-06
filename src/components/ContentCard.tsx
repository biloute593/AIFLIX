interface ContentCardProps {
  id: string
  title: string
  description: string
  type: 'movie' | 'series'
  videoUrl: string
}

export default function ContentCard({ id, title, description, type, videoUrl }: ContentCardProps) {
  const handleClick = () => {
    // Navigate to player page or open modal
    window.location.href = `/watch/${id}`
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer" onClick={handleClick}>
      <div className="h-48 bg-gray-600 mb-2 rounded flex items-center justify-center">
        <span className="text-gray-400 text-4xl">▶️</span>
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-300 mb-2">{description}</p>
      <span className="text-xs bg-red-600 px-2 py-1 rounded">{type === 'movie' ? 'Film' : 'Série'}</span>
    </div>
  )
}