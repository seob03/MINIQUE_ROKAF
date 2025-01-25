import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";




function ChatDetail() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  
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
    socket.emit('ask-join', '123')

    // 서버가 room에 보낸 것을 Messages에 반영
    socket.on('message-broadcast', (data) => {
      setMessages((prevMessages) => [...prevMessages, data])
    })

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // 서버로 메시지 전송
      socket.emit("message-send", { user: "이민섭", text: message, room : '123' });
      // setMessages((prevMessages) => [...prevMessages, { user: "You", text: message, room : '123' }]);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.user}:</strong> {msg.text} <br />
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