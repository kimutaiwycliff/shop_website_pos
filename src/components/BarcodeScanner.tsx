'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, CameraOff, Scan, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface BarcodeScannerProps {
  onScan: (barcode: string) => void
  onError?: (error: string) => void
  isActive?: boolean
  className?: string
  enableTorch?: boolean
  scanDelay?: number
  formats?: string[]
}

interface ScanResult {
  code: string
  timestamp: number
  format: string
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onError,
  isActive = false,
  className,
  enableTorch = false,
  scanDelay = 500,
  formats = ['UPC_A', 'UPC_E', 'EAN_13', 'EAN_8', 'CODE_128', 'CODE_39'],
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string>('')
  const [lastScan, setLastScan] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string>('')
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [torchEnabled, setTorchEnabled] = useState(false)
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize code reader
  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader()
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset()
      }
    }
  }, [])

  // Get available camera devices
  const getDevices = useCallback(async () => {
    try {
      const videoDevices = await codeReaderRef.current?.listVideoInputDevices()
      if (videoDevices) {
        setDevices(videoDevices)
        if (videoDevices.length > 0 && !selectedDevice) {
          // Prefer back camera if available
          const backCamera = videoDevices.find(
            (device) =>
              device.label.toLowerCase().includes('back') ||
              device.label.toLowerCase().includes('rear'),
          )
          setSelectedDevice(backCamera?.deviceId || videoDevices[0].deviceId)
        }
      }
    } catch (err) {
      console.error('Error getting devices:', err)
      setError('Could not access camera devices')
      onError?.('Could not access camera devices')
    }
  }, [selectedDevice, onError])

  // Request camera permissions
  const requestPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      stream.getTracks().forEach((track) => track.stop()) // Stop immediately, we just needed permission
      setHasPermission(true)
      await getDevices()
    } catch (err) {
      console.error('Camera permission denied:', err)
      setHasPermission(false)
      setError('Camera access denied. Please allow camera permissions.')
      onError?.('Camera access denied')
    }
  }, [getDevices, onError])

  // Start scanning
  const startScanning = useCallback(async () => {
    if (!codeReaderRef.current || !videoRef.current || !selectedDevice) return

    try {
      setIsScanning(true)
      setError('')

      await codeReaderRef.current.decodeFromVideoDevice(
        selectedDevice,
        videoRef.current,
        (result, err) => {
          if (result) {
            const now = Date.now()
            const code = result.getText()
            const format = result.getBarcodeFormat().toString()

            // Prevent duplicate scans within the delay period
            if (!lastScan || now - lastScan.timestamp > scanDelay) {
              const scanResult: ScanResult = {
                code,
                timestamp: now,
                format,
              }

              setLastScan(scanResult)
              onScan(code)

              // Clear any existing timeout
              if (scanTimeoutRef.current) {
                clearTimeout(scanTimeoutRef.current)
              }

              // Optional: Stop scanning briefly after successful scan
              scanTimeoutRef.current = setTimeout(() => {
                setLastScan(null)
              }, 2000)
            }
          }

          if (err && !(err instanceof NotFoundException)) {
            console.warn('Scan error:', err)
          }
        },
      )
    } catch (err) {
      console.error('Error starting scanner:', err)
      setError('Failed to start camera scanner')
      onError?.('Failed to start camera scanner')
      setIsScanning(false)
    }
  }, [selectedDevice, lastScan, scanDelay, onScan, onError])

  // Stop scanning
  const stopScanning = useCallback(() => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset()
    }
    setIsScanning(false)
    setLastScan(null)
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current)
    }
  }, [])

  // Toggle torch (flashlight)
  const toggleTorch = useCallback(async () => {
    if (!videoRef.current || !videoRef.current.srcObject) return

    try {
      const stream = videoRef.current.srcObject as MediaStream
      const track = stream.getVideoTracks()[0]
      const capabilities = track.getCapabilities() as any // Type assertion for torch capability

      if ('torch' in capabilities && capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: !torchEnabled } as any],
        })
        setTorchEnabled(!torchEnabled)
      }
    } catch (err) {
      console.error('Error toggling torch:', err)
    }
  }, [torchEnabled])

  // Handle isActive prop changes
  useEffect(() => {
    if (isActive && hasPermission && selectedDevice) {
      startScanning()
    } else {
      stopScanning()
    }

    return () => stopScanning()
  }, [isActive, hasPermission, selectedDevice, startScanning, stopScanning])

  // Initialize permissions on mount
  useEffect(() => {
    if (hasPermission === null) {
      requestPermissions()
    }
  }, [hasPermission, requestPermissions])

  // Show permission request if needed
  if (hasPermission === false) {
    return (
      <Card className={cn('w-full max-w-md', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Camera Permission Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This scanner needs camera access to read barcodes. Please grant permission to continue.
          </p>
          <Button onClick={requestPermissions} className="w-full">
            Grant Camera Access
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (hasPermission === null) {
    return (
      <Card className={cn('w-full max-w-md', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm">Initializing camera...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5" />
          Barcode Scanner
          {lastScan && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Scanned
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Preview */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />

          {/* Scanning overlay */}
          {isScanning && (
            <div className="absolute inset-0 border-2 border-blue-500 rounded-lg">
              {/* Corner indicators */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-blue-500"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-blue-500"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-blue-500"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Last Scan Result */}
        {lastScan && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800 dark:text-green-300">
                Scanned Successfully
              </span>
            </div>
            <p className="font-mono text-sm">{lastScan.code}</p>
            <p className="text-xs text-muted-foreground">Format: {lastScan.format}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-red-800 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            onClick={isScanning ? stopScanning : startScanning}
            disabled={!selectedDevice}
            className="flex-1"
          >
            {isScanning ? (
              <>
                <CameraOff className="mr-2 h-4 w-4" />
                Stop Scanner
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Start Scanner
              </>
            )}
          </Button>

          {enableTorch && isScanning && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTorch}
              className={cn(torchEnabled && 'bg-yellow-100 dark:bg-yellow-900')}
            >
              <span className="sr-only">Toggle flashlight</span>
              💡
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setError('')
              setLastScan(null)
            }}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="sr-only">Reset</span>
          </Button>
        </div>

        {/* Device Selection */}
        {devices.length > 1 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Camera Device:</label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
            >
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId.slice(0, 8)}...`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Hold your device steady and point the camera at the barcode</p>
          <p>• Make sure the barcode is well-lit and in focus</p>
          <p>• Supported formats: UPC-A, UPC-E, EAN-13, EAN-8, Code 128, Code 39</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default BarcodeScanner
