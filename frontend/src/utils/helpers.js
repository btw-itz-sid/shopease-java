export const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const truncate = (str, n = 60) => str?.length > n ? str.slice(0, n) + '...' : str;

export const calcDiscount = (price, originalPrice) =>
  originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

export const getStatusColor = (status) => ({
  pending:    'bg-yellow-100 text-yellow-800',
  confirmed:  'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped:    'bg-indigo-100 text-indigo-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
  refunded:   'bg-gray-100 text-gray-800',
}[status] || 'bg-gray-100 text-gray-800');
