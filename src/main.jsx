import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import { StoreProvider } from './store/Store'
import Landing from './landing/Landing'
import CrmLayout from './crm/CrmLayout'
import Dashboard from './crm/Dashboard'
import Appointments from './crm/Appointments'
import Clients from './crm/Clients'
import Masters from './crm/Masters'
import Services from './crm/Services'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/crm" element={<CrmLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="clients" element={<Clients />} />
            <Route path="masters" element={<Masters />} />
            <Route path="services" element={<Services />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  </StrictMode>,
)
