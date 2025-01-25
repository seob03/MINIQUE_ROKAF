import React, { useEffect, useState, useRef  } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom"

function ChatDetail() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const chatBoxRef = useRef(null); // 채팅창을 참조하기 위한 useRef
  let { chatRoomId } = useParams(); // 채팅방 고유 id
  const [sendUsername, setSendUsername] = useState(""); // 상태로 관리

  // 채팅 치는 유저의 정보 받아오기 (전송자 이름 표기 위함)
  useEffect(() => {
    fetch(('/chat/getUserInfo'), { 
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

  // 타임스탬프 형식화 함수
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`; // HH:mm 형식
  }
    
  useEffect(() => {
    // Socket.IO 연결 설정
    const socket = io()
    setSocket(socket);
    socket.on("connect", () => {
      console.log('Client - Connected to Socket Server')
    });
    // ('작명', '룸 이름')
    socket.emit('ask-join', chatRoomId)

    // 서버가 room에 보낸 것을 Messages에 반영
    socket.on('message-broadcast', (data) => {
      setMessages((prevMessages) => [...prevMessages, data])
    })

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // 메시지가 업데이트될 때마다 스크롤을 채팅창의 가장 아래로 이동
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);


  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // 서버로 메시지 전송
      socket.emit("message-send", { username : sendUsername, text: message, room : chatRoomId });
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div ref={chatBoxRef} style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{sendUsername}:</strong> {msg.text} <br />
            <span style={{ fontSize: "0.8em", color: "#888" }}>
              {formatTimestamp(msg.timestamp)}
            </span>
          </p>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ width: "80%", padding: "10px" }}
        />
        <button type="submit" style={{ padding: "10px", marginLeft: "5px" }}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatDetail;