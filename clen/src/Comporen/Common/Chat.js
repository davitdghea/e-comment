import { apiGetMessageOne } from 'Apis/Message';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { VscChromeClose } from "react-icons/vsc";
import { IoMdAddCircle } from "react-icons/io";
import { FaCamera } from "react-icons/fa6";
import { IoMdPhotos } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Chat = ({ StyleDiv, onClose, idnhan = '670f5f0bcb44f62340a29d24', fromUserAvatar, fromUserName, Style = "relative z-50 bg-white w-full max-w-[600px] rounded-lg border border-gray-300" }) => {
    const current = useSelector(state => state.user);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [userStatuses, setUserStatuses] = useState({});
    const [dataChat, setDataChat] = useState([]);
    const endOfChatRef = useRef(null);
    const socketRef = useRef(null);
    const fileInputRef = useRef(null);
    const getOne = async () => {
        try {
            const response = await apiGetMessageOne({ toUserID: idnhan, fromUserID: current.current._id });
            setDataChat(response);
        } catch {
            setDataChat([]);
        }
    };

    const sendFile = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            const buffer = reader.result; 
            socketRef.current.emit("send-file", { buffer, senderId: current.current._id }); 
        };
        reader.readAsArrayBuffer(file); 
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = ["image/png", "image/jpeg"];
            if (allowedTypes.includes(file.type)) {
                sendFile(file);
            } else {
                toast.error("Chỉ gửi được file ảnh PNG và JPG.")
               
            }
        }
    };
    useEffect(() => {
        socketRef.current = io('http://localhost:5000',{
            query: { userId: current.current._id }
        });
        socketRef.current.on("updateUserStatuses", (statuses) => {
            setUserStatuses(statuses);
        });
        socketRef.current.on("connect", () => {
            socketRef.current.emit('setUser', { userId: current.current._id });
            console.log(current.current._id + " Connected to server");
        });
        socketRef.current.on("receive-file", (fileData) => {
            const { file, } = fileData;
            const fileUrl = fileData.file; // Đường dẫn file
            const newMessage = {
                senderId: fileData.senderId,
                files: `<Link to={http://localhost:5000${fileUrl}}>
                           <img src="http://localhost:5000${fileUrl}" alt="Sent file" class="max-w-[150px]" />
                        </Link>`,
            };
           
            setChat((prevChat) => [...prevChat, newMessage])
            scrollToBottom();
            socketRef.current.emit("sendMessage", {
                senderId: current.current._id,
                recipientId: idnhan, 
                message: '',
                senderName: `${current.current.firstname} ${current.current.lastname}`, 
                senderAvatar: current.current?.avatar || '', 
                filePath: file, 
            });
        });
        socketRef.current.on("userStatusChange", (data) => {
            setUserStatuses((prevStatuses) => ({
                ...prevStatuses,
                [data.userId]: data.status,
            }));
        });
        socketRef.current.on('receiveMessage', (data) => {
           
            setChat((prevChat) => [...prevChat, data]);
            scrollToBottom();
        });
        return () => {
            socketRef.current.emit('disconnectUser', { userId: current.current._id });
            socketRef.current.disconnect();
        };
    }, []); 
    useEffect(() => {
        scrollToBottom();
    }, [chat, current]); 

    const scrollToBottom = () => {
        setTimeout(() => {
            endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300); 
    }

    useEffect(() => {
        getOne();
    }, [current]);

   
    const sendMessage = () => {
        if (message.trim().length !== 0){
            const senderId = current.current._id;
            const senderName = `${current.current.firstname} ${current.current.lastname}`;
            const senderAvatar = current.current?.avatar || '';
            const recipientId = idnhan;

            const data = {
                senderName,
                senderAvatar,
                message,
                senderId,
                recipientId
            };
            setChat((prevChat) => [...prevChat, data])
            console.log(data); 
            socketRef.current.emit('sendMessage', data); 
            setMessage('');
        } 
    };
    console.log(userStatuses)
    return (
        <div onClick={e => e.stopPropagation()} className={Style}>
            {fromUserName ?
                <h1 className='py-2  top-0 left-0 right-0 bg-slate-300 flex rounded-t-lg'>
                    <img className='ml-2 w-[50px] h-[50px] rounded-[50px]' src={fromUserAvatar || "https://static.vecteezy.com/system/resources/previews/005/005/788/original/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg"} alt='' />
                    <span className='flex flex-col ml-2'>
                        <span className='font-semibold'>{fromUserName}</span>
                        <span>{userStatuses[idnhan] === 'online' ? <span> Online </span> : <span> Offline </span>}</span>
                    </span>
                </h1> : <h1 className='rounded-t-lg py-2 sticky top-0 left-0 right-0 bg-blue-600 items-center border-b-2 text-white flex'>
                    <img className='ml-2 w-[50px] h-[50px]  rounded-[50px]' src='https://2.bp.blogspot.com/-Wb8LOyIz47g/Zk_2kBqy_lI/AAAAAABybXw/P3FAKItM9JIRASCGD3qkRDrqv56fe9OUgCNcBGAsYHQ/chibi_head.png?imgmax=3000' />
                    <span className='flex flex-col ml-2'>
                        <span className='font-semibold'>Xin chào!!!</span>
                        <span>Em ở đây để hỗ trợ cho mình ạ</span>
                    </span>
                    <span className='cursor-pointer ml-3' onClick={onClose}>
                        <VscChromeClose color='white' size={25} />
                    </span>
                </h1>
            }
            <div className={StyleDiv ? StyleDiv : 'mt-4 h-[450px] overflow-y-auto'}>
                <div className='mt-4'>
                    {dataChat.length !== 0  ? (dataChat.map((el) => (
                        <div key={el._id}>
                            <div className="space-y-4">
                                {el.fromUserID === current.current._id ? (
                                    <div className="flex justify-end">
                                        <div className={`${el.message && 'bg-blue-500'} ml-2 mt-1 text-white p-3 rounded-lg max-w-xs`}>
                                            {el.message !== '' ? <p>{el.message}</p> :
                                                <div>
                                                    <Link to={`http://localhost:5000${el.file}`}>
                                                        <img src={`http://localhost:5000${el.file}`} alt="Sent file" class="max-w-xs w-[150px]" />
                                                    </Link>
                                                </div> } 
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-start">
                                            <div className={`${el.message && 'bg-gray-200'} ml-2 mt-1 text-black p-3 rounded-lg max-w-xs`}>
                                                {el.message !== '' ? <p>{el.message}</p> :
                                                    <div>
                                                        <Link to={`http://localhost:5000${el.file}`}>
                                                            <img src={`http://localhost:5000${el.file}`} alt="Sent file" class="max-w-xs w-[150px]" />
                                                        </Link>
                                                    </div>} 
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))) : <div className='h-[300px]'>
                        
                        </div>}
                </div>
                <div>
                    {chat?.map((msg, index) => (
                        <div key={index}>
                            <div className="space-y-4">
                                {msg.senderId === current.current._id ? (
                                    <div className="flex justify-end">
                                        <div className={`${msg.message && 'bg-blue-500'} ml-2 mt-1 text-white p-3 rounded-lg max-w-xs`}>
                                            {msg.message ? <p>{msg.message}</p> : <p dangerouslySetInnerHTML={{ __html: msg.files }} className='w-[150px]'></p>}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-start">
                                            <div className={`${msg.message && 'bg-gray-200'} ml-2 mt-1 text-black p-3 rounded-lg max-w-xs`}>
                                                {msg.message ? <p>{msg.message}</p> :  <p dangerouslySetInnerHTML={{ __html: msg.files }} className='w-[150px]'></p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                </div>
                <div ref={endOfChatRef}>
                </div>
            </div>
            
            <div className=' bg-white left-0 right-0 bottom-0  flex my-3 items-center justify-between w-full pt-2 mx-0'>
                <span className='cursor-pointer mx-1'><IoMdAddCircle size={25} color='blue' title="Chức năng phát triển trong tương lai" /></span>
                <span className='cursor-pointer' >
                    <FaCamera size={25} color='blue' title="Chức năng phát triển trong tương lai" />
                </span>
                <span className='cursor-pointer mx-1' onClick={() => fileInputRef.current.click()}><IoMdPhotos size={25} color='blue' /></span>
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
                <input
                    className='bg-gray-200 mx-1 rounded-xl p-2 w-full max-w-[400px] outline-none'
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                />
                <button onClick={() => sendMessage()}><IoSendSharp size={25} color='blue' /></button>
            </div>
           
        </div>
    );
};

export default Chat;