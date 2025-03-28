import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import CardSmall from '../components/CardSmall';
import './style/MyDetail.css';

function MyDetail() {
    let [sellingPosts, setSellingPosts] = useState([]);
    let [soldPosts, setSoldPosts] = useState([]);
    let [favoritePosts, setFavoritePosts] = useState([]);
    let [tab, setTab] = useState(0); // 기본 탭을 0으로 설정
    const [indicatorStyle, setIndicatorStyle] = useState({ transform: 'translateX(-100%)', width: '33.33%' }); // 초기에 -100%로 설정

    // 탭 클릭 시 언더바 위치 업데이트
    useEffect(() => {
        const tabWidth = 100 / 3; // 3개의 탭을 100%로 나누기
        const translateXValue = tab === 0 ? '-100%' : tab === 1 ? '0%' : '100%'; // 탭에 맞는 위치
        setIndicatorStyle({
            transform: `translateX(${translateXValue})`, // 클릭된 탭에 맞춰 이동
            width: `${tabWidth}%`, // 각 탭의 너비에 맞게 설정
        });
    }, [tab]); // tab 상태가 변경될 때마다 실행

    // 본인이 판매중인 게시글 가져오기
    useEffect(() => {
        fetch(('/myDetail/getSellingPosts'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                setSellingPosts(data);
                console.log('서버 응답:', data);
            })
            .catch(error => {
                console.error('fetch 오류:', error);
            })
    }, []);

    // 본인이 판매한 게시글 가져오기
    useEffect(() => {
        fetch(('/myDetail/getSoldPosts'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                setSoldPosts(data);
                console.log('서버 응답:', data);
            })
            .catch(error => {
                console.error('fetch 오류:', error);
            })
    }, []);

    // 본인이 찜한 항목 가져오기
    useEffect(() => {
        fetch(('/myDetail/getFavoritePosts'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                setFavoritePosts(data);
                console.log('서버 응답:', data);
            })
            .catch(error => {
                console.error('fetch 오류:', error);
            })
    }, []);

    function TabContent(props) {
        let [fade, setFade] = useState('');

        useEffect(() => {
            setTimeout(() => { setFade('TabContent-End') }, 100);
            return () => {
                setFade('');
            }
        }, [tab]);

        return (
            <div className={`TabContent-Start ${fade}`}>
                {[
                    <div>{props.sellingPosts && props.sellingPosts.length > 0 ? (
                        <div className='TabContent-Item'>
                            {props.sellingPosts.map(post => (
                                <CardSmall
                                    photo={post.productPhoto[0] || undefined}
                                    brand={'Brand'}
                                    title={post.productName}
                                    size={post.childAge}
                                    price={Number(post.productPrice).toLocaleString()}
                                    link={'/detail/' + post._id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div>판매중인 상품이 없습니다.</div>
                    )}</div>,
                    <div>{props.soldPosts && props.soldPosts.length > 0 ? (
                        <div className='TabContent-Item'>
                            {props.soldPosts.map(post => (
                                <CardSmall
                                    photo={post.productPhoto || undefined}
                                    brand={'Brand'}
                                    title={post.productName}
                                    size={post.childAge}
                                    price={post.productPrice}
                                    link={'/detail/' + post._id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div>판매한 상품이 없습니다.</div>
                    )}</div>,
                    <div>{props.favoritePosts && props.favoritePosts.length > 0 ? (
                        <div className='TabContent-Item'>
                            {props.favoritePosts.map(post => (
                                <CardSmall
                                    photo={post.productPhoto[0] || undefined}
                                    brand={'Brand'}
                                    title={post.productName}
                                    size={post.childAge}
                                    price={Number(post.productPrice).toLocaleString()}
                                    link={'/detail/' + post._id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div>찜한 상품이 없습니다.</div>
                    )}</div>,
                ][props.tab]}
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
                        <div style={{ marginRight: '56px', display: 'flex' }}>
                            판매중
                            <div style={{ fontFamily: 'NotoSansKR-Medium', marginLeft: '0.3rem' }}>
                                {sellingPosts.length}
                            </div>
                            개
                        </div>
                        <div style={{ marginRight: '56px', display: 'flex' }}>
                            상품 판매
                            <div style={{ fontFamily: 'NotoSansKR-Medium', marginLeft: '0.3rem' }}>
                                {soldPosts.length}
                            </div>
                            회
                        </div>
                    </div>
                </div>
            </div>
            <div className="MyStore-Tab">
                <div
                    className={`MyStore-Tab-Title ${tab === 0 ? 'active' : ''}`}
                    onClick={() => setTab(0)}
                >
                    <span>판매중</span>
                </div>
                <div
                    className={`MyStore-Tab-Title ${tab === 1 ? 'active' : ''}`}
                    onClick={() => setTab(1)}
                >
                    <span>판매완료</span>
                </div>
                <div
                    className={`MyStore-Tab-Title ${tab === 2 ? 'active' : ''}`}
                    onClick={() => setTab(2)}
                >
                    <span>찜</span>
                </div>
                <div className="MyStoreTab-Indicator" style={indicatorStyle}></div>
            </div>
            <TabContent tab={tab} sellingPosts={sellingPosts} soldPosts={soldPosts} favoritePosts={favoritePosts} />
        </>
    );
}

export default MyDetail;
