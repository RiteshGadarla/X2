import React from 'react';
import Sidebar from '../components/Sidebar';
<<<<<<< HEAD
=======
import ActivityLogSidebar from '../components/ActivityLogSidebar';
>>>>>>> master
import MockActionToast from '../components/MockActionToast';

const MainLayout = ({ children }) => {
    return (
<<<<<<< HEAD
        <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', background: 'var(--neutral-8)' }}>
=======
        <div className="app-shell">
>>>>>>> master
            {/* Minimal Icon-Only Sidebar */}
            <Sidebar />
            
            {/* Main Content Area */}
<<<<<<< HEAD
            <main style={{ marginLeft: '70px', flex: 1, padding: '0', display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
                {children}
            </main>
=======
            <main className="app-main">
                {children}
            </main>
            <ActivityLogSidebar />
>>>>>>> master
            <MockActionToast />
        </div>
    );
};

export default MainLayout;
