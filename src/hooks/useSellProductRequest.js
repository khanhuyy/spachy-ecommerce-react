import { useDidMount } from '@/hooks';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useProduct from './useProduct';
import firebase from '@/services/firebase';

const useSellProductRequest = (itemsCount) => {
  const [warehouseProducts, setWarehouseProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const didMount = useDidMount(true);

  const { user } = useSelector((state) => ({ user: state.auth }));
  const fetchWarehouseProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const docs = await firebase.getVendorRequests(user.id, itemsCount)
      if (docs.empty) {
        if (didMount) {
          setError('No request found.');
          setLoading(false);
        }
      } else {
        const items = [];
        docs.forEach((snap) => {
          let data = snap.data()
          items.push({ id: snap.ref.id, ...data });
        });

        if (didMount) {
          setWarehouseProducts(items);
          setLoading(false);
        }
      }
    } catch (e) {
      if (didMount) {
        setError('Failed to fetch request');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (warehouseProducts.length === 0 && didMount) {
      fetchWarehouseProducts();
    }
  }, []);

  return {
    warehouseProducts, fetchWarehouseProducts, isLoading, error
  };
};

export default useSellProductRequest;
