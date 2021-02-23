/**
 * @format
 */
import * as React from 'react';
import { ModalPortal } from 'react-native-modals';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

const app = () => {
    return (
        <>
            <App />
            <ModalPortal />
        </>
    )
}
AppRegistry.registerComponent(appName, () => app);
