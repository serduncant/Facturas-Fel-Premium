export const formatCurrency = (amount, spelled = false) => {
    if (spelled) {
        return `Q ${amount.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Quetzales`;
    }
    return `Q ${amount.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
