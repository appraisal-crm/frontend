import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { HomeRedirect } from '../components/HomeRedirect';
import { RequireAuth } from '../components/RequireAuth';
import { RequireRole } from '../components/RequireRole';
import { AppraisalPage } from '../pages/AppraisalPage';
import { AppraisalsPage } from '../pages/AppraisalsPage';
import { CallbackPage } from '../pages/CallbackPage';
import { ForbiddenPage } from '../pages/ForbiddenPage';
import { InspectionPage } from '../pages/InspectionPage';
import { InspectionsPage } from '../pages/InspectionsPage';
import { RequestsPage } from '../pages/RequestsPage';
import { Providers } from './providers';

export function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/callback" element={<CallbackPage />} />
        <Route
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route index element={<HomeRedirect />} />
          <Route
            path="requests"
            element={
              <RequireRole anyOf={['appraiser', 'admin']}>
                <RequestsPage />
              </RequireRole>
            }
          />
          <Route
            path="inspections"
            element={
              <RequireRole anyOf={['inspector', 'appraiser', 'admin']}>
                <InspectionsPage />
              </RequireRole>
            }
          />
          <Route
            path="inspections/:id"
            element={
              <RequireRole anyOf={['inspector', 'appraiser', 'admin']}>
                <InspectionPage />
              </RequireRole>
            }
          />
          <Route
            path="appraisals"
            element={
              <RequireRole anyOf={['appraiser', 'admin']}>
                <AppraisalsPage />
              </RequireRole>
            }
          />
          <Route
            path="appraisals/:id"
            element={
              <RequireRole anyOf={['appraiser', 'admin']}>
                <AppraisalPage />
              </RequireRole>
            }
          />
          <Route path="forbidden" element={<ForbiddenPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Providers>
  );
}
