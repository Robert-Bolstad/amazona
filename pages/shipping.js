import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { Store } from '../utils/Store';

const Shipping = () => {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping');
    }
  }, []);

  return <div>Shipping</div>;
};

export default Shipping;
