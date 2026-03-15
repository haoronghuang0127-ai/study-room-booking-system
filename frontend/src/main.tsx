import React from 'react';
import ReactDOM from 'react-dom/client';

// Ant Design components and theming
import { ConfigProvider, App as AntApp, theme } from 'antd';

// Main application component
import App from './App';

// Global styles
import './styles/global.css';

// find the div id 'root' in the HTML and render the React application into it
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>

    {/* Ant Design theme configuration */}
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1768ff',
          borderRadius: 18,
          colorBgLayout: '#f4f7fb',
          colorBgContainer: '#ffffff',
          colorText: '#10233f',
          colorTextSecondary: '#617086',
          fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
        },
      }}
    >
      
      <AntApp>
        <App />
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>,
);