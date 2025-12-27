
import React from 'react';
import { Layout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Header } = Layout;

const HeaderBar = ({ collapsed, toggle }) => (
  <Header
    style={{
      background: 'var(--header-bg)',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}
  >
    <Button
      type="text"
      icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      onClick={toggle}
      aria-label="Toggle sidebar"
    />
    <h3 style={{ margin: 0, color: 'var(--text-color)' }}>Medical Reporting Dashboard</h3>
  </Header>
);

export default HeaderBar;
