import React, { useRef, useEffect, useState } from 'react'
import signatureService from '../services/signatureService'
import { toast } from 'react-hot-toast'

export default function SignaturePad({ visitorId, onUploaded }) {
  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#111827'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
  }, [])

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    if (e.touches && e.touches[0]) {
      const t = e.touches[0]
      return { x: t.clientX - rect.left, y: t.clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const start = (e) => {
    e.preventDefault()
    setDrawing(true)
    const ctx = canvasRef.current.getContext('2d')
    const p = getPos(e)
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
  }

  const move = (e) => {
    e.preventDefault()
    if (!drawing) return
    const ctx = canvasRef.current.getContext('2d')
    const p = getPos(e)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
  }

  const end = (e) => {
    e && e.preventDefault()
    setDrawing(false)
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const save = async () => {
    try {
      const canvas = canvasRef.current
      canvas.toBlob(async (blob) => {
        if (!blob) return toast.error('Impossible de générer la signature')
        const res = await signatureService.uploadSignature(visitorId, blob)
        toast.success('Signature envoyée')
        if (onUploaded) onUploaded(res)
      }, 'image/png')
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de l'envoi de la signature")
    }
  }

  return (
    <div className="signature-pad">
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className="border rounded"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
        style={{ touchAction: 'none' }}
      />
      <div className="mt-2 space-x-2">
        <button className="px-3 py-1 bg-gray-200 rounded" onClick={clear}>Effacer</button>
        <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={save}>Enregistrer</button>
      </div>
    </div>
  )
}
