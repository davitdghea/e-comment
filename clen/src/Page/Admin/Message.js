import { apiGetMessage, apiUpdateMessage } from 'Apis/Message';
import { apiGetUsers } from 'Apis/User';
import Chat from 'Comporen/Common/Chat';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function Message() {
  const current = useSelector((state) => state.user);
  const [message, setMessage] = useState([]);
  const [idnhan, setIdnhan] = useState(null);
  const [avatarnhan, setAvatarnhan] = useState(null);
 const [rend,setRend] = useState(false)
  const getMessage = async () => {
    try {
      const response = await apiGetMessage({ recipientId: current?.current?._id });
      setMessage(response);
      console.log("API Response:", response);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const getOne = async (userId) => {
    try {
      const response = await apiGetUsers({ _id: userId });
      setAvatarnhan(response.producData);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    getMessage();
  }, [current, rend]);

  useEffect(() => {
    if (message.length > 0 ) {
      const userId = message?.[0].fromUserID === current?.current?._id ? message?.[0].toUserID : message?.[0].fromUserID;
      getOne(userId);
    }
  }, [message]);
  const updateMes = async ({ fromUserID, toUserID }) =>{
    await apiUpdateMessage({ fromUserID: fromUserID, toUserID: toUserID })
    setRend(!rend)
  }
  console.log(message?.[0]?.fromUserID)
  console.log(idnhan)
  return (
    <div>
      <header className="top-0 z-30 right-0 left-0 fixed sm:relative text-3xl font-semibold py-4 bg-gray-100 border-b border-b-blue-200">
        <p className="ml-[55px] sm:ml-0">Message</p>
      </header>
      {message?.map((el) => (
        <div className="flex mt-3 ml-2" onClick={() => { setIdnhan(el); updateMes({ fromUserID: el.fromUserID, toUserID: el.toUserID }) }} key={el._id}>
          <span>
            <img
              className="w-[50px] max-h-[50px] object-cover rounded-[50px]"
              src={
                el.fromUserID === current?.current?._id
                  ? avatarnhan?.[0]?.avatar
                  : el?.fromUserAvatar || "https://static.vecteezy.com/system/resources/previews/005/005/788/original/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg"
              }
              alt="User Avatar"
            />
          </span>
          <span className="flex flex-col ml-5">
            <span>
              {el.fromUserID === current?.current?._id
                ? `${avatarnhan?.[0]?.firstname || ''} ${avatarnhan?.[0]?.lastname || ''}`
                : el?.fromUserName || 'Unknown User'}
            </span>
            <span>
              {el.message !== ""
                ? (el.fromUserID === current?.current?._id
                  ? `bạn: ${el.message}`
                  : el.message)
                : (el.fromUserID === current?.current?._id
                  ? `bạn: Đã gửi một ảnh`
                  : `${el.fromUserName} đã gửi một ảnh`)
              }
            </span>
          </span>
        </div>
      ))}

      {idnhan && idnhan.fromUserID && (
        <div onClick={() => setIdnhan(null)} className="z-50 absolute top-0 bg-overlay bottom-0 left-0 right-0 flex justify-center items-center">
          <Chat 
            rend={rend}
            setRend={setRend}
            fromUserAvatar={idnhan.fromUserID === current?.current?._id ? avatarnhan?.[0]?.avatar : idnhan?.fromUserAvatar}
            fromUserName={idnhan.fromUserID === current?.current?._id ? `${avatarnhan?.[0]?.firstname || ''} ${avatarnhan?.[0]?.lastname || ''}` : idnhan?.fromUserName}
            idnhan={idnhan.fromUserID === current?.current?._id ? idnhan.toUserID : idnhan.fromUserID}
          />
        </div>
      )}
    </div>
  );
}

export default Message;
