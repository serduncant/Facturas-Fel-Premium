import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
const UploadPaymentProof = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [progress, setProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);
    const handleFile = (selectedFile) => {
        setFile(selectedFile);
        if (selectedFile.type.startsWith("image/")) {
            setPreview(URL.createObjectURL(selectedFile));
        }
        else {
            setPreview(null);
        }
    };
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        }
        else {
            setDragActive(false);
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0])
            handleFile(e.dataTransfer.files[0]);
    };
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files?.[0])
            handleFile(e.target.files[0]);
    };
    const handleUpload = () => {
        if (!file)
            return;
        setProgress(0);
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };
    return (_jsxs("div", { className: "max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-md p-6 mt-10", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-800 text-center mb-4", children: "Subir comprobante de pago" }), _jsxs("div", { className: `relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-50"}`, onDragEnter: handleDrag, onDragOver: handleDrag, onDragLeave: handleDrag, onDrop: handleDrop, onClick: () => inputRef.current?.click(), children: [_jsx("input", { type: "file", ref: inputRef, onChange: handleChange, className: "hidden", accept: ".pdf,image/*" }), _jsx("svg", { className: "w-10 h-10 text-blue-500 mb-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 16v-6a2 2 0 012-2h6a2 2 0 012 2v6m-4 4l-4-4m0 0l4-4m-4 4h12" }) }), _jsx("p", { className: "text-gray-600 text-sm text-center", children: "Arrastra y suelta tu archivo aqu\u00ED, o haz clic para elegirlo" }), _jsx("p", { className: "text-gray-400 text-xs", children: "(PDF o imagen, m\u00E1ximo 5\u202FMB)" })] }), preview && (_jsxs("div", { className: "mt-4 text-center", children: [_jsx("p", { className: "text-gray-700 text-sm mb-2", children: file?.name }), _jsx("img", { src: preview, alt: "Vista previa", className: "w-40 h-40 object-cover rounded-lg mx-auto shadow" })] })), file && !preview && (_jsxs("p", { className: "mt-4 text-gray-600 text-center text-sm", children: ["Archivo seleccionado: ", file.name] })), progress > 0 && (_jsxs("div", { className: "w-full mt-4", children: [_jsx("div", { className: "w-full bg-gray-200 rounded-full h-2.5", children: _jsx("div", { className: "bg-blue-600 h-2.5 rounded-full transition-all", style: { width: `${progress}%` } }) }), _jsxs("p", { className: "text-gray-600 text-xs mt-1 text-right", children: [progress, "%"] })] })), _jsx("button", { onClick: handleUpload, disabled: !file, className: "mt-5 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300", children: progress === 100 ? "Completado ✅" : "Subir comprobante" })] }));
};
export default UploadPaymentProof;
