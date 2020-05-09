import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Header, Footer } from './components/common';
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
        <Header />
        <App />
        <Footer />
      </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
