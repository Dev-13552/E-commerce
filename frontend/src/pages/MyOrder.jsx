import OrderCard from "@/components/OrderCard";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function MyOrder() {
  const [userOrders, setUserOrders] = useState([]);
  const navigate = useNavigate();
  const getUserOrders = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/myorder`,
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
    <OrderCard userOrders = {userOrders} navigate = {navigate}/>
  );
}

export default MyOrder;
