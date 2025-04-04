import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar';

const AppLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ 
        flexGrow: 1,
        backgroundColor:"#f5f6fa",
        padding: '24px',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: '64px'
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;