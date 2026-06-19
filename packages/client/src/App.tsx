import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-loading-skeleton/dist/skeleton.css';
import './App.css';
import ReviewList from './components/reviews/ReviewList';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-4 h-screen">
        <ReviewList productId={1} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
