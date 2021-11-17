import React from 'react';
import styled from '@emotion/styled';
import useDarkMode from 'use-dark-mode';

const Main = () => {
  const darkMode = useDarkMode(false);
  return (
    <div className="main">
      <h1>Main Page..</h1>
      <button onClick={darkMode.toggle}>dark mode</button>
    </div>
  );
};
export default Main;
