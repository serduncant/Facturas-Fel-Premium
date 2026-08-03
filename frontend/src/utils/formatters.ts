export const formatCurrency = (amount: number, spelled = false): string => {
  if (spelled) {
    return `Q ${amount.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Quetzales`;
  }
  return `Q ${amount.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};