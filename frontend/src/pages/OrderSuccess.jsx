import { CheckCircle } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function OrderSuccess() {
    const navigate = useNavigate()
    const {user} = useSelector((state) => state.user)
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-6'>
        <div className='bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center'>
            <div className='flex justify-center'>
                <CheckCircle className='h-20 w-20 text-green-500'/>
            </div>

            <h1 className='text-2xl font-bold mt-6 tex-gray-800'>
                Payment Successful 🎉
            </h1>

            <p className='text-gray-600 mt-2'>
                Thank you for your purchase! Your order has been placed Successfully.
            </p>

            <div className='mt-6 flex flex-col gap-3'>
                <button onClick={() => navigate("/products")}
                    className='w-full bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition'
                >
                    Continue Shopping
                </button>

                <button
                onClick={()=> navigate(`/profile/${user._id}`)}
                className='w-full border border-pink-600 text-pink-600 py-3 rounded-xl hover:bg-pink-50 transition'
                >
                    View My orders
                </button>
            </div>

        </div>
      
    </div>
  )
}

export default OrderSuccess
