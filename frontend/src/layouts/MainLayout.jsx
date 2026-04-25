import Sidebar from '../components/Sidebar';
import ActivityLogSidebar from '../components/ActivityLogSidebar';
import MockActionToast from '../components/MockActionToast';

const MainLayout = ({ children }) => {
    return (
        <div className="app-shell">
            {/* Minimal Icon-Only Sidebar */}
            <Sidebar />
            
            {/* Main Content Area */}
            <main className="app-main">
                {children}
            </main>
            <ActivityLogSidebar />
            <MockActionToast />
        </div>
    );
};

export default MainLayout;
