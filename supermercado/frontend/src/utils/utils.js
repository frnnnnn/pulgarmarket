export const formatPrice = (value) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0, // Pesos chilenos no usan decimales
    }).format(value);
  };
  