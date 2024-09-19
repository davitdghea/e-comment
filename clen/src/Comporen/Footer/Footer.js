import React from 'react'
import icons from "Ultils/Icons"
const Footer = () => {
    const {MdEmail} = icons
  return (
    <div className='w-full bg-main'>
       
        <div className='flex items-center justufy-center h-[103px] m-auto w-main'>
            <div className="flex flex-1  flex-col text-gray-200">
                <span className='text-[20px]'>SIGN UP TO NEWSLETTER</span>
                <small className='text-[13px]'>Subscribe now and receive weelky newsletter</small>
            </div>    
            {/* <div className='flex-1 flex '>
            <input 
                className='p-4 rounded-l-full  flex w-full bg-[#F04646] outline-none text-gray-100'
                placeholder='Email address'/> 
            <div className='h-[56px] w-[56px] text-gray-200 flex items-center justify-center rounded-r-full bg-[#F04646]'><MdEmail size={16} /></div>
            </div> */}
        </div>
        <div className='flex items-center justufy-center h-[407px] bg-gray-800 w-full'>
            <div className="w-main m-auto flex items-center">
                <div className='flex-2 h-[250px]'>
                    <h1 className='md-[20px] mb-[10px] text-[15px] text-gray-300 border-l-2 border-[red] p-[15px] size-15px'>ABOUT US</h1>
                    <div className='flex flex-col text-gray-200'>
                    <span>
                        <span>Address:</span>
                        <span className='opacity-70'> 2 Nguyễn Thi Định, Lạc Long Quân, Hà Nội </span>
                    </span>
                    <span>
                        <span> Phone:</span>
                        <span className='opacity-70'> (+1234)56789xxx</span>
                    </span>
                    <span>
                        <span> Mail:</span>
                        <span className='opacity-70'> tadathemes@gmail.com</span>
                    </span>
                    </div>
                </div>
                <div className='h-[250px] flex-1 flex flex-col text-gray-300'>
                <h1 className='md-[20px] mb-[10px] text-[15px] text-gray-300 border-l-2 border-[red] p-[15px] size-15px'>INFORMATION</h1>
                  <span className='opacity-70'>Typography</span>
                  <span className='opacity-70'>Gallery</span>
                  <span className='opacity-70'>Store Location</span>
                  <span className='opacity-70'>Today's Deals</span>
                  <span className='opacity-70'>Contact</span>
                </div>
                <div className='h-[250px] flex-1 flex flex-col text-gray-300'>
                <h1 className='md-[20px] text-[15px] text-gray-300 border-l-2 border-[red] p-[15px] size-15px'>WHO WE ARE</h1>
                <span className='opacity-70'>Help</span>
                  <span className='opacity-70'>Free Shipping</span>
                  <span className='opacity-70'>FAQs</span>
                  <span className='opacity-70'>Return & Exchange</span>
                  <span className='opacity-70'>Testimonials</span>
                </div>
                <div className='flex-1 h-[250px]'>
                <h1 className='md-[20px] text-[15px] text-gray-300 border-l-2 border-[red] p-[15px] size-15px'>#DIGITALWORLDSTOR</h1>
                </div>
               




                
            </div>
        </div>
        
    </div>
  )
}

export default Footer