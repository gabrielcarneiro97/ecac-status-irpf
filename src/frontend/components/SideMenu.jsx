import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'antd';
import { withRouter, Link } from 'react-router-dom';

function SideMenu(props) {
  const { location } = props;
  const { pathname } = location;

  return (
    <Menu
      mode="inline"
      theme="dark"
      selectedKeys={[pathname]}
      style={{ borderRight: 0 }}
    >
      <Menu.Item key="/">
        <Link to="/">
          <Icon type="home" />
          <span>
            Tela Inicial
          </span>
        </Link>
      </Menu.Item>
      <Menu.Item key="/config">
        <Link to="/config">
          <Icon type="setting" />
          <span>
            Configurações
          </span>
        </Link>
      </Menu.Item>
    </Menu>
  );
}

SideMenu.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default withRouter(SideMenu);
