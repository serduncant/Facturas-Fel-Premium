import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
export const generatePDF = async (element, invoice, format = 'carta') => {
    try {
        // Guardar estilos originales del contenedor
        const originalWidth = element.style.width;
        const originalMaxWidth = element.style.maxWidth;
        const originalTransform = element.style.transform;
        const originalBoxShadow = element.style.boxShadow;
        const originalBorder = element.style.border;
        const originalBorderRadius = element.style.borderRadius;
        // Forzar ancho según formato y remover sombras/bordes exteriores de tarjeta para PDF limpio
        const targetWidth = format === 'mediaCarta' ? '396pt' : '612pt';
        element.style.width = targetWidth;
        element.style.maxWidth = targetWidth;
        element.style.transform = 'scale(1)';
        element.style.boxShadow = 'none';
        element.style.border = 'none';
        element.style.borderRadius = '0';
        await new Promise(resolve => setTimeout(resolve, 300));
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            logging: false,
            backgroundColor: '#ffffff',
            imageTimeout: 15000,
            removeContainer: true,
            width: elementWidth,
            height: elementHeight,
            windowWidth: elementWidth,
            windowHeight: elementHeight
        });
        // Restaurar estilos originales de la interfaz en pantalla
        element.style.width = originalWidth;
        element.style.maxWidth = originalMaxWidth;
        element.style.transform = originalTransform;
        element.style.boxShadow = originalBoxShadow;
        element.style.border = originalBorder;
        element.style.borderRadius = originalBorderRadius;
        if (canvas.width === 0 || canvas.height === 0) {
            throw new Error('Canvas vacío - no se pudo capturar la factura');
        }
        const imgData = canvas.toDataURL('image/png', 1.0);
        if (imgData === 'data:,') {
            throw new Error('Imagen vacía - no se pudo generar el PDF');
        }
        // Configurar PDF según formato sin marcos de borde exterior
        let pdfConfig;
        let pdfWidth;
        let pdfHeight;
        if (format === 'mediaCarta') {
            pdfConfig = {
                orientation: 'portrait',
                unit: 'pt',
                format: [396, 612]
            };
            pdfWidth = 396;
            pdfHeight = 612;
        }
        else {
            pdfConfig = {
                orientation: 'portrait',
                unit: 'pt',
                format: 'letter'
            };
            pdfWidth = 612;
            pdfHeight = 792;
        }
        const pdf = new jsPDF(pdfConfig);
        const canvasRatio = canvas.height / canvas.width;
        let finalWidth = pdfWidth;
        let finalHeight = finalWidth * canvasRatio;
        if (finalHeight > pdfHeight) {
            finalHeight = pdfHeight;
            finalWidth = finalHeight / canvasRatio;
        }
        const xOffset = 0;
        const yOffset = (pdfHeight - finalHeight) / 2;
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
        const fileName = `Factura-${invoice.serie}-${invoice.numero}.pdf`;
        pdf.save(fileName);
        console.log('PDF generado exitosamente sin bordes exteriores');
    }
    catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Error al generar el PDF. Intenta de nuevo.');
    }
};
