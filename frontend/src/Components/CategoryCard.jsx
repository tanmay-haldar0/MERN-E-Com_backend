import React from 'react'

const CategoryCard = ({ctImg, ctName}) => {
  return (
    <div>
      <div className="rounded-md flex items-center justify-center text-center flex-col sm:p-3 md:p-4 lg:p-7 p-3">
        <img src={ctImg} alt="category image" className='object-cover rounded-full sm:w-[50px] sm:h-[50px] w-[50px] h-[50px] '/>
        <p className="md:text-sm sm:text-sm text-sm font-medium">{ctName}</p>
      </div>
    </div>
  )
}

export default CategoryCard
