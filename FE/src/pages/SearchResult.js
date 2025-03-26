import { useState, useEffect } from 'react';
import './style/NewsList.css';
import { useLocation } from 'react-router-dom';
import CardSmall from '../components/CardSmall';

function SearchResult() {
  const location = useLocation();
  const rawSearchData = location.state?.data || ''; // 이게 문제여씀 (optional chaining 문법)
  console.log('rawSearchData:', rawSearchData);
  const searchData = rawSearchData.trim(); // 공백 제거
  let [searchPostData, setSearchPostData] = useState([]);
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchData) {
      // 검색어가 공백이거나 비어있는 경우
      console.log('검색어가 유효하지 않습니다.');
      setSearchPostData([]); // 검색 결과를 빈 배열로 설정
      setLoading(false); // 로딩 종료
      return;
    }
    setLoading(true); // 데이터 로딩 시작
    fetch('/searchPost?searchData=' + searchData)
      .then(response => response.json())
      .then(data => {
        if (data && Array.isArray(data)) {  // 예시: 데이터가 배열일 때
          console.log('서버 응답:', data);
          setSearchPostData(data);
        } else {
          console.error('서버 응답이 예상과 다릅니다:', data);
          setSearchPostData([]);
        }
      })
      .catch(error => {
        console.error('fetch 오류:', error);
        setSearchPostData([]);
      })
      .finally(() => setLoading(false)); // 데이터 로딩 종료      
  }, [searchData]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!searchPostData.length) {
    return <div style={{marginTop: '30px'}}>검색 결과가 없습니다.😓</div>;
  }


  return (
    <>
      {
        (searchPostData.length > 0) ?
        <div>
          <div className="Recommend-Title">
            {searchData}에 대한 검색 결과입니다.
          </div>
          <div className="Recommend-Gallery">
            {
                searchPostData.map(post => (
                  <CardSmall
                    photo={post.productPhoto || undefined}
                    brand={'MONCLER'}
                    title={post.productName}
                    size={post.childAge}
                    price={Number(post.productPrice).toLocaleString()}
                    link={'/detail/' + post._id}
                  />
                ))
            }
          </div>
        </div> 
        : <div style={{marginTop: '36px'}}>
            검색 결과가 없습니다.😓
          </div>
      }
    </>
  );
}

export default SearchResult;