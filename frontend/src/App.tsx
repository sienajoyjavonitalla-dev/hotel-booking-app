import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { ToastContainer } from './components/Toast';
import Header from './components/Header';
import Footer from './components/Footer';

// Import pages (we'll create these in step 3)
import HomePage from './pages/HomePage';
import HotelListPage from './pages/HotelListPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';

// Wrapper component to use ToastContext
const ToastContainerWrapper: React.FC = () => {
  const { toasts, removeToast } = useToast();
  return <ToastContainer toasts={toasts} onClose={removeToast} />;
};

function App() {
  return (
    <ToastProvider>
      <BookingProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="container mx-auto px-4 py-8 flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/hotels" element={<HotelListPage />} />
                <Route path="/hotels/:id" element={<HotelDetailsPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/confirmation/:id" element={<BookingConfirmationPage />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainerWrapper />
          </div>
        </Router>
      </BookingProvider>
    </ToastProvider>
  );
}

export default App;