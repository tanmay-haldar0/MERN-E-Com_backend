import React from 'react'

const Banner = ({bannerUrl, bannerTitle, bannerDescription}) => {
  return (
    <>
    <div
        className="text-white flex items-center justify-center flex-col text-center object-cover h-32 py-4 mt-10 mb-10"
        style={{
          backgroundImage: `url(${bannerUrl})`, // Replace with your image // Adjust height as needed
        }}
      >
        <h2 className="text-3xl font-bold">{bannerTitle}</h2>
        <p className='text-xl'>{bannerDescription}</p>
      </div>
    </>
  )
}

export default Banner
