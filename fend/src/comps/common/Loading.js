import React from 'react';

function Loading({ show, children }) {
  return show ? children : null;
}

export default Loading;