import AppSidebar from '../components/Sidebar';
import ActivityLogSidebar from '../components/ActivityLogSidebar';
import MockActionToast from '../components/MockActionToast';

const MainLayout = ({ children }) => (
    <div className="app-layout">
        <AppSidebar />
        <main className="app-main">
            {children}
        </main>
        <ActivityLogSidebar />
        <MockActionToast />
    </div>
);

export default MainLayout;
