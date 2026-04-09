import { alpha } from '@mui/material/styles';

export const brand = {
  50: '#F0F7FF',
  100: '#CEE5FD',
  200: '#9CCCFC',
  300: '#6BB1F9',
  400: '#3996F5',
  500: '#077BF1',
  600: '#0261C2',
  700: '#014A94',
  800: '#013265',
  900: '#001B36',
};

export const gray = {
  50: '#FBFCFE',
  100: '#EAF0F5',
  200: '#D6E2EB',
  300: '#BFCCD9',
  400: '#94A6B8',
  500: '#5B6B7C',
  600: '#4C5967',
  700: '#364049',
  800: '#131B20',
  900: '#090E10',
};

export const green = {
  50: '#F6FEF6',
  100: '#E3FBE3',
  200: '#C7F7C7',
  300: '#A1E8A1',
  400: '#51BC51',
  500: '#1F7A1F',
  600: '#136C13',
  700: '#0A470A',
  800: '#042F04',
  900: '#021D02',
};

export const orange = {
  50: '#FFF9EB',
  100: '#FFF3C1',
  200: '#FFECA1',
  300: '#FFDC48',
  400: '#F4C000',
  500: '#DEA500',
  600: '#D18E00',
  700: '#AB6800',
  800: '#8C5800',
  900: '#5A3600',
};

export const red = {
  50: '#FFF0F0',
  100: '#FFDBDB',
  200: '#FFBDBD',
  300: '#FF9090',
  400: '#FF6B6B',
  500: '#E92020',
  600: '#C41C1C',
  700: '#A01818',
  800: '#771111',
  900: '#570C0C',
};

const getDesignTokens = (mode) => ({
  typography: {
    fontFamily: '"IBM Plex Sans", sans-serif',
  },
  palette: {
    mode,
    primary: {
      light: brand[200],
      main: brand[500],
      dark: brand[800],
      contrastText: brand[50],
      ...(mode === 'dark' && {
        contrastText: brand[100],
        light: brand[300],
        main: brand[400],
        dark: brand[800],
      }),
    },
    info: {
      light: brand[100],
      main: brand[300],
      dark: brand[600],
      contrastText: gray[50],
      ...(mode === 'dark' && {
        contrastText: brand[300],
        light: brand[500],
        main: brand[700],
        dark: brand[900],
      }),
    },
    warning: {
      light: orange[300],
      main: orange[400],
      dark: orange[800],
      ...(mode === 'dark' && {
        light: orange[400],
        main: orange[500],
        dark: orange[700],
      }),
    },
    error: {
      light: red[300],
      main: red[400],
      dark: red[800],
      ...(mode === 'dark' && {
        light: red[400],
        main: red[500],
        dark: red[700],
      }),
    },
    success: {
      light: green[300],
      main: green[400],
      dark: green[800],
      ...(mode === 'dark' && {
        light: green[400],
        main: green[500],
        dark: green[700],
      }),
    },
    grey: {
      ...gray,
    },
    divider: mode === 'dark' ? alpha(gray[600], 0.3) : alpha(gray[300], 0.5),
    background: {
      default: '#fff',
      paper: gray[50],
      ...(mode === 'dark' && { default: gray[900], paper: gray[800] }),
    },
    text: {
      primary: gray[800],
      secondary: gray[600],
      ...(mode === 'dark' && { primary: '#fff', secondary: gray[400] }),
    },
    action: {
      selected: `${alpha(brand[200], 0.2)}`,
      ...(mode === 'dark' && {
        selected: alpha(brand[800], 0.2),
      }),
    },
  },
  shape: {
    borderRadius: 10,
  },
  shadows: [
    'none',
    'var(--template-palette-BaseShadow)',
    ...Array(23).fill('none'),
  ],
});

export default function getTheme(mode) {
  return {
    ...getDesignTokens(mode),
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            fontFamily: '"IBM Plex Sans", sans-serif',
          },
          body: {
            fontFamily: '"IBM Plex Sans", sans-serif',
          },
        },
      },
      MuiButtonBase: {
        defaultProps: {
          disableTouchRipple: true,
        },
      },
    },
  };
}
