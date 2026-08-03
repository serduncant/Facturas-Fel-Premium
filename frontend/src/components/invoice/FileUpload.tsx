import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';

interface FileUploadProps {
  accept: Record<string, string[]>;
  onFileUpload: (file: File) => void;
  label: string;
  darkMode?: boolean;
  isLoading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  accept, 
  onFileUpload, 
  label, 
  darkMode = false,
  isLoading = false 
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && !isLoading) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload, isLoading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
    disabled: isLoading
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
        isDragActive 
          ? 'border-blue-500 bg-blue-50 scale-105' 
          : darkMode 
            ? 'border-gray-600 bg-gray-700 hover:border-blue-500 hover:bg-gray-600' 
            : 'border-gray-300 bg-white hover:border-blue-500 hover:bg-gray-50'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      {isLoading ? (
        <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
      ) : (
        <Upload className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
      )}
      <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {isLoading ? 'Procesando archivo...' : isDragActive ? 'Suelta el archivo aquí' : label}
      </p>
    </div>
  );
};
