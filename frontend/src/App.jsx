import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './state/AuthContext';
import Desktop from './components/Desktop';
import './index.css';

function App() {
    return (
        <Router basename="/luka-aegis-fe">
            <AuthProvider>
                <Desktop />
            </AuthProvider>
        </Router>
    );
}

export default App;
