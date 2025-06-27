import {
  ActivityIcon,
  BookmarkIcon,
  CreditCardIcon,
  HomeIcon,
  LandmarkIcon,
  LayoutDashboard,
  LogOutIcon,
  PersonStandingIcon,
  WalletIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { SheetClose } from '@/components/ui/sheet'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/State/Store'
import { logout } from '@/State/Auth/AuthSlice'

const menu = [
  { name: 'Home', path: '/', icons: <HomeIcon className="h-5 w-5" /> },
  { name: 'Portfolio', path: '/portfolio', icons: <LayoutDashboard className="h-5 w-5" /> },
  { name: 'Watchlist', path: '/watchlist', icons: <BookmarkIcon className="h-5 w-5" /> },
  { name: 'Activity', path: '/activity', icons: <ActivityIcon className="h-5 w-5" /> },
  { name: 'Wallet', path: '/wallet', icons: <WalletIcon className="h-5 w-5" /> },
  { name: 'Payment Details', path: '/payment-details', icons: <LandmarkIcon className="h-5 w-5" /> },
  { name: 'Withdrawal', path: '/withdrawal', icons: <CreditCardIcon className="h-5 w-5" /> },
  { name: 'Profile', path: '/profile', icons: <PersonStandingIcon className="h-5 w-5" /> },
  { name: 'Logout', path: '/', icons: <LogOutIcon className="h-5 w-5" /> },
]

const SideBar = () => {
  const navigate= useNavigate()
  const dispatch=useAppDispatch();

  const handleLogout = ()=>{
    dispatch(logout())
  }




  
  return (
    <div className="space-y-3 px-3 pb-4"> {/* Don't go overboard with padding */}
      {menu.map((item) => (
        <SheetClose asChild key={item.name}>
          <Button
            variant="ghost"
            className="w-full flex items-center gap-4 px-4 py-3 bg-white/5 hover:bg-white/10 
            text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-md"
            onClick={()=>{
              navigate(item.path)
              if (item.name==="Logout") {
                handleLogout()
              }
            }}
          >
            <span className="text-white">{item.icons}</span>
            <span className="text-sm font-medium tracking-wide">{item.name}</span> <br />
          </Button>
        </SheetClose>
      ))}
    </div>
  )
}

export default SideBar
