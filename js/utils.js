/**
 * Utility functions for formatting and data manipulation.
 */

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

export const validateAmount = (amount) => {
    return !isNaN(amount) && Number(amount) > 0;
};
