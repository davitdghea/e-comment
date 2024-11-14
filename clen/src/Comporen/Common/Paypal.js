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
                        { amount: { currency_code: currency, value: amount } }
                    ]
                }).then(orderId => orderId)}
                onApprove={(data, actions) => actions.order.capture().then(async (response) => {
                    if (response.status === "COMPLETED") {
                        try {
                            await handleSaveOrder();
                        } catch (error) {
                            console.error("Error saving order:", error);
                            setErrorMessage("Có lỗi xảy ra khi lưu đơn hàng.");
                            Swal.fire('Lỗi', 'Không thể tạo đơn hàng. Vui lòng thử lại.', 'error');
                        }
                    } else {
                        console.log("Lỗi trong quá trình thanh toán.");
                        Swal.fire('Lỗi', 'Giao dịch không thành công. Vui lòng thử lại.', 'error');
                    }
                })}
                onCancel={() => {
                    // Xử lý khi người dùng hủy giao dịch hoặc đóng popup
                    console.log('Giao dịch đã bị hủy bởi người dùng.');
                    Swal.fire('Thông báo', 'Giao dịch đã bị hủy.', 'info');
                }}
                onError={(error) => {
                    console.error("PayPal Error:", error);
                    // Đảm bảo xử lý tốt lỗi từ PayPal, ví dụ lỗi mạng hoặc thanh toán không thành công.
                    Swal.fire('Lỗi', 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.', 'error');
                }}
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

