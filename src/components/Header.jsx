import React from 'react';

import {
  Navbar, NavbarGroup, NavbarHeading, Alignment,
} from '@blueprintjs/core';


function Header() {
  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading>Consulta e-CAC</NavbarHeading>
      </NavbarGroup>
    </Navbar>
  );
}

export default Header;
