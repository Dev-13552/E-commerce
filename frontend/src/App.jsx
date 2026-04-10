import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Verify from './pages/Verify'
import VerifyEmail from './pages/VerifyEmail'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import AdminSales from './pages/admin/AdminSales'
import AddProduct from './pages/admin/AddProduct'
import AdminProduct from './pages/admin/AdminProduct'
import AdminOrders from './pages/admin/AdminOrders'
import ShowUserOrders from './pages/admin/ShowUserOrders'
import UserInfo from './pages/admin/UserInfo'
import AdminUsers from './pages/admin/AdminUsers'
import ProtectedRoute from './components/ProtectedRoute'
import SingleProduct from './pages/SingleProduct'
import Dashboard from './pages/Dashboard'
import AddressForm from './pages/AddressForm'
import OrderSuccess from './pages/OrderSuccess'
import ForgotPassword from './pages/ForgotPassword'
import ChangePassword from './pages/ChangePassword'

function App() {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <><Navbar/><Home/><Footer/></>
      },
      {
        path: '/login',
        element: <><Login/></>
      },
      {
        path: '/signup',
        element: <><Signup/></>
      },
      {
        path: '/verify',
        element: <><Verify/></>
      },
      {
        path: '/verify/:token',
        element: <><VerifyEmail/></>
      },
      {
        path: '/profile/:userId',
        element: <ProtectedRoute><Navbar/><Profile/></ProtectedRoute>
      },
      {
        path: '/products',
        element: <><Navbar/><Products/></>
      },
      {
        path: '/products/:id',
        element: <><Navbar/><SingleProduct/></>
      },
      {
        path: '/cart',
        element: <ProtectedRoute><Navbar/><Cart/></ProtectedRoute>
      },
      {
        path: '/address',
        element: <ProtectedRoute><AddressForm/></ProtectedRoute>
      },
      {
        path: '/order-success',
        element: <ProtectedRoute><OrderSuccess/></ProtectedRoute>
      },
      {
        path: '/dashboard',
        element: <ProtectedRoute adminOnly = {true}><Navbar/><Dashboard/></ProtectedRoute>,
        children: [
          {
            path: 'sales',
            element: <AdminSales/>
          },
          {
            path: 'add-product',
            element: <AddProduct/>
          },
          {
            path: 'products',
            element: <AdminProduct/>
          },
          {
            path: 'orders',
            element: <AdminOrders/>
          },
          {
            path: 'users/orders/:userId',
            element: <ShowUserOrders/>
          },
          {
            path: 'users/:id',
            element: <UserInfo/>
          },
          {
            path: 'users',
            element: <AdminUsers/>
          },
        ]
      },
      {
        path: '/forgot-password',
        element: <><ForgotPassword/></>
      },
      {
        path: '/change-password/:email',
        element: <><ChangePassword/></>
      },
    ]
  )

  return (  
    <>
      <RouterProvider router = {router}/>
    </>
  )
}

export default App
