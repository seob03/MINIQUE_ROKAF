import { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import './style/ChatList.css';
const socket = io("http://localhost:8082");

function ChatList() {
  const [chats, setChats] = useState([]);
  const [chatID, setchatID] = useState('');

  useEffect(() => {
    fetch('/chat/getChatList/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          setChats(data);
        }
      })
      .catch(error => {
        alert(error.error || '로그인부터 해주세요.');
      });
  }, []);

  function ChatRoom(props) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null); // 이미지 상태 추가
    const chatBoxRef = useRef(null);
    const chatRoomId = props.chat_id?.chatRoomId || "";
    let [me, setme] = useState("");

    useEffect(() => {
      fetch('/chat/getUserInfo', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(response => response.json())
        .then(data => {
          setme(data.username);
        })
        .catch(error => console.error('fetch 오류:', error));
    }, []);

    useEffect(() => {
      if (!chatRoomId) return;
      fetch(`/chat/getChatMessages?room=${chatRoomId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(response => response.json())
        .then(data => {
          setMessages(data);
        })
        .catch(error => console.error("이전 채팅 fetch 오류:", error));
    }, [chatRoomId]);

    useEffect(() => {
      if (messages.length === 0) return;
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.text.trim() && !lastMessage.image) return;
      if (lastMessage.user !== me) return;

      const messageData = {
        room: chatRoomId,
        user: me,
        text: lastMessage.text || "",
        image: lastMessage.image || "" // 이미지 추가
      };

      fetch('/chat/saveMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      })
        .then(response => response.json())
        .catch(error => console.error('fetch 오류:', error));
    }, [messages]);

    useEffect(() => {
      socket.on("message-broadcast", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      socket.emit("ask-join", chatRoomId);

      return () => {
        socket.disconnect();
      };
    }, [chatRoomId]);

    useEffect(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, [messages]);

    function formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    const sendMessage = (event) => {
      event.preventDefault();
      if (message.trim() || selectedImage) {
        socket.emit("message-send", {
          username: me,
          text: message,
          image: selectedImage, // 이미지 포함
          room: chatRoomId
        });
        setMessage("");
        setSelectedImage(null); // 전송 후 초기화
      }
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="chatting-box">
        <div className="chatting-opponent">
          <div className='chatting-opponent-img'>
            <img src='/img/jilsander.png' className='chat-list-box-imgsource' alt="상점" />
          </div>
          <div className='chatting-opponent-text'>상점이름</div>
        </div>
        <div className="chatting-item">
          <div className="chatting-item-img">
            <img src='/img/jilsander.png' className='chatting-item-imgsource' alt="상품" />
          </div>
          <div className="chatting-item-text">
            <div className="chatting-item-name">이건제목임</div>
            <div className="chatting-item-price">230,000원</div>
          </div>
        </div>
        <div ref={chatBoxRef} className="chatting-area">
          {messages.map((msg, index) => (
            (msg.user === me) ? (
              <div key={index} className='chatting-bubble-my'>
                <span className='chatting-bubble-my-timestamp'>
                  {formatTimestamp(msg.timestamp)}
                </span>
                {msg.image && msg.text ?
                  (
                    <div>
                      <img src={msg.image} alt="보낸 이미지" className='chat-image' />
                      <div className='chatting-bubble-my-text'>{msg.text}</div>
                    </div>
                  ) : msg.image ? <img src={msg.image} alt="보낸 이미지" className='chat-image' /> : <span className='chatting-bubble-my-text'>{msg.text}</span>}
              </div>
            ) : (
              <div key={index} className='chatting-bubble-your'>
                {msg.image ? (
                  <img src={msg.image} alt="받은 이미지" className='chat-image' />
                ) : (
                  <span className='chatting-bubble-your-text'>{msg.text}</span>
                )}
                <span className='chatting-bubble-your-timestamp'>
                  {formatTimestamp(msg.timestamp)}
                </span>
              </div>
            )
          ))}
        </div>
        {selectedImage && (
          <div className="chat-preview">
            <img src={selectedImage} alt="미리보기" className="chat-preview-image" />
            <button onClick={() => setSelectedImage(null)}>❌</button>
          </div>
        )}
        <form onSubmit={sendMessage} className="chatting-buttons">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className='chatting-input'
          />
          <label className="chatting-img-button">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <img src="/img/ImageUpload_Button.svg" alt="이미지 업로드" />
          </label>
          <div className="chatting-send-button" onClick={sendMessage}>
            <img src="/img/Chat_Send_Button.svg" alt="전송" />
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className='chatList-title'>채팅</div>
      <div className='chatList'>
        <div className="chat-list">
          {(chats && chats.length > 0) ? (
            <>
              {chats.map((chat) => (
                <div key={chat._id} className='chat-list-box' onClick={() => setchatID(chat._id)}>
                  <div className='chat-list-box-img'>
                    <img src='/img/jilsander.png' className='chat-list-box-imgsource' alt="채팅" />
                  </div>
                  <div className='chat-list-box-text'>
                    <div className='chat-list-box-name'>
                      상점이름  ·  구매하려는 상품명
                    </div>
                    <div className='chat-list-box-lastchat'>
                      마지막 채팅내역
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div>채팅이 없습니다. 채팅을 시작해보세요!</div>
          )}
        </div>
        <div className="chat-room">
          {(chatID !== '') ?
            <ChatRoom chat_id={{ chatRoomId: chatID }} />
            : <div>채팅을 선택하던가</div>
          }
        </div>
      </div>
    </>
  );
}

export default ChatList;
