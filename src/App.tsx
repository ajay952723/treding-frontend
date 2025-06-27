import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home'
import Navbar from './pages/Navbar/Navbar'
import Portfolio from './pages/Portfolio/Portfolio'
import Activity from './pages/Activity/Activity'
import Wallet from './pages/Wallet/Wallet'
import PaymentDetails from './pages/Payment-Details/PaymentDetails'
import Withdrawal from './pages/Withdrawal/Withdrawal'
import Profile from './pages/Profile/Profile'
import Watchlist from './pages/Watchlist/Watchlist'
import Search from './pages/Search/Search'
import StockDetails from './pages/StockDetails/StockDetails'
import NotFound from './pages/NotFound/NotFound'
import Auth from './pages/Auth/Auth'
import { useAppDispatch, useAppSelector } from './State/Store'
import { useEffect } from 'react'
import { fetchUserProfile } from './State/Auth/AuthSlice'
import { ToastContainer } from 'react-toastify'

function App() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();



  useEffect(() => {
    dispatch(fetchUserProfile())
  }, [dispatch])


  return (
    <>
      {auth.isLoggedIn ? (
        <div>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/portfolio' element={<Portfolio />} />
            <Route path='/activity' element={<Activity />} />
            <Route path="/wallet/:orderId?" element={<Wallet />} />
            <Route path='/withdrawal' element={<Withdrawal />} />
            <Route path='/payment-details' element={<PaymentDetails />} />
            <Route path='/market/:id' element={<StockDetails />} />
            <Route path='/watchlist' element={<Watchlist />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/search' element={<Search />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
          <ToastContainer />
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
}

export default App;
