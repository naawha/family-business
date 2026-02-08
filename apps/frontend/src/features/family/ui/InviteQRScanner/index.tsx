import { FC, useRef, useEffect, useState } from 'react'
import { Box, Text, Loader, Center, Stack } from '@mantine/core'
import jsQR from 'jsqr'

interface InviteQRScannerProps {
  onScan: (token: string) => void
  onError?: (message: string) => void
  /** Высота области видео (например 280) */
  height?: number
}

/**
 * Сканер QR-кода приглашения в семью. Запрашивает доступ к камере,
 * показывает превью и при обнаружении QR вызывает onScan с содержимым (токеном).
 */
const InviteQRScanner: FC<InviteQRScannerProps> = ({
  onScan,
  onError,
  height = 280,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number>(0)
  const [status, setStatus] = useState<'requesting' | 'ready' | 'error'>('requesting')

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let cancelled = false

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        video.srcObject = stream
        await video.play()
        setStatus('ready')
      } catch (err) {
        if (cancelled) return
        setStatus('error')
        onError?.('Не удалось включить камеру. Разрешите доступ к камере в настройках браузера.')
        return
      }

      const tick = () => {
        if (cancelled || !video.videoWidth || streamRef.current === null) {
          animationRef.current = requestAnimationFrame(tick)
          return
        }

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code?.data) {
          const token = code.data.trim()
          if (token) {
            streamRef.current.getTracks().forEach((t) => t.stop())
            streamRef.current = null
            onScan(token)
            return
          }
        }

        animationRef.current = requestAnimationFrame(tick)
      }

      animationRef.current = requestAnimationFrame(tick)
    }

    startCamera()

    return () => {
      cancelled = true
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
      video.srcObject = null
    }
  }, [onScan, onError])

  if (status === 'requesting') {
    return (
      <Center h={height} style={{ minHeight: height }}>
        <Stack align="center" gap="sm">
          <Loader />
          <Text size="sm" c="dimmed">
            Запрос доступа к камере...
          </Text>
        </Stack>
      </Center>
    )
  }

  if (status === 'error') {
    return (
      <Box p="md" style={{ minHeight: height }}>
        <Text size="sm" c="dimmed">
          Не удалось включить камеру. Разрешите доступ к камере в настройках браузера и
          обновите страницу.
        </Text>
      </Box>
    )
  }

  return (
    <Box style={{ position: 'relative', overflow: 'hidden', borderRadius: 8 }}>
      <video
        ref={videoRef}
        muted
        playsInline
        style={{
          width: '100%',
          height,
          objectFit: 'cover',
          display: 'block',
        }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <Text size="sm" c="dimmed" ta="center" p="sm" style={{ background: 'var(--mantine-color-default)' }}>
        Наведите камеру на QR-код приглашения
      </Text>
    </Box>
  )
}

export default InviteQRScanner
