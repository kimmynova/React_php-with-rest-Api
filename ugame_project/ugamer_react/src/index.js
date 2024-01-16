import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { DarkmodePrvider } from './Darkmode';
import { AlertProvider } from './alertmesengebox/alert';
import { DatetimeProvider } from './alertmesengebox/date';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <DarkmodePrvider>
      <AlertProvider>
        <DatetimeProvider>
    <App />
    </DatetimeProvider>
    </AlertProvider>
    </DarkmodePrvider>
  </React.StrictMode>
);


