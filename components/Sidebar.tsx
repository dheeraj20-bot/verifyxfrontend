'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Upload, Settings, List, FileCheck, CherryIcon } from 'lucide-react'

const navItems = [
  { name: 'Upload', href: '/', icon: Upload },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'review', href: '/dashboard', icon: List },
  { name: 'Verify', href: '/verify', icon: FileCheck },
]

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar for larger screens */}
      <aside 
      className={`hidden md:flex flex-col w-64 bg-white p-4 ${isSidebarOpen ? '' : 'md:w-24'}`}>
        <Button
          variant="ghost"
          className="mb-4 justify-start"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <CherryIcon className=' text-blue-500' />
        </Button>
        <nav className="flex flex-col space-y-5">
          {navItems.map((item) => (
            <Link className='' key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className={`w-full flex rounded-xl
                   ${isSidebarOpen ? ' justify-start' : ''}`}
              >
                <item.icon className="mr-2  h-5 w-5" />
                {isSidebarOpen && item.name}
              </Button>
            </Link>
          ))}
        </nav>
      </aside>

      

      {/* Bottom navbar for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 py-2  bg-white border-t">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className="flex flex-col items-center py-2"
              >
                <item.icon className=" h-14 w-14" />
                
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}