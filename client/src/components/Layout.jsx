// components/Layout.jsx
const Layout = ({ children, type = 'default' }) => {
  return <div className="min-h-screen">{children}</div>;
};

export default Layout;
