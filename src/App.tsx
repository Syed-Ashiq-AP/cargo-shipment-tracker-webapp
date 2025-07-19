import { Provider } from 'react-redux';
import { store } from './store';
import { Dashboard } from './components/SimpleDashboard';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-background">
        <Dashboard />
      </div>
    </Provider>
  );
}

export default App;
