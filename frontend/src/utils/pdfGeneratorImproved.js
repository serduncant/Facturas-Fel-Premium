import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
export const generatePDF = async (element, invoice) => {
    try {
        // Clonar el elemento para no afectar la vista
        const clonedElement = element.cloneNode(true);
        // Aplicar estilos inline al clon para garantizar que se capturen
        const applyInlineStyles = (el) => {
            const computedStyle = window.getComputedStyle(el);
            // Copiar estilos importantes
            el.style.background = computedStyle.background;
            el.style.backgroundColor = computedStyle.backgroundColor;
            el.style.color = computedStyle.color;
            el.style.fontSize = computedStyle.fontSize;
            el.style.fontWeight = computedStyle.fontWeight;
            el.style.padding = computedStyle.padding;
            el.style.margin = computedStyle.margin;
            el.style.border = computedStyle.border;
            el.style.borderRadius = computedStyle.borderRadius;
            // Aplicar a todos los hijos
            Array.from(el.children).forEach(child => {
                applyInlineStyles(child);
            });
        };
        applyInlineStyles(clonedElement);
        // Agregar temporalmente al DOM (invisible)
        clonedElement.style.position = 'absolute';
        clonedElement.style.left = '-9999px';
        document.body.appendChild(clonedElement);
        // Esperar a que se apliquen los estilos
        await new Promise(resolve => setTimeout(resolve, 200));
        const canvas = await html2canvas(clonedElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#ffffff',
            imageTimeout: 0
        });
        // Remover el elemento clonado
        document.body.removeChild(clonedElement);
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdfWidth = 210;
        const pdfHeight = 297;
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        let finalWidth = pdfWidth - 10;
        let finalHeight = finalWidth / ratio;
        if (finalHeight > pdfHeight - 10) {
            finalHeight = pdfHeight - 10;
            finalWidth = finalHeight * ratio;
        }
        const pdf = new jsPDF('p', 'mm', 'a4');
        const xOffset = (pdfWidth - finalWidth) / 2;
        const yOffset = 5;
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
        const fileName = `Factura-${invoice.serie}-${invoice.numero}.pdf`;
        pdf.save(fileName);
    }
    catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Error al generar el PDF');
    }
};
