import React from 'react';
import { Route, Switch } from 'react-router';
// import useDarkMode from './hooks/useDarkMode';
import useDarkMode from 'use-dark-mode';
import GlobalStyles from './lib/styles/global';
import loadable from '@loadable/component';
import { ThemeProvider } from '@emotion/react';
import Theme from './lib/styles/Theme';
import Main from './pages/Main';

const Login = loadable(() => import('./pages/Login'));

const App = () => {
  const darkMode = useDarkMode(false);
  return (
    <>
      <ThemeProvider theme={Theme[darkMode.value ? 'dark' : 'light']}>
        <GlobalStyles />
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
      </ThemeProvider>
    </>
  );
};

export default App;
