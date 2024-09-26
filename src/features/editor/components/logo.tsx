import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const Logo = () => {
  return (
    <Link href={'/'}>
      <div
       className=' size-6 relative shrink-0'
      >
       <Image
        src='/logo3.svg'
        alt='thumblify logo'
        fill
        className='shrink-0 hover:opacity-75 transition'
       />
      </div>
    </Link>
  )
}
