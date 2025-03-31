import { useState, useEffect } from 'react';
import Slider from '../components/Slider';
import './style/NewsList.css';
import CardSmall from '../components/CardSmall';

function NewsList() {
  let [postData, setpostData] = useState([]); // 최종 입력값
  // 백엔드에서 데이터 가져오기
  useEffect(() => {
    fetch('/getPostLists')
      .then((response) => response.json())
      .then((DB_result) => {
        setpostData(DB_result);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      }, []);
  }, []);  // 컴포넌트가 마운트될 때 한 번만 실행

  /// 스크롤을 최상단으로 가져온다 (첫 렌더링 때만 실행)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  let today = new Date();

  return (
    <div>
      <div style={{ marginTop: '30px' }}>
        <div className="Recommend-Carousel">
          <div className="Banner-Container">
            <Slider />
          </div>
        </div>
      </div>
      <div style={{ marginTop: '60px' }}>
        <div className="Recommend-Title">
          {today.getMonth() + 1}월의 추천 상품
        </div>
        <div className="Recommend-Gallery">
          {
            (postData.length > 0) ? (
              postData.map(post => (
                <CardSmall
                  photo={post.productPhoto || undefined}
                  brand={post.brand}
                  title={post.productName}
                  size={post.childAge}
                  price={Number(post.productPrice).toLocaleString()}
                  link={'/detail/' + post._id}
                />
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '0px 0 20px 0' }}>
                <div style={{ color: '#666', fontSize: '16px' }}>
                  등록된 게시글이 없습니다.
                </div>
                <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>
                  새로운 게시글을 등록해주세요.
                </p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default NewsList;