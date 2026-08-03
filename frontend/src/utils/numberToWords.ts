const UNIDADES = [
    'CERO', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'
  ];
  
  const DECENAS = [
    'DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE',
    'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'
  ];
  
  const CENTENAS = [
    'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS',
    'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'
  ];
  
  export const numberToWords = (number: number): string => {
    const parts = number.toFixed(2).split('.');
    const integerPart = parseInt(parts[0]);
    const decimalPart = parseInt(parts[1]);
  
    if (integerPart === 0 && decimalPart === 0) return 'CERO QUETZALES EXACTOS';
  
    const integerWords = convertIntegerPart(integerPart);
    return `${integerWords} QUETZALES CON ${decimalPart}/100 EXACTOS`;
  };
  
  const convertIntegerPart = (number: number): string => {
    if (number < 10) return UNIDADES[number];
    if (number < 20) return DECENAS[number - 10];
    if (number < 100) {
      const decena = Math.floor(number / 10);
      const unidad = number % 10;
      return unidad === 0 
        ? DECENAS[decena + 8]
        : `${DECENAS[decena + 8]} Y ${UNIDADES[unidad]}`;
    }
    if (number < 1000) {
      const centena = Math.floor(number / 100);
      const resto = number % 100;
      if (number === 100) return 'CIEN';
      return resto === 0 
        ? CENTENAS[centena - 1]
        : `${CENTENAS[centena - 1]} ${convertIntegerPart(resto)}`;
    }
    if (number < 1000000) {
      const miles = Math.floor(number / 1000);
      const resto = number % 1000;
      const milesStr = miles === 1 ? 'MIL' : `${convertIntegerPart(miles)} MIL`;
      return resto === 0 ? milesStr : `${milesStr} ${convertIntegerPart(resto)}`;
    }
    return 'NÚMERO DEMASIADO GRANDE';
  };
  