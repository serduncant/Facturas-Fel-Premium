import QRCode from 'qrcode';
export const generateQRUrl = async (invoice) => {
    const params = new URLSearchParams({
        tipo: 'autorizacion',
        numero: invoice.certificador.autorizacion,
        emisor: invoice.emisor.nit,
        receptor: invoice.receptor.nit,
        monto: invoice.total.toFixed(6)
    });
    const url = `https://felpub.c.sat.gob.gt/verificador-web/publico/vistas/verificacionDte.jsf?${params.toString()}`;
    try {
        return await QRCode.toDataURL(url, {
            width: 120,
            margin: 0,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });
    }
    catch (err) {
        console.error('Error generating QR code:', err);
        return '';
    }
};
