import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Notifications } from './components/Notifications';
import './styles/main.scss';

ReactDOM.render(
    <React.StrictMode>
        <ErrorBoundary>
            <Notifications />
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById('root')
); 