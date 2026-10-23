import { Navigate, Route, Routes } from 'react-router-dom';

// Routes are intentionally scaffolded before visual components are ported, so the live site remains unchanged.
export default function App() {
  return <Routes>
    <Route path="/" element={<Navigate to="/migration-in-progress" replace />} />
    <Route path="/migration-in-progress" element={<main>Macrobyte React migration is in progress.</main>} />
  </Routes>;
}
