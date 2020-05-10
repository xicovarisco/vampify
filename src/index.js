import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import App from './components/App/App';

// Main Styles
import './styles/styles.scss';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#6C2EFF'
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
