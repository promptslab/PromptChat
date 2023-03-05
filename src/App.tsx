import { ThemeProvider } from "@emotion/react";
import { yellow } from '@mui/material/colors';
import { Box, createTheme, CssBaseline } from "@mui/material";
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.scss";
import { GptChatBot } from "./pages/GptChatBot";

const LazyLoadedFooter = lazy(() => {
  return import('./Footer')
});



const App = () => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        
        setMode((prevMode) => {
          appendClass(prevMode)
          return (prevMode === 'light' ? 'dark' : 'light')
        });
      },
    }),
    [],
  );

  const appendClass = (mode) => {
    const body = document.body;
    if(mode === 'light'){
      body.classList.add('dark-theme')
      body.classList.remove('light-theme')
    } else {
      body.classList.add('light-theme')
      body.classList.remove('dark-theme')
    }
  }
  
  const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#705cf6',
            contrastText: "#fff"
          },
        },
        components: {
          MuiButton : {
            defaultProps : {
              
            },
            styleOverrides: {
              colorInherit : yellow[500],
              outlined: {
                backgroundColor: "transparent",
                borderColor: "#fafafa9e",
                color: '#fff'
              }
            }
          }
        },
        typography: {
          fontFamily: [
            'Inter',
            'sans-serif',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
        },
      }),
    [mode],
  );
  
  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
            <Box
              sx={{
                flexGrow: 1,
                minWidth: 'inherit',
                minHeight: 'inherit',
              }}
            >
              <div className="prompt-engine flex-column d-flex flex-column w-100">
                <Routes>
                  <Route path="/" element={<GptChatBot />} />
                </Routes>
              </div>
            </Box>
            <Suspense fallback={"Loading"}>
              <LazyLoadedFooter />
            </Suspense>
          
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
};

export default App;
