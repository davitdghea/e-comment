import React, { useEffect } from 'react';
import { Route, Routes } from "react-router-dom"
import { Finalregister, ReserPass, Home, Login, Public,  DetailProduct, Product } from "./Page/Public/Index"
import path from './Ultils/Path';
import { GetCategory } from './St/App/AsyncAction';  
import { useDispatch,useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Comporen/Common/Modal';
import {AdminLayout,Dashboard,ManageOrider,ManageProducts,CreateProducts, ManageUser,Message} from './Page/Admin/Index'
import { MenberLayout, Pesonal, History, Mycart, WishList, Checkout, DealdeallyCart, Wallet }from './Page/Menter/Index'


function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(GetCategory())
  }, [])
  const { isShowModal, moDalChildren } = useSelector(state => state.app)
  return (
    <div className="min-h-screen font-main w-full">
      
      {isShowModal && <Modal >{moDalChildren}</Modal>}
      <Routes>
        <Route path={path.CHECKOUT} element={<Checkout />} />
        <Route path={path.PUBLIC} element={<Public />}>
         
          <Route path={path.HOME} element={<Home />}></Route>
          <Route path={path.DETAIL_PRODUCT__CATEGORY__PID_TITLE} element={<DetailProduct />}></Route>
          <Route path={path.PRODUCTS} element={<Product />}></Route>
          <Route path={path.ALL} element={<Home />} />
          
          <Route path={path.RESET_PASSWORD} element={<ReserPass />}></Route>
        </Route>
        <Route path={path.ADMIN} element={<AdminLayout/>}>
          <Route path={path.DASHBOARD} element={<Dashboard/>}/>
          <Route path={path.MANAGE_ORDER} element={<ManageOrider />} />
          <Route path={path.MANAGE_PRODUCTS} element={<ManageProducts />} />
          <Route path={path.CREATE_PRODUCTS} element={<CreateProducts />} />
          <Route path={path.MANAGE_USER} element={<ManageUser />} />
          <Route path={path.MESSAGE} element={<Message />} />

        </Route>
        <Route path={path.MEMBER} element={<MenberLayout />}>
          <Route path={path.PERSONAL} element={<Pesonal />} />
          <Route path={path.HISTORY} element={<History />} />
          <Route path={path.MY_CART} element={<DealdeallyCart />} />
          <Route path={path.WISHLIST} element={<WishList />} />
          <Route path={path.WALLET} element={<Wallet />} />
        </Route>
        <Route path={path.Finalregister} element={<Finalregister />}></Route>
        <Route path={path.LOGIN} element={<Login />}/>
        

      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        closeButton={false}
      />
      {/* Same as */}
      {/* <ToastContainer /> */}
    </div>
  );
}
export default App;
