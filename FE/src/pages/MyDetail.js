import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Swal from "sweetalert2";
import CardSmall from '../components/CardSmall';
import './style/MyDetail.css';


function MyDetail() {
    let [sellingPosts, setSellingPosts] = useState([]);
    let [soldPosts, setSoldPosts] = useState([]);
    let [favoritePosts, setFavoritePosts] = useState([]);
    let [profileImg, setProfileImg] = useState(null);
    let [tab, setTab] = useState(0);
    let tabRefs = [useRef(null), useRef(null)];
    let [indicatorStyle, setIndicatorStyle] = useState({ transform: 'translateX(0%)', width: '0px' });

    // 프로필 사진 가져오기
    useEffect(() => {
        fetch(('/myDetail/getProfileImg'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                if (data == "null")
                    setProfileImg(null);
                else
                    setProfileImg(data)
                console.log('서버 응답:', data);
            })
            .catch(error => {
                console.error('fetch 오류:', error);
            })
    }, []);

    // 변경한 프로필 사진 DB 저장 훅
    function handleProfile() {
        fetch('/myDetail/setProfileImg', {
            method: 'POST', // POST로 변경
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileImg }), // profileImg를 body에 포함
        })
            .then(response => response.json())
            .then(data => {
                console.log('서버 응답:', data);
            })
            .catch(error => {
                console.error('fetch 오류:', error);
            });
    }

    // 탭이 변경될 때마다 언더바 위치와 너비를 업데이트
    useEffect(() => {
        const tabWidth = 100 / 3;
        let translateXValue;

        // 탭에 맞는 위치를 설정
        switch (tab) {
            case 0:
                translateXValue = '0%'; // 첫 번째 탭 (왼쪽)
                break;
            case 1:
                translateXValue = '100%'; // 두 번째 탭 (중앙)
                break;
            case 2:
                translateXValue = '200%'; // 세 번째 탭 (오른쪽)
                break;
            default:
                translateXValue = '0%';
                break;
        }

        // 언더바 위치와 너비 업데이트
        setIndicatorStyle({
            transform: `translateX(${translateXValue})`,
            width: `${tabWidth}%`,
        });
    }, [tab]);

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


    const handleFileChange = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImg(reader.result); // 상태 변경
            };
            reader.readAsDataURL(file);
        }
    };

    // profileImg 값이 변경되면 handleProfile 실행
    useEffect(() => {
        if (profileImg) {
            handleProfile();
        }
    }, [profileImg]);

    function handleBasicImage() {
        Swal.fire({
            title: "기본 프로필로 변경",
            text: "정말 기본 프로필로 변경하시겠습니까?",
            icon: "warning",
            showCancelButton: true, // '취소' 버튼을 추가
            confirmButtonText: "예", // '예' 버튼
            cancelButtonText: "아니오", // '아니오' 버튼
            customClass: {
                popup: "custom-swal-popup",
                container: "custom-swal-container",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                setProfileImg('/img/Basic_Profile.svg');
            } else {
            }
        });
    }

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
                        <div style={{ textAlign: 'center', padding: '60px 0 20px 0' }}>
                            <div style={{ color: '#666', fontSize: '16px' }}>
                                판매중인 상품이 없습니다.
                            </div>
                            <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>
                                상품이 등록되면 이곳에 표시됩니다.
                            </p>
                        </div>
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
                        <div style={{ textAlign: 'center', padding: '60px 0 20px 0' }}>
                            <div style={{ color: '#666', fontSize: '16px' }}>
                                판매한 상품이 없습니다.
                            </div>
                            <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>
                                상품이 판매되면 이곳에 표시됩니다.
                            </p>
                        </div>
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
                        <div style={{ textAlign: 'center', padding: '60px 0 20px 0' }}>
                            <div style={{ color: '#666', fontSize: '16px' }}>
                                찜한 상품이 없습니다.
                            </div>
                            <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>
                                상품을 찜하면 이곳에 표시됩니다.
                            </p>
                        </div>
                    )}</div>,
                ][props.tab]}
            </div>
        );
    }

    return (
        <>
            <div style={{ display: 'flex', marginTop: '36px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className='UserStore-Image'>
                        {
                            (profileImg) ? <img src={profileImg} className="Store-Image-Source" />
                                : <img src={'/img/Basic_Profile.svg'} className="Store-Image-Source" />
                        }
                        <label className='change-photo-button'>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="change-photo-input"
                                onChange={handleFileChange}
                            />
                            사진 변경
                        </label>
                    </div>
                    <div className="change-basic-image" onClick={handleBasicImage}>
                        기본이미지로 변경
                    </div>
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
                        <div style={{ marginRight: '56px', display: 'flex', alignItems: 'center', lineHeight: '1' }}>
                            판매중
                            <div style={{ fontFamily: 'NotoSansKR-Medium', marginLeft: '0.3rem', display: 'flex', alignItems: 'center' }}>
                                {sellingPosts.length}
                            </div>
                            개
                        </div>
                        <div style={{ marginRight: '56px', display: 'flex', alignItems: 'center', lineHeight: '1' }}>
                            상품 판매
                            <div style={{ fontFamily: 'NotoSansKR-Medium', marginLeft: '0.3rem', display: 'flex', alignItems: 'center' }}>
                                {soldPosts.length}
                            </div>
                            회
                        </div>
                    </div>
                </div>
            </div>
            <div className="MyStore-Tab">
                <div
                    ref={tabRefs[0]}
                    className={`MyStore-Tab-Title ${tab === 0 ? 'active' : ''}`}
                    onClick={() => setTab(0)}
                >
                    <span>판매중</span>
                </div>
                <div
                    ref={tabRefs[1]}
                    className={`MyStore-Tab-Title ${tab === 1 ? 'active' : ''}`}
                    onClick={() => setTab(1)}
                >
                    <span>판매완료</span>
                </div>
                <div
                    ref={tabRefs[2]}
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
