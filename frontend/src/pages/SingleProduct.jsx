import BreadCrums from '@/components/BreadCrums'
import ProductDesc from '@/components/ProductDesc'
import ProductImg from '@/components/ProductImg'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

function SingleProduct() {
    const {id} = useParams()
    const {products} = useSelector((state) => state.product)
    const product = products.find((item) => item._id === id)
  return (
    <div className='pt-20 py-10 max-w-7xl mx-auto'>
        <BreadCrums product={product}/>
        <div className='mt-10 grid grid-cols-2 items-start'>
            <ProductImg images = {product.productImg} />
            <ProductDesc product = {product} />
        </div>
    </div>
  )
}

export default SingleProduct
