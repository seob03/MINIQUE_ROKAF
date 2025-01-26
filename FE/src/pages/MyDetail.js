import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";

import Card from '../components/Card';
import CardSmall from '../components/CardSmall';

import './style/MyDetail.css';

function MyDetail() {
    let [tab, setTab] = useState(0);
    let [posts, setPosts] = useState([]);
    let [userInfo, setUserInfo] = useState('') // username, _id 필드 반환
    useEffect(() => {
    fetch(('/myDetail/getPosts'), { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
          setPosts(data);
          console.log('서버 응답:', data);
        })
        .catch(error => {
          console.error('fetch 오류:', error);
        })
    }, []);
    
    useEffect(()=>{
        console.log('posts:', posts)
    }, [posts])

    function TabContent(props) {
        let [fade, setFade] = useState('')

        useEffect(() => {
            setTimeout(() => { setFade('TabContent-End') }, 100)
            return () => {
                setFade('')
            }
        }, [tab])

        return (
            
            <div className={`TabContent-Start ${fade}`}>
                {
                    [
                        <>
                            {props.posts && props.posts.length > 0 ? (
                                <div className='TabContent-Item'>
                                {props.posts.map(post => (
                                        <CardSmall
                                            photo={post.productPhoto || undefined}
                                            brand={'Brand'}
                                            title={post.productName}
                                            size={post.childAge}
                                            price={post.productPrice}
                                            link={'/detail/'+post._id}
                                        />
                                ))}
                                </div>
                            ) : (
                                <div>아직 로딩중</div>
                            )}
                        </>,
                        <div>찜 내용</div>,
                        <div>후기 내용</div>
                    ][props.tab]
                }
            </div>
        );
    }

    return (
        <>
            <div style={{ display: 'flex', marginTop: '36px' }}>
                <div className='Store-Image'>
                    <img src='/img/jilsander.png' className='Store-Image-Source' />
                </div>
                <div className='Store-Content'>
                    <div className='Store-Content-Name'>
                        내 상점
                    </div>
                    <div className='Store-Content-Rate'>
                        <div style={{ fontSize: '20px', color: '#FFBE64', marginRight: '8px' }}>
                            ★
                        </div>
                        <div>
                            4.2
                        </div>
                    </div>
                    <div className='Store-Content-Detail'>
                        <div style={{ marginRight: '56px' }}>
                            상품 판매 OO회
                        </div>
                        <div style={{ marginRight: '56px' }}>
                            상품 개수 {posts.length}
                        </div>
                        <div>
                            받은 후기 O건
                        </div>
                    </div>
                </div>
            </div> 
            <div>
                <div class="Store-Tab">
                    <div className="Store-Tab-Title"
                        onClick={() => setTab(0)}>
                        상품
                        {(tab == '0') ?? <img src='/img/Tab_Bar.svg' style={{ width: '60px' }} />}
                    </div>
                    <div className="Store-Tab-Title"
                        onClick={() => setTab(1)}>
                        찜
                    </div>
                    <div className="Store-Tab-Title"
                        onClick={() => setTab(2)}>
                        후기
                    </div>
                </div>
            </div>
            <TabContent tab={tab} posts={posts} />
        </>
    );
}

export default MyDetail;