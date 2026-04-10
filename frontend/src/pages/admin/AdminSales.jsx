import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function AdminSales() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    salesByDate: [],
  })

  const fetchStats = async () => {
    setLoading(true);
    try {
      
      const accessToken = localStorage.getItem("accessToken")
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/sales`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if(res.data.success){
        setStats(res.data)
      }

    } catch (error) {
      console.log(error)

    }
    setLoading(false)
  }

  useEffect(() => {
    fetchStats()
  }, [])
  useEffect(() => {
    console.log(stats)
  }, [stats])

  return (loading ? (<div>Loading...</div>) : <div className='pl-87.5 bg-gray-100 py-20 pr-20 mx-auto px-4'>
      <div className='p-6 grid gap-6 lg:grid-cols-4'>
        <Card className={'bg-pink-500 text-white shadow'}>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className={'text-2xl font-bold'}>{stats.totalUsers}</CardContent>
        </Card>
        <Card className={'bg-pink-500 text-white shadow'}>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className={'text-2xl font-bold'}>{stats.totalProducts}</CardContent>
        </Card>
        <Card className={'bg-pink-500 text-white shadow'}>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className={'text-2xl font-bold'}>{stats.totalOrders}</CardContent>
        </Card>
        <Card className={'bg-pink-500 text-white shadow'}>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent className={'text-2xl font-bold'}>{stats.totalSales}</CardContent>
        </Card>

        <Card className={'lg:col-span-4'}>
          <CardHeader>
            <CardTitle>Sales (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width={"100%"} height={300}>
              <AreaChart data={stats.sales}>
                <XAxis dataKey={"date"}/>
                <YAxis/>
                <Tooltip/>
                <Area type={"monotone"} dataKey={"amount"} stroke='#F47286' fill='#F47286'/>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>)
  
}

export default AdminSales
