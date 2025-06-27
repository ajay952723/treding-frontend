import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { GripHorizontal, SearchIcon } from 'lucide-react'

import SideBar from './SideBar'

import {  useAppSelector } from '@/State/Store'

const Navbar = () => {
 const auth = useAppSelector((state) => state.auth);
  return (
    <div className="px-4 py-3 border-b z-50 sticky top-0 left-0 right-0 flex justify-between items-center bg-[#0a0f1c]">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="flex items-center justify-center text-white hover:bg-white/10 transition-colors rounded-full">
              <GripHorizontal className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-[#0a0f1c] text-white w-72 p-0 border-r-0 flex flex-col h-screen"
          >
            <div className="flex flex-col h-full">
              {/* Header Section */}
              <div className="p-4">
                <SheetHeader>
                  <SheetTitle>
                    <div className="text-3xl flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src="https://cdn.pixabay.com/photo/2022/12/26/11/37/bitcoin-7678816_640.jpg" />
                      </Avatar>
                      <div className="leading-tight">
                        <div className="font-bold text-orange-700">Ajay</div>
                        <div>Tread</div>
                      </div>
                    </div>
                  </SheetTitle>
                </SheetHeader>
              </div>

              {/* Sidebar content fills remaining space */}
              <div className="flex-1 overflow-y-auto">
                <SideBar />
              </div>
            </div>
          </SheetContent>

        </Sheet>
        <p className='text-sm lg:text-base cursor-pointer'>Ajay Treading</p>
        <div className='p-0 ml09'>
          <Button variant="outline" className='flex item-center gap-3 rounded-full'>
            <SearchIcon/>
            <span>Search</span>
          </Button>
        </div>
      </div>
      <div className=''>
        <Avatar>
          <AvatarFallback>
            {auth.user?.fullName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

export default Navbar
