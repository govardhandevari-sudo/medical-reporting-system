
import React from 'react';
import { Menu } from 'antd';
import {
  DollarOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: '/', icon: <DollarOutlined />, label: 'Revenue Report' },
    { key: '/reports/location-hd-summary', icon: <PieChartOutlined />, label: 'Location & HD Summary'},
    { key: '/doctor-share', icon: <BarChartOutlined />, label: 'Doctor Share Report' },
    { key: '/service-wise', icon: <LineChartOutlined />, label: 'Service Wise Collection' }    
  ];

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={({ key }) => navigate(key)}
      items={items}
    />
  );
};

export default SidebarMenu;
