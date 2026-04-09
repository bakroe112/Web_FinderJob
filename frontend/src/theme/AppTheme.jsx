import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getTheme from './themePrimitives';

export default function AppTheme({ children, themeComponents, defaultMode = 'dark' }) {
  const [mode, setMode] = React.useState(defaultMode);

  const theme = React.useMemo(() => {
    return createTheme({
      ...getTheme(mode),
      components: {
        ...getTheme(mode).components,
        ...themeComponents,
      },
    });
  }, [mode, themeComponents]);

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {typeof children === 'function' ? children({ mode, toggleColorMode }) : children}
    </ThemeProvider>
  );
}

AppTheme.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  themeComponents: PropTypes.object,
  defaultMode: PropTypes.oneOf(['light', 'dark']),
};
