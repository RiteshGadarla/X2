import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './state/AuthContext';
import Desktop from './components/Desktop';
import './index.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Desktop />
            </AuthProvider>
        </Router>
    );
}

export default App;
