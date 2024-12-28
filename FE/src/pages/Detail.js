import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import Card from '../components/Card.js';
import {useNavigate} from 'react-router-dom';
import './style/Detail.css';

function Detail(props) {
  let { id } = useParams();
  console.log(id)
  // 페이지 결과를 상태로 관리
  const [pageResult, setPageResult] = useState([]);

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

  let navigate = useNavigate();
  function handleDelete() {
    fetch('/delete/' + id, 
    {
      method : 'DELETE',
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('서버 응답:', data);
      alert("글 삭제되었습니다.")
      navigate('/');
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  return (
    <div>
      <div class="flex-container">
        <h4>
          디테일 페이지
        </h4>
      </div>

      <div class="flex-container">
        <div class="col image">
          {<img src={pageResult.productPhoto} />}
        </div>
        <div class="col contents">
          <div class="row h28">
            {pageResult.productName}
          </div>
          <div class="row h24">
            {pageResult.username}
          </div>
          <div class="row h56">
            {pageResult.productDetailContent}
          </div>
          <div>
            내비게이션
          </div>
          <div>
            상태 설명 블록
          </div>
          <div>
            판매자 버튼
          </div>
          <div>
            톡하기 버튼
          </div>
          <div className='DeleteButton' onClick={handleDelete}>
            삭제
          </div>
        </div>
      </div>

      <div style={{display: 'block'}}>
        같은 카테고리의 상품
      </div>
      <div class="flex-container">
        <Card photo={''}brand={'SainLaurant'} title={'가라1'} size={'62'} price={'1억'}/>
        <Card photo={''}brand={'Gucci'} title={'가라2'} size={'62'} price={'2억'}/>
        <Card photo={''}brand={'Tesla'} title={'가라3'} size={'62'} price={'3억'}/>
        <Card photo={''}brand={'Apple'} title={'가라4'} size={'62'} price={'4억'}/>
      </div>
    </div>
  );
}

export default Detail;