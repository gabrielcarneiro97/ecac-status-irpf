import React from 'react';

import {
  Menu, MenuItem, MenuDivider,
} from '@blueprintjs/core';


function SideMenu() {
  return (
    <Menu style={{ height: 511, marginTop: 5, marginLeft: 3 }}>
      <MenuItem icon="search" text="Consulta" />
      <MenuDivider />
      <MenuItem icon="people" text="Pessoas" />
    </Menu>
  );
}

export default SideMenu;
