import React, { useState, useEffect } from 'react';
import { Layout, Drawer } from 'antd';
import SidebarMenu from './SidebarMenu';
import HeaderBar from './HeaderBar';
import FooterBar from './FooterBar';

const { Sider, Content, Header, Footer } = Layout;

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size dynamically
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992); // Medium breakpoint
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggle = () => setCollapsed((prev) => !prev);

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* ✅ Sidebar (Desktop only) */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={220}
          style={{
            background: '#001529',
            minHeight: '100vh',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: 64,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 16,
              borderBottom: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {collapsed ? 'MR' : 'Med Reports'}
          </div>
          <SidebarMenu />
        </Sider>
      )}

      {/* ✅ Main layout (Always rendered) */}
      <Layout
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0, // fixes width:0 bug
          background: '#f5f6fa',
        }}
      >
        {/* Header */}
        <Header
          style={{
            padding: 0,
            background: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <HeaderBar collapsed={collapsed} toggle={toggle} />
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#fff',
            flex: 1,
            overflow: 'auto',
            borderRadius: 8,
          }}
        >
          {children}
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign: 'center',
            background: '#fff',
            borderTop: '1px solid #eee',
            color: '#666',
          }}
        >
          <FooterBar />
        </Footer>
      </Layout>

      {/* ✅ Mobile Drawer Sidebar */}
      {isMobile && (
        <Drawer
          title="Medical Reports"
          placement="left"
          closable
          onClose={() => setCollapsed(false)}
          open={collapsed}
          bodyStyle={{ padding: 0 }}
        >
          <SidebarMenu />
        </Drawer>
      )}
    </Layout>
  );
};

export default AppLayout;
