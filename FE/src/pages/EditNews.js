import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ButtonMediumBlue, ButtonMediumGray } from '../components/Buttons';
import { ReactComponent as AddImage } from '../components/AddImage.svg';
import CategoryDropDown from '../components/CategoryDropDown.js';
import './style/EditNews.css';
import { showAlert } from '../components/Util.js';

function EditNews() {
    let { id } = useParams();
    let navigate = useNavigate();
    let [defaultInfo, setDefaultInfo] = useState('');
    let [상품명, 상품명변경] = useState('');
    let [상품상세설명, 상품상세설명변경] = useState('');
    let [이미지들, 이미지들변경] = useState([]);
    let [개월수정보, 개월수변경] = useState('');
    let [상위카테고리, 상위카테고리변경] = useState('상위 카테고리');
    let [하위카테고리, 하위카테고리변경] = useState('하위 카테고리');
    let [상품상태, 상품상태변경] = useState('');
    let [가격, 가격변경] = useState('');
    const [isActive, setActive] = useState(false);

    // 수정하려는 글 값 받아오기 (default 값 설정)
    async function fetchData(id) {
        try {
            const response = await fetch('/edit/' + id);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            // 상태 업데이트
            setDefaultInfo(result);
            이미지들변경(result.productPhoto);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchData(id);
    }, [id])

    function handleEdit() {
        fetch(`/editPost/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productName: 상품명 || defaultInfo.productName,
                productDetailContent: 상품상세설명 || defaultInfo.productDetailContent,
                productPhoto: 이미지들 || defaultInfo.productPhoto,
                childAge: 개월수정보 || defaultInfo.childAge,
                productQuality: 상품상태 || defaultInfo.productQuality,
                productPrice: 가격 || defaultInfo.productPrice,
                like: defaultInfo.like
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`글 수정 실패 (HTTP ${response.status})`);
                }
                return response.json();
            })
            .then(data => {
                console.log('서버 응답:', data);
                showAlert({
                    title: "글 수정 완료!",
                    text: "상품 정보가 성공적으로 수정되었습니다.",
                    icon: "success",
                }).then(() => {
                    navigate('/'); // 글 수정 완료 후 메인 페이지로 이동
                });
            })
            .catch(error => {
                console.error('fetch 오류:', error);
                showAlert({
                    title: "글 수정 실패",
                    text: "수정 중 오류가 발생했습니다.",
                    icon: "error",
                });
            });
    }

    function UploadBox() {
        useEffect(() => {
            if (이미지들.length > 0) {
                console.log(이미지들); // 이미지 상태가 변경될 때마다 로그 출력
            }
        }, [이미지들]); // 이미지 상태가 변경될 때마다 실행

        const handleFileChange = (e) => {
            const files = e.target.files;
            const fileArray = Array.from(files);
            if (files) {
                fileArray.forEach((file) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        이미지들변경((prev) => [...prev, reader.result]); // BASE64 데이터 저장
                    };
                    reader.readAsDataURL(file); // 파일을 BASE64로 변환
                });
            }
        };

        const handleDragStart = () => setActive(true);
        const handleDragLeave = () => setActive(false);
        const handleDragOver = (event) => {
            event.preventDefault();
        };
        const handleDrop = (e) => {
            e.preventDefault();
            const files = e.dataTransfer.file; // 드래그 앤 드롭에서 파일 가져오기
            const fileArray = Array.from(files);

            if (files) {
                fileArray.forEach((file) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        이미지들변경((prev) => [...prev, reader.result]); // BASE64 데이터 저장
                    };
                    reader.readAsDataURL(file); // 파일을 BASE64로 변환
                })
            }
            setActive(false);
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
            <div className='Edit-Image'>
                <div className="Edit-Title-2">
                    이미지 업로드
                </div>
                <div className='upload-Container'>
                    <label
                        className={`dropbox${isActive ? ' active' : ''}`}  // isActive 값에 따라 className 제어
                        onDragEnter={handleDragStart}  // dragstart 핸들러 추가
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}  // dragend 핸들러 추가
                        onDrop={handleDrop}
                    >
                        <input type="file" accept="image/*" className="file"
                            onChange={handleFileChange}
                        />
                        <AddImage className="add-image" fill="#B6B2AD" />
                        <div className='dropbox-text'>
                            이미지를 드래그하거나 클릭하여 선택
                        </div>
                    </label>
                    {
                        (이미지들) ?
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
                            : null
                    }
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

    return (
        <div style={{width: '600px', justifySelf:'center'}}>
            <div className='Edit-Title-1'>
                상품 수정하기
            </div>
            <UploadBox />
            <div className="Edit-Input-Row">
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div className="Edit-Title-2">
                        상품명
                    </div>
                    <div style={{ justifycontent: 'flex-end', marginLeft: '20px', color: '#B6B2AD' }}>
                        {상품명.length}/40
                        {/* {
                            (상품명.length == 0) ? 
                            <div>{defaultInfo.productName.length}</div>
                            : <div>{상품명.length}/40</div>
                        } */}
                    </div>
                </div>
                <input
                defaultValue={defaultInfo.productName}
                className="Edit-Input-Title"
                onChange={(e) => {
                    상품명변경(e.target.value);
                }}
                type="text" />
            </div>
            <div className="Edit-Input-Row">
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div className="Edit-Title-2">
                        상품 상세 설명
                    </div>
                    <div style={{ display: 'block', marginLeft: '20px', color: '#B6B2AD' }}>
                        {상품상세설명.length}/200
                    </div>
                </div>
                <input
                    defaultValue={defaultInfo.productDetailContent}
                    className="Edit-Input-Content"
                    onChange={(e) => {
                        상품상세설명변경(e.target.value);
                    }}
                    type="text"
                />
            </div>
            <div className="Edit-Input-Row">
                <div className="Edit-Title-2">
                    아이 정보 입력
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                    <input
                        defaultValue={defaultInfo.childAge}
                        className="Edit-Input"
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
            <div className="Edit-Input-Row">
                <div className="Edit-Title-2">
                    상품 상태
                </div>
                <ItemState/>
            </div>
            <div className="Edit-Input-Row">
                <div className="Edit-Title-2">
                    카테고리
                </div>
                <CategoryDropDown isActive_1={true}
                    상위카테고리={상위카테고리} 상위카테고리변경={상위카테고리변경}
                    하위카테고리={하위카테고리} 하위카테고리변경={하위카테고리변경}
                />
            </div>
            <div className="Edit-Input-Row">
                <div className="Edit-Title-2">
                    가격
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                    <input
                        defaultValue={defaultInfo.productPrice}
                        className="Edit-Input-Price"
                        onChange={(e) => {
                            가격변경(e.target.value);
                        }}
                        type="text"
                    />
                    <div style={{fontFamily: 'NotoSansKR-Medium', fontSize: '16px', marginLeft: '12px'}}>
                        원
                    </div>
                </div>
            </div>
            <div className="Edit-ButtonArea">
                <ButtonMediumBlue text={'수정완료'} eventHandler={handleEdit} />
            </div>
        </div>
    )
}

export default EditNews;