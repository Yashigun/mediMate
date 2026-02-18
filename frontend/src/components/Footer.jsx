import React from 'react'

const Footer = () => {
  return (
    <footer className='w-full bg-gradient-to-r from-secondary to-white border-t border-gray-200 py-3 mt-auto '>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='flex flex-col items-center justify-center space-y-0'>
          
          {/* Copyright text */}
          <div className='text-gray-600 text-sm font-medium tracking-wide'>
            Copyright 2025 &copy; <span className='text-primary font-semibold'>MediMate</span>. All rights reserved.
          </div>
          
          {/* Made with love */}
          <div className='text-gray-500 text-sm flex items-center gap-1'>
            Made with <span className='text-red-500 text-base'>❤️</span>
          </div>
          
        </div>
      </div>
    </footer>
  )
}

export default Footer