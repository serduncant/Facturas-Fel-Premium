import * as XLSX from 'xlsx';
export const exportToJSON = (invoice) => {
    const dataStr = JSON.stringify(invoice, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `factura_${invoice.numero}_${invoice.serie}.json`;
    link.click();
    URL.revokeObjectURL(url);
};
export const exportToExcel = (invoice) => {
    const generalData = [
        ['INFORMACIÓN DE LA FACTURA'],
        [''],
        ['Número', invoice.numero],
        ['Serie', invoice.serie],
        ['Fecha', invoice.fecha],
        ['Total', `Q ${invoice.total.toFixed(2)}`],
        [''],
        ['EMISOR'],
        ['Nombre', invoice.emisor.nombre],
        ['NIT', invoice.emisor.nit],
        ['Dirección', invoice.emisor.direccion],
        [''],
        ['RECEPTOR'],
        ['Nombre', invoice.receptor.nombre],
        ['NIT', invoice.receptor.nit],
        ['Dirección', invoice.receptor.direccion],
        [''],
        ['CERTIFICACIÓN'],
        ['Autorización', invoice.certificador.autorizacion],
        ['Certificador', invoice.certificador.nombre],
        ['NIT Certificador', invoice.certificador.nit],
    ];
    const itemsData = [
        ['ITEMS DE LA FACTURA'],
        [''],
        ['Cantidad', 'Descripción', 'Precio Unitario', 'Total'],
        ...invoice.items.map(item => [
            item.cantidad,
            item.descripcion,
            item.precioUnitario,
            item.total
        ]),
        ['', '', 'GRAN TOTAL:', invoice.total]
    ];
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.aoa_to_sheet(generalData);
    const ws2 = XLSX.utils.aoa_to_sheet(itemsData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Información General');
    XLSX.utils.book_append_sheet(wb, ws2, 'Items');
    XLSX.writeFile(wb, `factura_${invoice.numero}_${invoice.serie}.xlsx`);
};
