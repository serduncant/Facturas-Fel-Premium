import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';
export const FileUpload = ({ accept, onFileUpload, label, darkMode = false, isLoading = false }) => {
    const onDrop = useCallback((acceptedFiles) => {
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
    return (_jsxs("div", { ...getRootProps(), className: `border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive
            ? 'border-blue-500 bg-blue-50 scale-105'
            : darkMode
                ? 'border-gray-600 bg-gray-700 hover:border-blue-500 hover:bg-gray-600'
                : 'border-gray-300 bg-white hover:border-blue-500 hover:bg-gray-50'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`, children: [_jsx("input", { ...getInputProps() }), isLoading ? (_jsx(Loader2, { className: "mx-auto h-12 w-12 text-blue-500 animate-spin" })) : (_jsx(Upload, { className: `mx-auto h-12 w-12 ${darkMode ? 'text-gray-400' : 'text-gray-400'}` })), _jsx("p", { className: `mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`, children: isLoading ? 'Procesando archivo...' : isDragActive ? 'Suelta el archivo aquí' : label })] }));
};
