
import {  MantineProvider, MantineTheme, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { MedplumClient } from '@medplum/core';
import { MedplumProvider } from '@medplum/react';
import '@medplum/react/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App'; 

const medplum = new MedplumClient({
  // To run FooMedical locally, you can set the baseURL in this constructor
  // baseUrl: http://localhost:8103
  onUnauthenticated: () => (window.location.href = '/'),
});

const theme = createTheme({
  colors: {
    // Custom colors for primary (blue) and secondary (cyan)
    primary: ['#FFB55D', '#FFB55D', '#FFB55D', '#FFB55D', '#FFB55D', '#FFB55D', '#FFB55D', '#FFB55D', '#FFB55D', '#FFB55D'],
    secondary: ['#FEF9EF', '#FEF9EF', '#FEF9EF', '#FEF9EF', '#FEF9EF', '#FEF9EF', '#FEF9EF', '#FEF9EF', '#FEF9EF', '#FEF9EF'],
    // Background colors
    background: ['#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd', '#6c757d', '#495057', '#343a40', '#212529'],
  },
  primaryColor: 'primary',
  primaryShade: 5,
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },
  components: {
    Container: {
      defaultProps: {
        size: 1200,
      },
    }, 
  }, 
});

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <BrowserRouter>
      <MedplumProvider medplum={medplum}>
        <MantineProvider theme={theme}>
          <Notifications />
          <App />
        </MantineProvider>
      </MedplumProvider>
    </BrowserRouter>
  </StrictMode>
);
