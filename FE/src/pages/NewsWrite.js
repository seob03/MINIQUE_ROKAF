import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './style/NewsWrite.css';

function NewsWrite() {
    let [제목, 제목변경]=useState(''); // 실시간 입력값 받아오기
    let [내용, 내용변경]=useState(''); // 실시간 입력값 받아오기
    let [이미지, 이미지변경] = useState(null); // BASE64 데이터
    let navigate = useNavigate();
    let [isLoggedIn, setIsLoggedIn] = useState(null); // 로그인 상태를 추적할 상태
    useEffect(() => {
        // 로그인 상태를 확인하기 위해 서버로 요청
        const checkLoginStatus = async () => {
          try {
            const response = await fetch('/checkLogin');
            const result = await response.json();
            console.log('로그인 여부 확인 : ', result)
            // 서버로부터 받은 로그인 여부에 따라 상태 설정
            setIsLoggedIn(result); // 서버에서 반환한 값(true/false)
          } catch (error) {
            console.error('로그인 상태 확인 중 오류 발생:', error);
            setIsLoggedIn(false); // 오류 발생 시 로그인되지 않은 상태로 처리
          }
        };
        checkLoginStatus(); // 컴포넌트가 마운트될 때 로그인 상태 확인
      }, []);

      if (isLoggedIn === null) {
        return <div>로딩 중...</div>; // 서버 응답을 기다리는 동안 로딩 상태 표시
      }
   
    function PostNews(){
        if(isLoggedIn){
            fetch('/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 제목, content: 내용, photo: 이미지 })
            })
            .then(response => response.json())
            .then(data => {
            console.log('서버 응답:', data);
            })
            .catch(error => {
            console.error('fetch 오류:', error);
            });
        }
        else
            navigate('/login'); // 로그인 안 되어 있으면 로그인 페이지로 이동시키기
    }
    // 파일 선택 핸들러
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            이미지변경(reader.result); // BASE64 데이터 저장
        };
        reader.readAsDataURL(file); // 파일을 BASE64로 변환
        }
    };

    return (
        <>
            <div className='Write-Title-1'>
                상품 등록하기
            </div>
            <div>
                <div className="Write-Title-2">
                    이미지 업로드
                </div>
                <div>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {이미지 && <img src={이미지} alt="Preview" style={{ maxWidth: '200px', margin: '10px 0' }} />}
            </div>
            </div>
            <div className="Write-Input-Row">
                <div className="Write-Title-2">
                    상품명
                </div>
                <input 
                className="Write-Input-Title"
                onChange={(e) => {
                    제목변경(e.target.value);
                }} 
                type="text"/>
                <div style={{justifycontent: 'flex-end', marginLeft: '20px'}}>
                    {제목.length}/40
                </div>
            </div>
            <div className="Write-Input-Row">
                <div className="Write-Title-2">
                    상품 상세 설명
                </div>
                <input 
                    className="Write-Input-Content"
                    onChange={(e) => {
                        내용변경(e.target.value);
                    }} 
                    type="text"
                />
                <div style={{display: 'block', marginLeft: '20px'}}>
                    {내용.length}/200
                </div>
            </div>
            <div className="Write-Input-Row">
                <div className="Write-Title-2">
                    아이 정보 입력
                </div>
                <input 
                    className="Write-Input"
                    type="text"
                />
            </div>
            <div className="Write-Input-Row">
                <div className="Write-Title-2">
                    상품 상태
                </div>
                <input 
                    className="Write-Input"
                    type="text"
                />
            </div>
            <div className="Write-Input-Row">
                <div className="Write-Title-2">
                    카테고리
                </div>
            </div>
            <div className="Write-Input-Row">
                <div className="Write-Title-2">
                    가격
                </div>
                <input 
                    className="Write-Input-Price"
                    type="text"
                />
                <div>
                    원
                </div>
            </div>
            <button onClick={PostNews}>글쓰기</button>
        </>
    );
}

export default NewsWrite;