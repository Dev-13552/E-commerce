import OrderCard from '@/components/OrderCard';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

function ShowUserOrders() {
    const [userOrders, setUserOrders] = useState([]);
    const navigate = useNavigate()
    const params = useParams()
  const getUserOrders = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/user-order/${params.userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        setUserOrders(res.data.orders);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while fetching orders");
    }
  };
    useEffect(() => {
      getUserOrders();
    }, [userOrders]);
  return (
    <div>
      <OrderCard userOrders={userOrders} navigate={navigate}/>
    </div>
  )
}

export default ShowUserOrders
