import { apiGetMessage, apiUpdateMessage } from 'Apis/Message';
import { apiGetUsers } from 'Apis/User';
import Chat from 'Comporen/Common/Chat';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function Message() {
  const current = useSelector((state) => state.user);
  const [message, setMessage] = useState([]);
  const [idnhan, setIdnhan] = useState([{
    avatar: null,
    name: null,
    uid: null
  }]);
  const [avatarnhan, setAvatarnhan] = useState([{
    avatar: null,
    name:null,
    uid:null
  }]);
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
      console.log(response.producData)
      console.log(response.producData[0].avatar)
      console.log(response.producData[0].firstname + response.producData[0].lastname)
      setAvatarnhan(prev => [...prev, { uid: userId, avatar: response.producData[0].avatar || "", name: response.producData[0].firstname  +  response.producData[0].lastname}]);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    getMessage();
  }, [current, rend]);

 
    useEffect(() => {
      if (message.length > 0 && message.length >= avatarnhan.length) {
        message.forEach((msg) => {
          const userId = msg.fromUserID === current?.current?._id ? msg.toUserID : msg.fromUserID;
          getOne(userId);
        });
      }
    }, [message]);
  const updateMes = async ({ fromUserID, toUserID }) =>{
    await apiUpdateMessage({ fromUserID: fromUserID, toUserID: toUserID })
    setRend(!rend)
  }

  return (
    <div>
      <header className="top-0 z-30 right-0 left-0 fixed sm:relative text-3xl font-semibold py-4 bg-gray-100 border-b border-b-blue-200">
        <p className="ml-[55px] sm:ml-5">Message</p>
      </header>
      {message?.map((el) => {
        const avatarInfo = avatarnhan.find(
          item => item.uid === (el.fromUserID === current?.current?._id ? el.toUserID : el.fromUserID)
        );

        return (
          <div
            className="flex mt-3 ml-2"
            onClick={() => {
              setIdnhan({uid: avatarInfo.uid, avatar: avatarInfo.avatar || "", name: avatarInfo.name });
              updateMes({ fromUserID: el.fromUserID, toUserID: el.toUserID });
            }}
            key={avatarInfo?.uid}
          >
            <div className='flex'>
              <span>
                <img
                  className="w-[50px] max-h-[50px] object-cover rounded-[50px]"
                  src={
                    el.fromUserID === current?.current?._id
                      ? avatarInfo?.avatar || "https://static.vecteezy.com/system/resources/previews/005/005/788/original/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg"
                      : el?.fromUserAvatar || "https://static.vecteezy.com/system/resources/previews/005/005/788/original/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg"
                  }
                  alt="User Avatar"
                />
              </span>
              <span className="flex flex-col ml-5">
                <span>
                  {el.fromUserID === current?.current?._id
                    ? avatarInfo?.name || "Unknown User"
                    : el?.fromUserName || "Unknown User"}
                </span>
                <span>
                  {el.message !== ""
                    ? el.fromUserID === current?.current?._id
                      ? `bạn: ${el.message}`
                      : el.message
                    : el.fromUserID === current?.current?._id
                      ? `bạn: Đã gửi một ảnh`
                      : `${el.fromUserName} đã gửi một ảnh`}
                </span>
              </span>
            </div>
          </div>
        );
      })}


      {idnhan && idnhan.uid && (
        <div onClick={() => setIdnhan(null)} className="z-50 absolute top-0 bg-overlay bottom-0 left-0 right-0 flex justify-center items-center">
          <Chat 
            rend={rend}
            setRend={setRend}
            fromUserAvatar={idnhan.avatar}
            fromUserName={idnhan.name}
            idnhan={idnhan.uid}
          />
        </div>
      )}
    </div>
  );
}

export default Message;
