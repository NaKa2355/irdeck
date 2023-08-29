import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./i18n/config"


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <App></App>
)
/*
root.render(
    <React.StrictMode>
        <MantineProvider withNormalizeCSS withGlobalStyles theme={{primaryColor: 'dark'}}>
            <Notifications />
            <RootRouter/>
        </MantineProvider>
    </React.StrictMode>
);
*/

//<iframe width='100%' height='100%' style={{padding:0, margin:0}} src='http://bridge.local:8581'/>
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
