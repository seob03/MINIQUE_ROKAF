import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import './style/ChatList.css';
const socket = io("http://localhost:8080");

function ChatList() {
  // 모든 채팅 로드 시에 사용
  const [chats, setChats] = useState([]);
  // chatRoom 생성 시에 사용하는 상세 상태 변수
  const [chatID, setchatID] = useState('');
  const [sellerName, setSellerName] = useState('')
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productFrontPhoto, setProductFrontPhoto] = useState('')
  const [productID, setProductID] = useState('');

  let navigate = useNavigate();

  // 채팅 리스트 받아오기
  useEffect(() => {
    fetch('/chat/getChatList/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          setChats(data)
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
    const chatRoomId = props?.chat_id || "";
    const [me, setMe] = useState("");

    // 나의 정보 받아오기
    useEffect(() => {
      fetch('/chat/getUserInfo', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(response => response.json())
        .then(data => {
          console.log('check: ', data)
          setMe(data.username);
        })
        .catch(error => console.error('fetch 오류:', error));
    }, []);

    // 채팅방 메시지 불러오기
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




    // 메시지 읽음 처리 함수 + lastReadRef를 사용해 중복 요청 방지
    const lastReadRef = useRef(new Set());


    const markMessagesAsRead = (messages) => {
      if (!me) return;
      const unreadMessages = messages
        .filter(msg => {
          console.log('msg', msg)
          const isUnread = !msg.isRead;
          const isNotMine = msg.user !== me;
          const isNotProcessed = !lastReadRef.current.has(msg._id);
          return isUnread && isNotMine && isNotProcessed;
        })
        .map(msg => msg._id);

      if (unreadMessages.length > 0) {
        socket.emit("message-read", { roomId: chatRoomId, messageIds: unreadMessages, username: me });
        setMessages(prevMessages => {
          return prevMessages.map(msg => {
            if (unreadMessages.includes(msg._id)) {
              lastReadRef.current.add(msg._id); // 업데이트된 후에만 추가
              return { ...msg, isRead: true };
            }
            return msg;
          });
        });
      }
    };

    // messages 변경 시 읽음 처리
    useEffect(() => {
      if (messages.length > 0) {
        markMessagesAsRead(messages);
      }
    }, [me, chatRoomId, messages]); // messages와 me가 변경될 때마다 실행

    // 서버에서 읽음 처리 결과를 받으면 메시지 상태 업데이트
    useEffect(() => {
      socket.on("message-read-broadcast", ({ messageIds }) => {
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            messageIds.includes(msg._id) ? { ...msg, isRead: true } : msg
          )
        );
      });

      return () => {
        socket.off("message-read-broadcast");
      };
    }, []);

    // WebSocket 메시지 수신 처리
    useEffect(() => {

      socket.emit("ask-join", chatRoomId);

      socket.on("message-broadcast", (data) => {
        setMessages((prevMessages) => [...prevMessages, { ...data, isRead: false }]);
      });

      return () => {
        // 클라이언트에서 diconnect 호출하지 X
        socket.off("message-broadcast");
      };
    }, [chatRoomId]);

    // 스크롤 최하단으로 상시 업데이트
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
          <div className='chatting-opponent-text'>{props.sellerName}</div>
        </div>
        <div className="chatting-item" onClick={() => { navigate('/detail/' + props.productID) }}>
          <div className="chatting-item-img">
            <img src={props.productFrontPhoto} className='chatting-item-imgsource' alt="상품" />
          </div>
          <div className="chatting-item-text">
            <div className="chatting-item-name">{props.productName}</div>
            <div className="chatting-item-price">{Number(props.productPrice).toLocaleString()}원</div>
          </div>
        </div>
        <div ref={chatBoxRef} className="chatting-area">
          {messages.map((msg, index) => (
            (msg.user === me) ? (
              <div key={index} className='chatting-bubble-my'>
                {msg.image && msg.text ?
                  (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <img src={msg.image} alt="보낸 이미지" className='chat-image' />
                      <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                        <span className='chatting-bubble-my-timestamp'>
                          {formatTimestamp(msg.timestamp)}
                          {msg.isRead ? '읽음' : '안 읽음'}
                        </span>
                        <span className='chatting-bubble-my-text'>{msg.text}</span>
                      </div>
                    </div>
                  ) : msg.image ? <img src={msg.image} alt="보낸 이미지" className='chat-image' />
                    :
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                      <span className='chatting-bubble-my-timestamp'>
                        {formatTimestamp(msg.timestamp)}
                        {msg.isRead ? '읽음' : '안 읽음'}
                      </span>
                      <span className='chatting-bubble-my-text'>{msg.text}</span>
                    </div>
                }
              </div>
            ) : (
              <div key={index} className='chatting-bubble-your'>
                {msg.image && msg.text ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <img src={msg.image} alt="받은 이미지" className='chat-image' />
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                      <span className='chatting-bubble-your-text'>{msg.text}</span>
                      <span className='chatting-bubble-your-timestamp'>
                        {formatTimestamp(msg.timestamp)}
                        {msg.isRead ? '읽음' : '안 읽음'}
                      </span>
                    </div>
                  </div>
                ) : msg.image ? <img src={msg.image} alt="보낸 이미지" className='chat-image' />
                  :
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                    <span className='chatting-bubble-your-text'>{msg.text}</span>
                    <span className='chatting-bubble-your-timestamp'>
                      {formatTimestamp(msg.timestamp)}
                      {msg.isRead ? '읽음' : '안 읽음'}
                    </span>
                  </div>
                }
              </div>
            )
          ))}
        </div>
        {selectedImage && (
          <div className="chat-preview">
            <div className="chat-preview-background" />
            <div className="chat-preview-container">
              <img src={selectedImage} alt="미리보기" className="chat-preview-image" />
              <button onClick={() => setSelectedImage(null)} style={{ position: 'absolute', right: '2px', top: '2px' }}>
                <img src="/img/CloseButton.svg" style={{ width: '12px', height: '12px' }} />
              </button>
            </div>
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

                <div key={chat._id} className='chat-list-box'
                  // 채팅방 모듈로 전송할 이미지
                  onClick={() => {
                    setchatID(chat._id);
                    setSellerName(chat.sellerName);
                    setProductName(chat.productName);
                    setProductPrice(chat.productPrice);
                    setProductFrontPhoto(chat.productFrontPhoto)
                    setProductID(chat.productID)
                  }}>
                  <div className='chat-list-box-img'>
                    <img src='/img/jilsander.png' className='chat-list-box-imgsource' alt="채팅" />
                  </div>
                  <div className='chat-list-box-text'>
                    <div className='chat-list-box-name'>
                      {chat.sellerName}  ·  {chat.productName}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div>거래중인 상품이 없어요! 구매하려는 게시글에서 채팅하기를 눌러 채팅을 시작해주세요.</div>
          )}
        </div>
        {/* props로 채팅방에 관련 정보 넘기기 */}
        <div className="chat-room">
          {(chatID !== '') ?
            <ChatRoom chat_id={chatID} sellerName={sellerName} productName={productName} productPrice={productPrice} productFrontPhoto={productFrontPhoto} productID={productID} />
            : <div>채팅을 시작하려면 왼쪽에서 대화를 선택해주세요. 😊</div>
          }
        </div>
      </div>
    </>
  );
}

export default ChatList;
