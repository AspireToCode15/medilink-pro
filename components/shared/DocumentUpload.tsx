'use client'

import { useState } from 'react'
import { Upload, X, Loader2, FileText, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface DocumentUploadProps {
  medicalProfileId: string
  userId: string
  onComplete?: () => void
}

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

export default function DocumentUpload({ medicalProfileId, userId, onComplete }: DocumentUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fileTypes, setFileTypes] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files: File[]) => {
    setError(null)
    setSuccess(null)
    
    if (selectedFiles.length + files.length > 5) {
      setError("Maximum 5 files allowed")
      return
    }

    const validFiles: File[] = []
    
    for (const file of files) {
      if (file.size > MAX_SIZE) {
        setError(`File too large: ${file.name} (Max 5MB)`)
        return
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Only PDF, JPG, PNG allowed.`)
        return
      }
      validFiles.push(file)
    }

    setSelectedFiles(prev => [...prev, ...validFiles])
    
    const newTypes = { ...fileTypes }
    validFiles.forEach(f => {
      newTypes[f.name] = 'prescription'
    })
    setFileTypes(newTypes)
  }

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)
  }

  const updateFileType = (fileName: string, type: string) => {
    setFileTypes(prev => ({ ...prev, [fileName]: type }))
  }

  const uploadFiles = async () => {
    setUploading(true)
    setError(null)
    setSuccess(null)
    
    try {
      let uploadedCount = 0
      
      for (const file of selectedFiles) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('medical_profile_id', medicalProfileId)
        formData.append('document_type', fileTypes[file.name] || 'other')

        const res = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Upload failed')
        }
        
        uploadedCount++
      }
      
      setSuccess(`${uploadedCount} file(s) uploaded successfully`)
      setSelectedFiles([])
      
      if (onComplete) {
        setTimeout(onComplete, 1500)
      }
    } catch (err: any) {
      setError("Upload failed. This may work after deployment. Please try again after deploying to Vercel.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="border-green-500 text-green-600 bg-green-50">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div 
        className="border-2 border-dashed border-red-500/50 rounded-xl p-8 text-center bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors relative"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept=".pdf,.jpg,.jpeg,.png" 
          multiple 
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <p className="font-semibold text-lg mb-1">Click to upload or drag files here</p>
        <p className="text-sm text-muted-foreground">PDF, JPG, PNG • Max 5MB • Max 5 files</p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-3 mt-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase">Selected Files</h4>
          {selectedFiles.map((file, i) => (
            <div key={`${file.name}-${i}`} className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
              <div className="flex items-center space-x-3 overflow-hidden">
                {file.type === 'application/pdf' ? (
                  <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                )}
                <div className="truncate">
                  <p className="text-sm font-medium truncate max-w-[150px] md:max-w-[300px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{Math.round(file.size / 1024)} KB</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <select 
                  className="text-sm border border-border rounded p-1 bg-background"
                  value={fileTypes[file.name] || 'prescription'}
                  onChange={(e) => updateFileType(file.name, e.target.value)}
                  disabled={uploading}
                >
                  <option value="prescription">Prescription</option>
                  <option value="lab_report">Lab Report</option>
                  <option value="insurance">Insurance Card</option>
                  <option value="other">Other</option>
                </select>
                <Button variant="ghost" size="icon" onClick={() => removeFile(i)} disabled={uploading}>
                  <X className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                </Button>
              </div>
            </div>
          ))}
          
          <Button 
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white" 
            onClick={uploadFiles}
            disabled={uploading || selectedFiles.length === 0}
          >
            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {uploading ? 'Uploading...' : 'Upload All'}
          </Button>
        </div>
      )}
    </div>
  )
}
