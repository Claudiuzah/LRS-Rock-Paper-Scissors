import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './router.jsx';
import './App.css';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import AuthProvider from 'react-auth-kit/AuthProvider';
import createStore from 'react-auth-kit/createStore';
import { WebSocketProvider } from './components/websockets.jsx';

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider>
      <AuthProvider store={store}>
        <WebSocketProvider>
          <Router />
        </WebSocketProvider>
      </AuthProvider>
    </MantineProvider>
  </React.StrictMode>,
);
