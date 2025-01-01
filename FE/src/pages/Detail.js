import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Card from '../components/Card.js';
import { BuyButton, DeleteButton } from '../components/Buttons';

import './style/Detail.css';

function Detail(props) {
  const [pageResult, setPageResult] = useState([]);
  let isLoggedIn = useSelector((state) => {return state.isLoggedIn})

  let navigate = useNavigate();
  let { id } = useParams();
  console.log(id)
  // 페이지 결과를 상태로 관리

  useEffect(() => {
    // fetch 요청
    fetch('/detail/' + id)
      .then((response) => response.json())
      .then((result) => {
        // 상태 업데이트
        setPageResult(result);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [id]); // id가 바뀔 때마다 요청을 다시 보냄

  function handleDelete() {
    fetch('/delete/' + id, 
    {
      method : 'DELETE',
    })
    .then((response) => response.json())
    .then((data) => {
      if(data == true)
        alert("글이 정상적으로 삭제되었습니다.")
      else 
        alert("삭제 권한이 존재하지 않습니다.")
      navigate('/');
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  return (
    <div>
      <div className="Detail-Container">
        <div className="Detail-Image">
          {<img src={pageResult.productPhoto} className="Detail-Image cover"/>}
        </div>
        <div className="Detail-Content">
          <div className="Detail-FirstLine">
            <div className="Detail-Title">
            {pageResult.productName}
            </div>
            <div style={{flexGrow:1}}/>
            <div >
              <img src='./img/Heart_Unfill.svg' style={{width: '20px', height: '20px'}}/>
              <div>
                14
              </div>
            </div>
          </div>
          <div className="Detail-Price">
            {pageResult.productPrice}원
          </div>
          <div className="Detail-Content">
            {pageResult.productDetailContent}
          </div>
          <div className="Detail-Info">
            <div className="Detail-Info-Title">
              상태
            </div>
            <div className="Detail-Info-Content">
              {pageResult.productQuality}
            </div>
          </div>
          <div className="Detail-Info">
            <div className="Detail-Info-Title">
              아이 나이
            </div>
            <div className="Detail-Info-Content">
              {pageResult.childAge}
            </div>
          </div>
          <div className="Detail-Info">
            <div className="Detail-Info-Title">
              지역
            </div>
            <div className="Detail-Info-Content">
              경기도 평택시 송화리
            </div>
          </div>
          <div className="Detail-Info">
            <div className="Detail-Info-Title">
              배송비
            </div>
            <div className="Detail-Info-Content">
              3500원
            </div>
          </div>
          {(isLoggedIn) ? <DeleteButton eventHandler={handleDelete}/>
          : <BuyButton/> }
        </div>
      </div>

      <div style={{display: 'block'}}>
        같은 카테고리의 상품
      </div>
      <div class="Detail-Container">
        <Card photo={''}brand={'SainLaurant'} title={'가라1'} size={'62'} price={'1억'}/>
        <Card photo={''}brand={'Gucci'} title={'가라2'} size={'62'} price={'2억'}/>
        <Card photo={''}brand={'Tesla'} title={'가라3'} size={'62'} price={'3억'}/>
        <Card photo={''}brand={'Apple'} title={'가라4'} size={'62'} price={'4억'}/>
      </div>
    </div>
  );
}

export default Detail;