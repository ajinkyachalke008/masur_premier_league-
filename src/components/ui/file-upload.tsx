import {useState,useRef,useEffect} from 'react';
import {Upload,Loader2,X,RefreshCw,CheckCircle} from 'lucide-react';
import {supabase} from '@/integrations/supabase/client';
import {Button} from './button';
import { BorderBeam } from './border-beam';

interface Props {
  folder: 'profile-photos' | 'payment-screenshots' | 'government-ids' | 'resumes' | 'medical-certs';
  accept: string;
  maxSizeMB: number;
  label: string;
  required?: boolean;
  value?: string;
  disabled?: boolean;
  onUploadComplete?: (path: string, previewUrl?: string) => void;
  onUploadingChange?: (busy: boolean) => void;
}

export default function FileUpload({
  folder,
  accept,
  maxSizeMB,
  label,
  required,
  value = '',
  disabled = false,
  onUploadComplete,
  onUploadingChange,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value) setPreview('');
    else if (value.startsWith('http')) setPreview(value);
  }, [value]);

  const compressImageForUpload = async (file: File): Promise<File> => {
    if (['image/jpeg', 'image/png'].includes(file.type) && file.size <= 1.5 * 1024 * 1024) {
      return file;
    }
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          const maxDim = 1600;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressed);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.85
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const select = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    onUploadingChange?.(true);

    try {
      file = await compressImageForUpload(file);
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Choose a JPG, JPEG or PNG image.');
        setUploading(false);
        onUploadingChange?.(false);
        return;
      }
      if (!file.size || file.size > maxSizeMB * 1024 * 1024) {
        setError(`Choose an image up to ${maxSizeMB} MB.`);
        setUploading(false);
        onUploadingChange?.(false);
        return;
      }

      const form = new FormData();
      form.set('file', file);
      form.set('folder', folder);
      const { data, error } = await supabase.functions.invoke('upload-player-media', { body: form });
      if (error || !data?.path) throw new Error();
      setPreview(data.preview_url);
      onUploadComplete?.(data.path, data.preview_url);
    } catch {
      setError('Upload failed. Please check your connection and try again.');
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      if (input.current) input.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={input}
        type="file"
        accept={accept}
        aria-label={label}
        onChange={select}
        className="sr-only"
        disabled={uploading || disabled}
      />
      {preview ? (
        <div className="relative rounded-lg border border-border p-3 bg-secondary/30">
          <img
            src={preview}
            alt={`${label} preview`}
            className="mx-auto max-h-48 sm:max-h-56 w-full object-contain rounded"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
            <span className="flex items-center gap-1.5 text-xs text-accent font-medium">
              <CheckCircle className="h-4 w-4" /> {uploading ? 'Uploading replacement…' : 'Image uploaded'}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="h-8 sm:h-9 text-xs"
                disabled={uploading || disabled}
                onClick={() => input.current?.click()}
                aria-label={`Replace ${label}`}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Replace
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="h-8 w-8 sm:h-9 sm:w-9 p-0 text-muted-foreground hover:text-destructive"
                disabled={uploading || disabled}
                aria-label={`Remove ${label}`}
                onClick={() => {
                  setPreview('');
                  onUploadComplete?.('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <BorderBeam
            size={220}
            duration={12}
            borderWidth={1.5}
            colorFrom="#ff6a00"
            colorTo="#ffc83d"
          />
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="relative h-auto w-full flex-col gap-2 border-dashed border-border/80 hover:border-accent/50 py-5 sm:py-7 px-3 text-center min-h-[90px] rounded-lg"
          disabled={uploading || disabled}
          onClick={() => input.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          ) : (
            <Upload className="h-6 w-6 text-accent" />
          )}
          <span className="text-xs sm:text-sm font-semibold text-foreground">
            {uploading ? 'Uploading image…' : `Upload ${label}${required ? ' *' : ''}`}
          </span>
          <span className="text-[11px] font-normal text-muted-foreground">
            JPG / PNG · Up to {maxSizeMB} MB
          </span>
          <BorderBeam
            size={220}
            duration={12}
            borderWidth={1.5}
            colorFrom="#ff6a00"
            colorTo="#ffc83d"
          />
        </Button>
      )}
      {error && <p role="alert" className="text-xs sm:text-sm text-destructive">{error}</p>}
    </div>
  );
}
