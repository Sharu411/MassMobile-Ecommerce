// src/components/admin/AdminNavbar.js
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Layout, Menu, Drawer, Button, Grid } from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  UserOutlined,
  CloseCircleOutlined,
  UndoOutlined,
  PictureOutlined,
  MenuOutlined,
} from '@ant-design/icons';

const { Header } = Layout;
const { useBreakpoint } = Grid;

export default function AdminNavbar() {
  const location = useLocation();
  const screens = useBreakpoint();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <DashboardOutlined /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCartOutlined /> },
    { name: 'Products', path: '/admin/products', icon: <AppstoreOutlined /> },
    { name: 'Customers', path: '/admin/customers', icon: <UserOutlined /> },
    { name: 'Cancelled Orders', path: '/admin/cancelled_order', icon: <CloseCircleOutlined /> },
    { name: 'Return Orders', path: '/admin/return-orders', icon: <UndoOutlined /> },
    { name: 'Popup Settings', path: '/admin/welcome-popup', icon: <PictureOutlined /> },
  ];

  const renderMenuItems = () =>
    navItems.map((item) => (
      <Menu.Item key={item.path} icon={item.icon}>
        <NavLink to={item.path} onClick={() => setDrawerVisible(false)}>
          {item.name}
        </NavLink>
      </Menu.Item>
    ));

  return (
    <Header
      style={{
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px #f0f1f2',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Admin Panel</div>

      {/* Desktop View */}
      {screens.md ? (
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ lineHeight: '64px', borderBottom: 'none' }}
        >
          {renderMenuItems()}
        </Menu>
      ) : (
        <>
          {/* Mobile Menu Button */}
          <Button
            icon={<MenuOutlined />}
            type="text"
            onClick={() => setDrawerVisible(true)}
          />
          {/* Mobile Drawer */}
          <Drawer
            title="Admin Menu"
            placement="right"
            closable
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
          >
            <Menu
              mode="vertical"
              selectedKeys={[location.pathname]}
              style={{ borderRight: 'none' }}
            >
              {renderMenuItems()}
            </Menu>
          </Drawer>
        </>
      )}
    </Header>
  );
}
