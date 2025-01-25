import {useEffect, useState, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { changeIsOpen } from "../store/store.js";
import { ButtonMediumBlue, ButtonMediumGray } from '../components/Buttons';
import { ReactComponent as AddImage } from '../components/AddImage.svg';
import './style/NewsWrite.css';

function NewsWrite() {
    let dispatch = useDispatch();
    // DB 상태 관리
    let [상품명, 상품명변경]=useState(''); 
    let [상품상세설명, 상품상세설명변경]=useState(''); 
    let [이미지들, 이미지들변경] = useState([]);
    let [개월수정보, 개월수변경] = useState('');
    let [상품상태, 상품상태변경] = useState('');
    let [가격, 가격변경] = useState(''); 
    
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
    });

    if (isLoggedIn === null) {
        return <div>로딩 중...</div>; // 서버 응답을 기다리는 동안 로딩 상태 표시
    }

    function PostNews(){
        if (isLoggedIn) {
            if (!상품명 || !상품상세설명 || !개월수정보 || !상품상태 || !가격) {
                alert("모든 필드를 작성해주세요.");
                return; 
            }

            // 아이 개월 수 정보 필드 점검
            if (!Number.isInteger(Number(개월수정보))) {
                alert("아기의 개월 수 정보는 정수로 입력해주세요.");
                return; 
            } 
            else if(개월수정보 <= 0) {
                alert("아기의 개월 수 정보는 양수로 입력해주세요.");
                return; 
            }

            // 가격 필드 점검
            if (!Number.isInteger(Number(가격))) {
                alert("가격은 유효한 정수로 입력해주세요.");
                return; 
            } else if (가격 <= 0) {
                alert("최소 판매 가격은 1원입니다.");
                return; 
            }
            

            fetch('/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productName: 상품명, 
                productDetailContent: 상품상세설명, 
                productPhoto: 이미지들,
                childAge: 개월수정보,
                productQuality: 상품상태,
                productPrice: 가격
            })
            })
            .then(response => response.json())
            .then(data => {
            console.log('서버 응답:', data);
            navigate('/'); // 글 쓰기 완료하면 메인 페이지로 보내기
            })
            .catch(error => {
            console.error('fetch 오류:', error);
            });
        }
        else
            dispatch(changeIsOpen(true)); // 로그인 안 되어 있으면 로그인 페이지로 이동시키기
    }
    // 파일 선택 핸들러

    function UploadBox(){
        const [isActive, setActive] = useState(false);

        useEffect(() => {
        }, [이미지들]); // 이미지들의 상태가 변경될 때마다 실행

        const handleFileChange = (e) => {
            const files = e.target.files; // 여러 파일 선택 가능
            const fileArray = Array.from(files); // FileList를 배열로 변환
        
            fileArray.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    이미지들변경((prev) => [...prev, reader.result]); // 기존 이미지 배열에 추가
                };
                reader.readAsDataURL(file); // 파일을 BASE64로 변환
            });
        };

        const handleDragStart = () => setActive(true);
        const handleDragLeave = () => setActive(false);
        const handleDragOver = (event) => {
            event.preventDefault();
        };
        const handleDrop = (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files; // 드롭한 파일들 가져오기
            const fileArray = Array.from(files);
        
            fileArray.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    이미지들변경((prev) => [...prev, reader.result]); // 기존 배열에 새 이미지를 추가
                };
                reader.readAsDataURL(file);
            });
        
            setActive(false); // 드래그 상태 비활성화
        };


        const dragItem = useRef(); // 드래그할 아이템의 인덱스
        const dragOverItem = useRef(); // 드랍할 위치의 아이템의 인덱스
        const dragStart = (e, position) => {
            dragItem.current = position;
            console.log(e.target.innerHTML);
        };
        
          // 드래그중인 대상이 위로 포개졌을 때
        const dragEnter = (e, position) => {
            dragOverItem.current = position;
            console.log(e.target.innerHTML);
        };
        
        // 드랍 (커서 뗐을 때)
        const drop = (e) => {
            const newList = [...이미지들];
            const dragItemValue = newList[dragItem.current];
            newList.splice(dragItem.current, 1);
            newList.splice(dragOverItem.current, 0, dragItemValue);
            dragItem.current = null;
            dragOverItem.current = null;
            이미지들변경(newList);
        };        

        return(
            <div className='Write-Image'>
                <div className="Write-Title-2">
                    이미지 업로드
                </div>
                <div className='upload-Container'>
                    <label 
                        className={`filedropbox${isActive ? ' active' : ''}`}  // isActive 값에 따라 className 제어
                        onDragEnter={handleDragStart}  // dragstart 핸들러 추가
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}  // dragend 핸들러 추가
                        onDrop={handleDrop}
                    >
                        <input 
                            type="file" 
                            multiple
                            accept="image/*" 
                            className="fileinput" 
                            onChange={handleFileChange}
                        />
                            <AddImage className="add-image" fill="#B6B2AD"/>
                            <div className='dropbox-text'>
                                이미지를 드래그하거나 클릭하여 선택
                            </div>
                    </label>
                    {이미지들.length > 0 && (
                        <>
                        {이미지들.map((image, index) => (
                            <div 
                                key={index}
                                draggable
                                onDragStart={(e) => dragStart(e, index)}
                                onDragEnter={(e) => dragEnter(e, index)}
                                onDragEnd={drop}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <img src={image} alt={`Preview ${index}`} 
                                className="image-preview-box"/>
                            </div>
                        ))}
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='Write-Title-1'>
                상품 등록하기
            </div>
            <UploadBox/>
            <div className="Write-Input-Row">
                <div className="Write-Title-2">
                    상품명
                </div>
                <input 
                className="Write-Input-Title"
                onChange={(e) => {
                    상품명변경(e.target.value);
                }} 
                type="text"/>
                <div style={{justifycontent: 'flex-end', marginLeft: '20px', marginTop: '0.6rem'}}>
                    {상품명.length}/40
                </div>
            </div>
            <div className="Write-Input-Row">
                <div className="Write-Title-2">
                    상품 상세 설명
                </div>
                <input 
                    className="Write-Input-Content"
                    onChange={(e) => {
                        상품상세설명변경(e.target.value);
                    }} 
                    type="text"
                />
                <div style={{display: 'block', marginLeft: '20px', marginTop: '0.6rem'}}>
                    {상품상세설명.length}/200
                </div>
            </div>
            <div className="Write-Input-Row">
                <div className="Write-Title-2">
                    아이 정보 입력
                </div>
                <input 
                    className="Write-Input"
                    onChange={(e) => {
                        개월수변경(e.target.value);
                    }} 
                    type="text"
                />
                <div style={{marginTop: '0.6rem'}}>
                    개월
                </div>
            </div>
            <div className="Write-Input-Row">
                <div className="Write-Title-2">
                    상품 상태
                </div>
                <input 
                    className="Write-Input"
                    onChange={(e) => {
                        상품상태변경(e.target.value);
                    }} 
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
                    onChange={(e) => {
                        가격변경(e.target.value);
                    }} 
                    type="text"
                />
                <div style={{marginTop: '0.6rem'}}>
                    원
                </div>
            </div>
            <div className="Write-ButtonArea">
                <ButtonMediumBlue text={'글쓰기'} eventHandler={PostNews}/>
                <ButtonMediumGray text={'임시저장'} eventHandler={null}/>
            </div>
        </>
    );
}

export default NewsWrite;