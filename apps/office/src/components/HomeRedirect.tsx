import { useAuth } from '@appraisal/auth';
import { Navigate } from 'react-router-dom';
import { visibleNav } from '../lib/nav';

/** Sends the user to the first section their role can access. */
export function HomeRedirect() {
  const { roles } = useAuth();
  const nav = visibleNav(roles);
  return <Navigate to={nav[0]?.to ?? '/forbidden'} replace />;
}
