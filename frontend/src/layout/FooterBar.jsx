
import React from 'react';
import { Layout } from 'antd';
const { Footer } = Layout;

const FooterBar = () => (
  <Footer style={{ textAlign: 'center', background: 'var(--footer-bg)', color: '#666' }}>
    © {new Date().getFullYear()} Medical Reports System | Powered by React + Node.js
  </Footer>
);

export default FooterBar;
