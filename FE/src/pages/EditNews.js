import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ButtonMediumBlue, ButtonMediumGray } from '../components/Buttons';
import './style/EditNews.css';

function EditNews(){

    let { id } = useParams();
    let navigate = useNavigate();
    let [defaultInfo, setDefaultInfo]=useState(''); 
    let [상품명, 상품명변경]=useState(''); 
    let [상품상세설명, 상품상세설명변경]=useState(); 
    let [이미지, 이미지변경] = useState(''); 
    let [개월수정보, 개월수변경] = useState(''); 
    let [상품상태, 상품상태변경] = useState(''); 
    let [가격, 가격변경] = useState(''); 

    // 수정하려는 글 값 받아오기 (default 값 설정)
    fetch('/edit/' + id)
    .then((response) => response.json())
    .then((result) => {
      // 상태 업데이트
      setDefaultInfo(result);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });

    function handleEdit() {

        fetch(('/editPost/' + id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productName : (상품명 ? 상품명 : defaultInfo.productName), 
                productDetailContent : (상품상세설명 ? 상품상세설명 : defaultInfo.productDetailContent),
                productPhoto : (이미지 ? 이미지 : defaultInfo.productPhoto),
                childAge : (개월수정보 ? 개월수정보 : defaultInfo.childAge),
                productQuality : (상품상태 ? 상품상태 : defaultInfo.productQuality),
                productPrice : (가격 ? 가격 : defaultInfo.productPrice),
                like: defaultInfo.like
            })
            })
            .then(response => response.json())
            .then(data => {
            console.log('서버 응답:', data);
            alert('글 수정 완료')
            navigate('/'); // 글 쓰기 완료하면 메인 페이지로
            })
            .catch(error => {
            console.error('fetch 오류:', error);
            });
        }

    return(
        <div>
            <div className='Edit-Title-1'>
                상품 수정하기
            </div>
            <div>
                <div className="Edit-Title-2">
                    이미지 업로드
                </div>
                <div>
                {/* 기존 이미지를 미리보기로 표시 */}
                {defaultInfo.productPhoto && <img src={defaultInfo.productPhoto} alt="Preview" style={{ maxWidth: '200px', margin: '16px 0' }} />}
                <input
                type="file" 
                accept="image/*" 
                style={{marginBottom: '36px'}}
                onChange={(e) => {
                    const file = e.target.files[0]; // 선택된 파일 가져옴
                    if (file) {
                        const fileURL = URL.createObjectURL(file); // 파일 URL을 생성하여 미리보기에 사용하기
                        이미지변경(fileURL); // 파일 URL을 상태에 저장
                    }
                }}
                />
                {이미지 && <img src={이미지} alt="Preview" style={{ maxWidth: '200px', margin: '16px 0' }} />}
            </div>
            </div>
            <div className="Edit-Input-Row">
                <div className="Edit-Title-2">
                    상품명
                </div>
                <input 
                defaultValue={defaultInfo.productName}
                className="Edit-Input-Title"
                onChange={(e) => {
                    상품명변경(e.target.value);
                }} 
                type="text"/>
                <div style={{
                    justifycontent: 'flex-end', 
                    marginLeft: '20px',
                    marginTop: '0.6rem'
                }}>
                    
                </div>
            </div>
            <div className="Edit-Input-Row">
                <div className="Edit-Title-2">
                    상품 상세 설명
                </div>
                <input 
                    defaultValue={defaultInfo.productDetailContent}
                    className="Edit-Input-Content"
                    onChange={(e) => {
                        상품상세설명변경(e.target.value);
                    }} 
                    type="text"
                />
                <div style={{
                    display: 'block',
                    marginLeft: '20px',
                    marginTop: '0.6rem'
                }}>
                    
                </div>
            </div>
            <div className="Edit-Input-Row">
                <div className="Edit-Title-2">
                    아이 정보 입력
                </div>
                <input 
                    defaultValue={defaultInfo.childAge}
                    className="Edit-Input"
                    onChange={(e) => {
                        개월수변경(e.target.value);
                    }} 
                    type="text"
                />
                <div style={{marginTop: '0.6rem'}}>
                    개월
                </div>
            </div>
            <div className="Edit-Input-Row">
                <div className="Edit-Title-2">
                    상품 상태
                </div>
                <input 
                    defaultValue={defaultInfo.productQuality}
                    className="Edit-Input"
                    onChange={(e) => {
                        상품상태변경(e.target.value);
                    }} 
                    type="text"
                />
            </div>
            <div className="Edit-Input-Row">
                <div className="Edit-Title-2">
                    카테고리
                </div>
            </div>
            <div className="Edit-Input-Row">
                <div className="Edit-Title-2">
                    가격
                </div>
                <input 
                    defaultValue={defaultInfo.productPrice}
                    className="Edit-Input-Price"
                    onChange={(e) => {
                        가격변경(e.target.value);
                    }} 
                    type="text"
                />
                <div style={{marginTop: '0.6rem'}}>
                    원
                </div>
            </div>
            <div className="Edit-ButtonArea">
                <ButtonMediumBlue text={'수정완료'} eventHandler={handleEdit}/>
                <ButtonMediumGray text={'임저시장'} eventHandler={null}/>
            </div>
        </div>
    )
}

export default EditNews;