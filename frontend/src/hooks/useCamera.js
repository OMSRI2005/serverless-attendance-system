import { useCallback, useEffect, useRef, useState } from 'react'

export default function useCamera() {
  const videoRef = useRef(null); const streamRef = useRef(null); const [isActive, setIsActive] = useState(false); const [error, setError] = useState('')
  const startCamera = useCallback(async () => { setError(''); try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false }); streamRef.current = stream; if (videoRef.current) videoRef.current.srcObject = stream; setIsActive(true) } catch (err) { setError(err.name === 'NotAllowedError' ? 'Camera permission was denied. Please allow camera access and try again.' : 'Unable to access your camera on this device.') } }, [])
  const stopCamera = useCallback(() => { streamRef.current?.getTracks().forEach((track) => track.stop()); streamRef.current = null; if (videoRef.current) videoRef.current.srcObject = null; setIsActive(false) }, [])
  const captureImage = useCallback(() => { const video = videoRef.current; if (!video || !video.videoWidth) return null; const canvas = document.createElement('canvas'); canvas.width = video.videoWidth; canvas.height = video.videoHeight; canvas.getContext('2d').drawImage(video, 0, 0); return canvas.toDataURL('image/jpeg', .9) }, [])
  useEffect(() => () => { stopCamera() }, [stopCamera])
  return { videoRef, isActive, error, startCamera, stopCamera, captureImage }
}
