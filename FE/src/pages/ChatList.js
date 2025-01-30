import { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
///import { Link } from "react-router-dom";

import './style/ChatList.css';

function ChatList() {
  const [chats, setChats] = useState([]); // 채팅 목록을 저장할 상태 변수
  const [otherUser, setOtherUser] = useState('') // 상대 유저의 username (채팅 목록에 표시하기 위함)

  const [chatID, setchatID] = useState('');
  
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


  function ChatRoom(props){
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const chatBoxRef = useRef(null); // 채팅창을 참조하기 위한 useRef
    let { chatRoomId } = props.chat_id; // 채팅방 고유 id
    const [sendUsername, setSendUsername] = useState(""); // 상태로 관리

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

    function formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`; // HH:mm 형식
    }

    const sendMessage = (e) => {
      e.preventDefault();
      if (message.trim()) {
        // 서버로 메시지 전송
        socket.emit("message-send", { username : sendUsername, text: message, room : chatRoomId });
        setMessage("");
      }
      console.log(messages);
    };

    const activeEnter = (e) => {
      if(e.key === "Enter") {
        sendMessage(e);
      }
    }

    return(
      <div className="chatting-box">
        <div className="chatting-opponent">
          <div className='chatting-opponent-img'>
            <img src='/img/jilsander.png' className='chat-list-box-imgsource' />
          </div>
          <div className='chatting-opponent-text'>상점이름</div>
        </div>
        <div className="chatting-item">
          <div className="chatting-item-img">
            <img src='/img/jilsander.png' className='chatting-item-imgsource'/>
          </div>
          <div className="chatting-item-text">
            <div className="chatting-item-name">
              이건제목임
            </div>
            <div className="chatting-item-price">
              230,000원
            </div>
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
            onKeyDown={(e) => activeEnter(e)}
            placeholder="Type your message..."
            className='chatting-input'
          />
          <img src="/img/ImageUpload_Button.svg" 
            className="chatting-img-button"/>
          <div className="chatting-send-button" onClick={()=>{sendMessage()}}>
            <img src="/img/Chat_Send_Button.svg"/>
          </div>
        </form>
      </div>
    )
  }

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
    <>
      <div className='chatList-title'>채팅</div>
      <div className='chatList'>
        <div className="chat-list">
          { (chats && chats.length > 0) ?
            <>
              {
                chats.map((chat, index) => (
                  <div className='chat-list-box' onClick={()=>{setchatID(chat._id)}}>
                    <div className='chat-list-box-img'>
                      <img src='/img/jilsander.png' className='chat-list-box-imgsource' />
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
                ))
              }
            </>
            : <div>채팅이 없습니다. 채팅을 시작해보세요!</div>
          }
          {/* <ul>
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
        </ul> */}
        </div>
        <div className="chat-room">
          {
          (chatID != '') ?
          <ChatRoom chat_id={chatID}/>
          : <div>채팅을 선택하던가</div>
          }
        </div>
      </div>
    </>
  );
}

export default ChatList;