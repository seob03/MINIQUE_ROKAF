import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
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


  return (
    <div>
      <div class="flex-container">
        <h4>
          디테일 페이지@@@
        </h4>
      </div>

      <div class="flex-container">
        <div class="col image">
          {<img src={pageResult.photo} />}
        </div>
        <div class="col contents">
          <div class="row h28">
            {pageResult.title}
          </div>
          <div class="row h24">
          </div>
          <div class="row h56">
            {pageResult.content}
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
        </div>
      </div>

      <div style={{display: 'block'}}>
        같은 카테고리의 상품
      </div>
      <div class="flex-container">
        <div class="row eql">
          상품 1
        </div>
        <div class="row eql">
          상품 2
        </div>
        <div class="row eql">
          상품 3
        </div>
        <div class="row eql">
          상품 4
        </div>
      </div>
    </div>
  );
}

export default Detail;