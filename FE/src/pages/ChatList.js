import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";

import './style/ChatList.css';

function ChatList() {
  const [chats, setChats] = useState([]); // 채팅 목록을 저장할 상태
  const { userId } = useParams(); // 만약 userId가 URL 파라미터로 있다면
  const navigate = useNavigate();

  useEffect(() => {
    // 실제 API에서 채팅 데이터를 가져오는 로직을 넣을 수 있음
    // 여기는 mock 데이터 예시
    const mockChats = [
      { id: 1, name: "채팅방 1", lastMessage: "안녕하세요!" },
      { id: 2, name: "채팅방 2", lastMessage: "잘 지내세요?" },
      { id: 3, name: "채팅방 3", lastMessage: "좋은 아침이에요!" },
    ];

    setChats(mockChats); // 상태에 채팅 목록 저장
  }, []);

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`); // 채팅방으로 이동
  };

  return (
    <div className="chat-list">
      <h2>채팅 목록</h2>
      <ul>
        {chats.map(chat => (
          <li key={chat.id} className="chat-item" onClick={() => handleChatClick(chat.id)}>
            <Link to={`/chat/${chat.id}`} className="chat-link">
              <div className="chat-details">
                <p className="chat-name">{chat.name}</p>
                <p className="chat-last-message">{chat.lastMessage}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatList;