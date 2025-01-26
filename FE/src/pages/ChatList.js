import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import './style/ChatList.css';

function ChatList() {
  const [chats, setChats] = useState([]); // 채팅 목록을 저장할 상태 변수
  const [otherUser, setOtherUser] = useState('') // 상대 유저의 username (채팅 목록에 표시하기 위함)
  
  // 채팅 목록 불러오기 및 상대방 이름 알아오기 (하나의 채팅방에 상대 채팅자는 상대적이므로 판별 후에 가져와야함)
  useEffect(() => {
    fetch(('/chat/getChatList'), { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      })
      .then(response => response.json())
      .then(data => {
        setChats(data);
        console.log('서버 응답:', data);
        
      })
      .catch(error => {
        console.error('fetch 오류:', error);
      });
  }, []);

  // // chats의 값이 불러와지면 그때 상대 유저 판별 가능
  // useEffect(() => {
  //   console.log("실행된건데..")
  //   if (chats && chats.length > 0) {
  //     // chats에서 member 배열만 추출하여 새로운 배열 생성
  //     const membersArray = chats.map(chat => chat.member).filter(member => Array.isArray(member) && member.length === 2);
  //     console.log("membersArray 구조:", membersArray);
      
  //     fetch('/chat/getOtherUser', { 
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ members: membersArray })
  //     })
  //       .then(response => response.json())
  //       .then(data => {
  //         setOtherUser(data);
  //         console.log('서버 응답 setOtherUser:', data);
  //       })
  //       .catch(error => {
  //         console.error('fetch 오류:', error);
  //       })
  //     }
  // }, [chats])


  return (
    <div className="chat-list">
      <h2>채팅 목록</h2>
      <ul>
        {(chats && chats.length > 0) ? 
        <div>
          {chats.map((chat, index) => (
          <li key={chat._id} className="chat-item">
            <Link to={'/chat/' + chat._id} className="chat-link"> 
              <div className="chat-details">
                <p className="chat-name">123님과의 채팅</p>
                <p className="chat-last-message">여기다 마지막 채팅 내용 추가</p>
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