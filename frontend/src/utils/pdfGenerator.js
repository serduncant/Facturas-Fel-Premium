import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
export const generatePDF = async (element, invoice, format = 'carta') => {
    try {
        const originalWidth = element.style.width;
        const originalMaxWidth = element.style.maxWidth;
        const originalTransform = element.style.transform;
        // Forzar ancho según formato
        const targetWidth = format === 'mediaCarta' ? '396pt' : '612pt';
        element.style.width = targetWidth;
        element.style.maxWidth = targetWidth;
        element.style.transform = 'scale(1)';
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
        element.style.width = originalWidth;
        element.style.maxWidth = originalMaxWidth;
        element.style.transform = originalTransform;
        if (canvas.width === 0 || canvas.height === 0) {
            throw new Error('Canvas vacío - no se pudo capturar la factura');
        }
        const imgData = canvas.toDataURL('image/png', 1.0);
        if (imgData === 'data:,') {
            throw new Error('Imagen vacía - no se pudo generar el PDF');
        }
        // Configurar PDF según formato
        let pdfConfig;
        let pdfWidth;
        let pdfHeight;
        if (format === 'mediaCarta') {
            // Media carta VERTICAL: 5.5" x 8.5" = 396pt x 612pt
            pdfConfig = {
                orientation: 'portrait',
                unit: 'pt',
                format: [396, 612]
            };
            pdfWidth = 396;
            pdfHeight = 612;
        }
        else {
            // Carta VERTICAL: 8.5" x 11" = 612pt x 792pt
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
        console.log('PDF generado exitosamente');
    }
    catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Error al generar el PDF. Intenta de nuevo.');
    }
};
