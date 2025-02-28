import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { changeIsOpen } from "../store/store.js";
import { ButtonMediumBlue, ButtonMediumGray } from '../components/Buttons';
import { ReactComponent as AddImage } from '../components/AddImage.svg';
import './style/NewsWrite.css';

function NewsWrite() {
    let dispatch = useDispatch();
    // DB 상태 관리
    let [상품명, 상품명변경] = useState('');
    let [상품상세설명, 상품상세설명변경] = useState('');
    let [이미지들, 이미지들변경] = useState([]);
    let [개월수정보, 개월수변경] = useState('');
    let [상위카테고리, 상위카테고리변경] = useState('상위 카테고리');
    let [하위카테고리, 하위카테고리변경] = useState('하위 카테고리');
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

    // 제품 상태에 따라 String으로 변환하는 메서드
    function getProductStatus(status) {
        switch (status) {
            case 1:
                return "좋지 않음";  // 예: 판매 중
            case 2:
                return "사용감 있음"; // 예: 일시 품절
            case 3:
                return "보통";  // 예: 품절
            case 4:
                return "좋음";  // 예: 예약 판매
            case 5:
                return "새상품";  // 예: 단종
            default:
                return "알 수 없음";  // 예: 유효하지 않은 상태
        }
    }

    function PostNews() {
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
            else if (개월수정보 <= 0) {
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
                    productQuality: getProductStatus(상품상태),
                    higherCategory: 상위카테고리,
                    lowerCategory: 하위카테고리,
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

    function UploadBox() {
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

        return (
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
                        <AddImage className="add-image" fill="#B6B2AD" />
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
                                    style={{ position: 'relative' }}
                                >
                                    <img src={'/img/Close_Button.svg'}
                                        onClick={() => {
                                            let copy = [...이미지들]
                                            copy.splice(index, 1)
                                            이미지들변경(copy);
                                        }}
                                        className="image-close-button" />
                                    <img src={image} alt={`Preview ${index}`}
                                        className="image-preview-box" />
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        );
    }

    function ItemState() {
        return (
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                }}>
                <fieldset className='ItemState-field'>
                    {['좋지 않음', '사용감 있음', '보통', '좋음', '새상품'].map((text, value) => {
                        const isSelected = 상품상태 === (value + 1);
                        return (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', height: '56px' }}>
                                    <div
                                        key={value + 1}
                                        className={`ItemState-Circle-${value + 1} ${isSelected ? "selected" : ""}`}
                                        onClick={() => {
                                            상품상태변경(value + 1);
                                            console.log("선택됨:", value + 1);
                                        }}
                                    />
                                </div>
                                <div className={`label-box ${isSelected ? "selected" : ""}`}>
                                    {text}
                                </div>
                            </div>
                        );
                    })}
                </fieldset>
            </form>
        )
    }

    function CategoryDropDown() {
        let [isDrop1, setDrop1] = useState(false);
        let [isDrop2, setDrop2] = useState(false);

        const menuItems1 = ['GIRL', 'BOY'];
        const menuItems2 = ['OUTER', 'TOP', 'BOTTOM', 'SHOES', 'ETC']

        return (
            <div style={{ display: 'flex', marginTop: '12px' }}>
                <div
                    className="CategoryDropDown-Box"
                    onClick={() => setDrop1(!isDrop1)}
                >
                    {상위카테고리}
                    {
                        (isDrop1) &&
                        <div className='Category-DropDown-Container'>
                            {
                                menuItems1.map((list1, i) => (
                                    <div
                                        className='Category-DropDown-Menu'
                                        onClick={() => {
                                            상위카테고리변경(list1);
                                            setDrop1(false);
                                        }}>
                                        {list1}
                                    </div>
                                ))
                            }
                        </div>
                    }
                </div>
                <img src='/img/Category_Arrow.svg' style={{ marginLeft: '44px', marginRight: '44px' }} />
                {
                    (상위카테고리 != '') &&
                    <div
                        className='CategoryDropDown-Box'
                        onClick={() => setDrop2(!isDrop2)}
                    >
                        {하위카테고리}
                        {
                            (isDrop2) &&
                            <div className='Category-DropDown-Container'>
                                {
                                    menuItems2.map((list2, i) => (
                                        <div
                                            className='Category-DropDown-Menu'
                                            onClick={() => { 하위카테고리변경(list2); setDrop2(false) }}
                                        >
                                            {list2}
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </div>
                }
            </div>
        );
    }

    return (
        <div style={{ width: '600px', justifySelf: 'center' }}>
            <div className='Write-Title-1'>
                상품 등록하기
            </div>
            <UploadBox />
            <div className="Write-Input-Row">
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div className="Write-Title-2">
                        상품명
                    </div>
                    <div style={{ justifycontent: 'flex-end', marginLeft: '20px', color: '#B6B2AD' }}>
                        {상품명.length}/40
                    </div>
                </div>
                <input
                    placeholder=" 판매하시려는 상품의 이름을 입력해 주세요!"
                    className="Write-Input-Title"
                    onChange={(e) => {
                        상품명변경(e.target.value);
                    }}
                    type="text" />
            </div>
            <div className="Write-Input-Row">
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div className="Write-Title-2">
                        상품 상세 설명
                    </div>
                    <div style={{ display: 'block', marginLeft: '20px', color: '#B6B2AD' }}>
                        {상품상세설명.length}/200
                    </div>
                </div>
                <input
                    placeholder=" 사용했던 제품에 대해 자세하게 설명해 주세요. 결함이나 특징 등등을 설명해 주시면 좋아요!"
                    className="Write-Input-Content"
                    onChange={(e) => {
                        상품상세설명변경(e.target.value);
                    }}
                    type="text"
                />
            </div>
            <div className="Write-Input-Row">
                <div className="Write-Title-2">
                    아이 정보 입력
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                    <input
                        placeholder="아기가 입고 다닌 당시의 생후 개월 수를 입력해 주세요!"
                        className="Write-Input"
                        onChange={(e) => {
                            개월수변경(e.target.value);
                        }}
                        type="text"
                    />
                    <div style={{ fontFamily: 'NotoSansKR-Medium', fontSize: '16px', marginLeft: '12px' }}>
                        개월
                    </div>
                </div>
            </div>
            <div className="Write-Input-Row">
                <div className="Write-Title-2">
                    상품 상태
                </div>
                <ItemState />
            </div>
            <div className="Write-Input-Row">
                <div className="Write-Title-2">
                    카테고리
                </div>
                <CategoryDropDown />
            </div>
            <div className="Write-Input-Row">
                <div className="Write-Title-2">
                    가격
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                    <input
                        placeholder=" 판매할 가격을 입력해주세요!"
                        className="Write-Input-Price"
                        onChange={(e) => {
                            가격변경(e.target.value);
                        }}
                        type="text"
                    />
                    <div style={{ fontFamily: 'NotoSansKR-Medium', fontSize: '16px', marginLeft: '12px' }}>
                        원
                    </div>
                </div>
            </div>
            <div className="Write-ButtonArea">
                <ButtonMediumBlue text={'글쓰기'} eventHandler={PostNews} />
            </div>
        </div>
    );
}

export default NewsWrite;