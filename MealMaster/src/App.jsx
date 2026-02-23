import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dashboard } from './components/Dashboard';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import './App.css'
import AboutUs from './components/AboutUs';
import Login from './components/Login';
import Register from './components/Register';
import RequireAuth from './routes/RequireAuth.jsx';
import SubscriptionBrowse from './components/SubscriptionBrowse.jsx';
import SubscriptionDetails from './components/SubscriptionDetails.jsx';
import UserDashboard from './components/UserDashboard.jsx';
import VendorSubscriptions from './components/VendorSubscriptions.jsx';
import VendorSubscriptionForm from './components/VendorSubscriptionForm.jsx';
import VendorOrders from './components/VendorOrders.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import ContactUs from './components/ContactUs.jsx';
import NotFound from './components/NotFound.jsx';
import SmartPlanner from './components/SmartPlanner.jsx';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* Main layout container */}
      <div className="d-flex flex-column min-vh-100">
        <NavigationBar />
        <ToastContainer />

        {/* Main content area that grows */}
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/subscriptions" element={<SubscriptionBrowse />} />
            <Route path="/subscriptions/:id" element={<SubscriptionDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/register" element={<Register />} />
            <Route path='/about-us' element={<AboutUs />} />
            <Route path='/contact-us' element={<ContactUs />} />

            <Route element={<RequireAuth roles={['User']} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/smart-planner" element={<SmartPlanner />} />
            </Route>

            <Route element={<RequireAuth roles={['Vendor']} />}>
              <Route path="/vendor/subscriptions" element={<VendorSubscriptions />} />
              <Route path="/vendor/subscriptions/new" element={<VendorSubscriptionForm />} />
              <Route path="/vendor/subscriptions/:id/edit" element={<VendorSubscriptionForm />} />
              <Route path="/vendor/orders" element={<VendorOrders />} />
            </Route>

            <Route element={<RequireAuth roles={['Admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
