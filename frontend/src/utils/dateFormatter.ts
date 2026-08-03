export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  