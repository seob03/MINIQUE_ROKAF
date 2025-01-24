import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function ChatDetail() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    // Socket.IO 연결 설정
    const socket = io(); // 서버와 연결
    setSocket(socket);

    // 서버 -> 유저 메시지 수신 이벤트 처리
    socket.on("chatMessage", (data) => {
      // 서버로부터 받은 메시지를 상태에 추가
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      socket.disconnect();
    };
  }, []);

  // 유저 -> 서버
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // 유저 -> 서버로 메시지 전송
      socket.emit("chatMessage", { user: "이민섭", text: message });
      setMessages((prevMessages) => [...prevMessages, { user: "You", text: message }]);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.user}:</strong> {msg.text}
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
