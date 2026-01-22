import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import Header from './components/Header';
import Footer from './components/Footer';

// Import pages (we'll create these in step 3)
import HomePage from './pages/HomePage';
import HotelListPage from './pages/HotelListPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';

function App() {
  return (
    <BookingProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
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
        </div>
      </Router>
    </BookingProvider>
  );
}

export default App;