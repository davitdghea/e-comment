import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { apiCreateOrder } from "Apis/Products";
import {  apiUpdateMoney } from "Apis/User";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const style = { "layout": "vertical" };

const ButtonWrapper = ({ currency, showSpinner, payload, setIsSuccess, amount, isSuccess }) => {
   
    const navigate = useNavigate();
    const [{ isPending, options }, dispatch] = usePayPalScriptReducer();
    useEffect(() => {
        dispatch({
            type: 'resetOptions',
            value: {
                ...options, currency: currency
            }
        });
    }, [currency, showSpinner]);

    const [errorMessage, setErrorMessage] = useState('');

    const handleSaveOrder = async () => {
        if (payload.products)
            {try {
            const response = await apiCreateOrder({ ...payload, status: "Order" });
            if (response.success) {
                setIsSuccess(true);
                Swal.fire('Chúc mừng!', 'Đơn hàng đã được tạo.', 'success').then(() => {
                    navigate('/');
                });
            }
        } catch (error) {
            console.error("Error creating order:", error);
            setErrorMessage('Có lỗi xảy ra khi tạo đơn hàng: ' + error.message);
        }}
        else {try {
            
            const response = await apiUpdateMoney({ nap: +payload.total });
            if (response.success) {
                setIsSuccess(!isSuccess);
                toast.success(`Nạp thành công ${payload.total} VNĐ`)
            }
        } catch (error) {
            console.error("Error creating order:", error);
            setErrorMessage('Có lỗi xảy ra khi tạo nạp: ' + error.message);
        }}
    };
    // Trong JSX
    { errorMessage && <div className="error">{errorMessage}</div> }


    return (
        <>
            {showSpinner && isPending && <div className="spinner" />}
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[style, currency, amount]}
                fundingSource={undefined}
                createOrder={(data, actions) => actions.order.create({
                    purchase_units: [
                        { amount: { currency_code: currency, value: amount },
                            shipping: {
                                address: {
                                    address_line_1: payload?.address || 'nạp tiền',
                                    address_line_2: "",
                                    admin_area_2: "ninh binh",
                                    admin_area_1: "NB",
                                    postal_code: "08200",
                                    country_code: "VN"
                                },
                                name: {
                                    full_name: "Biên"
                                }
                            } }
                    ]

                }).then(orderId => orderId)}

                onApprove={(data, actions) => actions.order.capture().then(async (response) => {
                    if (response.status === "COMPLETED") {
                        await handleSaveOrder();
                    } 
                })}
            />
        </>
    );
};

export default function Paypal({ payload, setIsSuccess, amount, isSuccess }) {
    return (
        <div style={{width:"100%", maxWidth: "750px", minHeight: "200px", margin: 'auto' }}>
            <PayPalScriptProvider options={{ clientId:`Aeyhld3gudnXmK6ENvvCEV_Wr2LFG-kB1U-4mQf6sRy3DBIlKmoAXnGi9gtY8cNwsVMux870fAbFDj1r` , components: "buttons", currency: "USD" }}>
                <ButtonWrapper amount={+amount * 100 / 100} payload={payload} isSuccess={isSuccess} setIsSuccess={setIsSuccess} currency={'USD'} showSpinner={false} />
            </PayPalScriptProvider>
        </div>
    );
}










// import {
//     PayPalScriptProvider,
//     PayPalButtons,
//     usePayPalScriptReducer
// } from "@paypal/react-paypal-js";
// import { apiCreateOrder } from "Apis/Products";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

// // This value is from the props in the UI
// const style = { "layout": "vertical" };
// // Custom component to wrap the PayPalButtons and show loading spinner
// const ButtonWrapper = ({ currency, showSpinner, amount, payload, setIsSuccess }) => {
//     const navigate= useNavigate()
//     const [{ isPending, options }, dispatch] = usePayPalScriptReducer();
//     useEffect(() => {
//         dispatch({
//             type: 'reserOptions',
//             value: {
//                 ...options, currency: currency
//             }
//         })
//     }, [currency, showSpinner])
//     const handleSaveOrder = async () => {
//         const response = await apiCreateOrder({ ...payload, status: "Succeed" })
//         if (response.success) {
//             setIsSuccess(true)
//             setTimeout(() => {
//                 Swal.fire('Congrat!', 'Order was created.', 'success').then(() => {
//                     navigate('/')
//                 })
//             }, 500)
//         }
//     }
//     return (
//         <>
//             {(showSpinner && isPending) && <div className="spinner" />}
//             <PayPalButtons
//                 style={style}
//                 disabled={false}
//                 forceReRender={[style, currency, amount]}
//                 fundingSource={undefined}
//                 createOrder={(data, actions) => actions.order.create({
//                     purchase_units: [
//                         { amount: { currency_code: currency, value: amount } }
//                     ]
//                 }).then(orderId => orderId)}
//                 onApprove={(data, actions) => actions.order.capture().then(async (response) => {
//                     if (response.status === "COMPLETED") {
//                         handleSaveOrder()
//                     }
//                 })}
//             />
//         </>
//     );
// }

// export default function Paypal({ amount, payload, setIsSuccess }) {
//     return (
//         <div style={{ maxWidth: "750px", minHeight: "200px", margin: 'auto' }}>
//             <PayPalScriptProvider options={{ clientId: 'AdET-ar8Aqq7_4VMR07z4N3pIrrK-6QtSgbsPPsZZhFAHXsjm73rtrtQJTsA7wB7b6UORjcU-n0ELaNJ', components: "buttons", currency: "USD" }}>
//                 <ButtonWrapper payload={payload} setIsSuccess={setIsSuccess} currency={'USD'} showSpinner={false} amount={amount} />
//             </PayPalScriptProvider>
//         </div>
//     );
// }