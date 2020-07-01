import React from 'react';
import { useHistory } from 'react-router-dom';

import {
  Menu, MenuItem, MenuDivider,
} from '@blueprintjs/core';


function SideMenu() {
  const history = useHistory();

  const goto = (dest) => () => history.push(dest);

  return (
    <Menu style={{ marginLeft: 3 }}>
      <MenuItem icon="search" text="Consulta" onClick={goto('/')} />
      <MenuDivider />
      <MenuItem icon="people" text="Pessoas" onClick={goto('/pessoas')} />
    </Menu>
  );
}

export default SideMenu;
