import React from 'react'

const Banner = ({ bannerUrl, bannerTitle, bannerDescription }) => {
  return (
    <>
      <div
        className="text-white flex items-center justify-center flex-col text-center object-cover h-40 sm:h-48 md:h-64 py-4 mt-10 mb-10 px-6 sm:px-10"
        style={{
          backgroundImage: `url(${bannerUrl})`, // Replace with your image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold">{bannerTitle}</h2>
        <p className="text-sm sm:text-xl md:text-2xl mt-2">{bannerDescription}</p>
      </div>
    </>
  )
}

export default Banner
