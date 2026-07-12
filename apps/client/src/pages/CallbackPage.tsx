import { useAuth } from '@appraisal/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Splash } from '../components/Splash';

export function CallbackPage() {
  const { isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) navigate('/', { replace: true });
  }, [isLoading, navigate]);

  return <Splash />;
}
