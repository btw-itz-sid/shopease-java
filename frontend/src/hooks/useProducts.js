import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useProducts = (params) =>
  useQuery({ queryKey: ['products', params], queryFn: () => productAPI.getAll(params).then(r => r.data) });

export const useProduct = (slug) =>
  useQuery({ queryKey: ['product', slug], queryFn: () => productAPI.getBySlug(slug).then(r => r.data), enabled: !!slug });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productAPI.create,
    onSuccess: () => { qc.invalidateQueries(['products']); toast.success('Product created!'); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create product'),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productAPI.delete,
    onSuccess: () => { qc.invalidateQueries(['products']); toast.success('Product removed.'); },
  });
};
