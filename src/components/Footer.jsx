import React from 'react';

import {
  Navbar, NavbarGroup, Alignment,
} from '@blueprintjs/core';

function Footer() {
  return (
    <Navbar>
      <NavbarGroup align={Alignment.RIGHT} style={{ fontSize: 10 }}>
        Made by Gabriel Carneiro. Fork me on Github.
      </NavbarGroup>
    </Navbar>
  );
}

export default Footer;
