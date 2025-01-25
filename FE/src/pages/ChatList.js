import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";

import './style/ChatList.css';

function ChatList() {
  const [chats, setChats] = useState([]); // 채팅 목록을 저장할 상태
  useEffect(() => {
    // 실제 API에서 채팅 데이터를 가져오는 로직을 넣을 수 있음
    fetch(('/chat/getChatList/'), { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      })
      .then(response => response.json())
      .then(data => {
        console.log(JSON.stringify(data[0]._id))
        setChats(data);
        console.log('서버 응답:', data);
      })
      .catch(error => {
        console.error('fetch 오류:', error);
      });
  }, []);



  return (
    <div className="chat-list">
      <h2>채팅 목록</h2>
      <ul>
        {(chats && chats.length > 0) ? 
        <div>
          {chats.map(chat => (
          <li key={chat._id} className="chat-item">
            <Link to={'/chat/' + chat._id} className="chat-link"> 
              <div className="chat-details">
                <p className="chat-name">{chat.member[0]}</p>
                <p className="chat-last-message">{chat.member[1]}</p>
              </div>
            </Link>
          </li>
          ))}
        </div> : <div>없음</div>}
      </ul>
    </div>
  );
}

export default ChatList;