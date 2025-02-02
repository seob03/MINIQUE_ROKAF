import { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import './style/ChatList.css';
const socket = io("http://localhost:8082")

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
        console.log('서버 응답:', data);
      })
      .catch(error => {
        console.error('fetch 오류:', error);
      });
  }, []);

  function ChatRoom(props) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const chatBoxRef = useRef(null);
    const chatRoomId = props.chat_id?.chatRoomId || "";
    const [sendUsername, setSendUsername] = useState("");

    useEffect(() => {
      fetch('/chat/getUserInfo', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(response => response.json())
        .then(data => {
          setSendUsername(data.username)
          console.log('서버 응답:', data);
        })
        .catch(error => {
          console.error('fetch 오류:', error);
        });
    }, []);

    // 채팅 내용 DB에 저장 요청 훅
    useEffect(() => {
      if (messages.length === 0) return; // messages가 비어있으면 요청 안 보냄
      const lastMessage = messages[messages.length - 1]; // 마지막 메시지를 가져옴
      if (!lastMessage.text.trim()) return; // 빈 메시지 저장 방지

      const messageData = {
        room: chatRoomId,    // 실제 room ID
        user: sendUsername,    // 실제 user ID
        text: lastMessage.text   // 보낼 메시지
      };
      console.log("messageData:", messageData)
      fetch('/chat/saveMessage/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      })
        .then(response => response.json())
        .then(data => {
          console.log('서버 응답:', data);
        })
        .catch(error => {
          console.error('fetch 오류:', error);
        });
    }, [messages]);

    // 소켓 연결 훅
    useEffect(() => {
      // if (socket) {
      //   socket.off("message-broadcast"); // 기존 리스너 제거
      //   socket.disconnect();
      // }
      // const newSocket = io({ withCredentials: true });
      // setSocket(newSocket);

      // 메시지 브로드캐스트 리스너 추가 (중복 방지)
      socket.on("message-broadcast", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
      socket.emit("ask-join", chatRoomId);

      return () => {
        console.log(`Socket ${socket.id} disconnected`);
        alert("웹 소켓 서버와 연결이 끊어졌습니다. 다시 연결하려면 새로고침하세요.");
        socket.disconnect();
      };
    }, [chatRoomId]);

    // 채팅 항상 아래로 스크롤 되도록하는 훅
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
      if (message.trim()) {
        socket.emit("message-send", { username: sendUsername, text: message, room: chatRoomId });
        setMessage("");
      }
    };

    const activeEnter = (event) => {
      if (event.key === "Enter") {
        sendMessage(event);
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
            <p key={index}>
              <strong>{sendUsername}:</strong> {msg.text} <br />
              <span style={{ fontSize: "0.8em", color: "#888" }}>
                {formatTimestamp(msg.timestamp)}
              </span>
            </p>
          ))}
        </div>
        <form onSubmit={sendMessage} className="chatting-buttons">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(event) => activeEnter(event)}
            placeholder="Type your message..."
            className='chatting-input'
          />
          <img src="/img/ImageUpload_Button.svg" className="chatting-img-button" alt="이미지 업로드" />
          <div className="chatting-send-button" onClick={(event) => sendMessage(event)}>
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
