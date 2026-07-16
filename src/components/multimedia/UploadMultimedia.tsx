import { useState, useRef, useCallback } from 'react';
import { uploadMultimedia } from '../../services/multimedia.service';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

interface UploadMultimediaProps {
  anuncioId: string;
  onUploadComplete: () => void;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

interface PendingFile {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadMultimedia({ anuncioId, onUploadComplete }: UploadMultimediaProps) {
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const addFiles = useCallback((inputFiles: FileList | File[]) => {
    setGeneralError('');
    const incoming = Array.from(inputFiles);
    const valid: PendingFile[] = [];

    for (const file of incoming) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setGeneralError(`"${file.name}" is not a supported image format (JPG, PNG, GIF, WebP only).`);
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setGeneralError(`"${file.name}" exceeds the 5 MB size limit.`);
        continue;
      }
      valid.push({ file, preview: URL.createObjectURL(file), status: 'pending', progress: 0 });
    }

    if (valid.length > 0) {
      setFiles((prev) => [...prev, ...valid]);
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setGeneralError('');

    try {
      await uploadMultimedia(anuncioId, files.map((f) => f.file), (percent) => {
        setFiles((prev) =>
          prev.map((f) => (f.status === 'uploading' ? { ...f, progress: percent } : f)),
        );
      });

      setFiles((prev) => prev.map((f) => ({ ...f, status: 'success' as const, progress: 100 })));
      onUploadComplete();
      setTimeout(() => {
        setFiles((prev) => {
          prev.forEach((f) => URL.revokeObjectURL(f.preview));
          return [];
        });
      }, 2000);
    } catch {
      setGeneralError('Upload failed. Please try again.');
      setFiles((prev) => prev.map((f) => ({ ...f, status: 'error' as const })));
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragRef.current?.classList.remove('border-blue-400', 'bg-blue-50');
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragRef.current?.classList.add('border-blue-400', 'bg-blue-50');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragRef.current?.classList.remove('border-blue-400', 'bg-blue-50');
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Upload Images</h2>

      <div
        ref={dragRef}
        className="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-blue-400"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-600">
          Drag images here or click to select
        </p>
        <p className="mt-1 text-xs text-gray-400">JPG, PNG, GIF, WebP — max 5 MB each</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {generalError && (
        <Alert type="error" message={generalError} onClose={() => setGeneralError('')} />
      )}

      {files.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {files.map((f, i) => (
              <div key={f.preview} className="group relative">
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={f.preview}
                    alt={f.file.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <button
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 rounded-full bg-red-600 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  disabled={uploading}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <p className="mt-1 truncate text-xs text-gray-500">
                  {f.file.name} — {formatBytes(f.file.size)}
                </p>

                {f.status === 'uploading' && (
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                )}

                {f.status === 'success' && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Uploaded
                  </div>
                )}

                {f.status === 'error' && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Failed
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button onClick={handleUpload} isLoading={uploading} disabled={uploading}>
            Upload {files.length} {files.length === 1 ? 'image' : 'images'}
          </Button>
        </>
      )}
    </div>
  );
}
