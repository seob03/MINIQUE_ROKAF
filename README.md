# MINIQUE_ROKAF
대한민국 공군 병 852기 병장 김호준, 병장 이민섭이 개발한 유아 의류 중고거래 플랫폼입니다.<br><br>
## 프로젝트 소개
저출생으로 국내 유아·아동 인구는 감소세를 보이고 잇으나, 유아·아동복(유아동복) 시장은 꾸준히 성장하고 있습니다. 
국내 유아동복 시장은 지난해 2조4천490억원으로 2020년(1조8천410억원)보다 33% 정도 늘었습니다.(유로모니터)

해당 프로젝트는 유아동복은 고급화되고 있으나, 빠르게 성장하는 유아 특성상 수명이 길지 않은 유아동 의류에 대한 문제 인식에서 시작하였습니다.
이에 저희는 유아 의류 중고거래 플랫폼을 해결 방안으로써 제시합니다.<br><br>


## 개발자
- FrontEnd Engineer<br>
  김호준 : 대한민국 공군 병 852기, KAIST 전기 및 전자공학부 19학번 재학 `junpio0812@gmail.com`<br><br>
- BackEnd Engineer<br>
  이민섭 : 대한민국 공군 병 852기, 세종대학교 컴퓨터공학과 22학번 재학 `mjnseob0728@gmail.com`<br><br><br>


## 개발 기간
2024.11.24 ~ 2024.03.31
- 주 4회, 1회당 3시간 이상씩 시간을 할애하고자 했다.
- 군 조직 특성상 훈련, 휴가, 당직 등으로 인한 유동적 스케줄을 염두에 두고 개발했다.<br><br>


## 기술 스택
> FrontEnd
- `Javascript`
- `React.js`
- `React-Redux`
- `Figma`

> BackEnd
- `Node.js`
- `Express.js`
- `MongoDB`
- `Socket.IO`
- `Passport.js`<br><br>


# 기능 소개
<br>

## 회원가입
![Image](https://github.com/user-attachments/assets/6527eeaa-e157-46ce-aec3-f7e7023c28f2)
<br>

## 로그인
![Image](https://github.com/user-attachments/assets/188de43b-74fa-4797-b5c5-02e003cbb19c)
<br>

## 이미지 드래그 & 드랍
![Image](https://github.com/user-attachments/assets/8abd2c9e-b1ca-48d5-82f2-4d0b77fce6ce)
<br>

## 찜 기능
![Image](https://github.com/user-attachments/assets/f578afca-0a58-4470-8c63-4459d5d124d1)
<br>

## 카테고리 기능
![Image](https://github.com/user-attachments/assets/c9b7a85d-759b-4e39-84ec-c8af2d280363)
<br>

## 실시간 채팅 기능 및 이미지 첨부
![Image](https://github.com/user-attachments/assets/e2b1bc1e-d3be-446f-8645-841907f7e957)
<br>

## 실시간 읽음 처리 기능 (탭 전환으로 1인 2역)
![Image](https://github.com/user-attachments/assets/db1141f5-6fb2-4bbb-94bd-5ae2e607fdfa)
<br><br><br>

## FE 주요 기능  

### 1. 모달 시스템
- **모달 컴포넌트**
  - 로그인/회원가입 모달
  - 게시물 작성/수정 모달
  - 채팅방 나가기 확인 모달
  - 알림 메시지 모달 (SweetAlert2 활용) <br><br>


### 2. 이미지 업로드 시스템
- **드래그 앤 드롭**
  - 이미지 파일 드래그 앤 드롭 지원
  - 이미지 미리보기 

- **이미지 편집**
  - 이미지 순서 변경
  - 이미지 삭제
  - 메인 이미지 설정
  - 이미지 압축 처리 <br><br>

### 3. UI 컴포넌트
- **상태 표시**
  - 상품 상태 구분 (판매중/판매완료)
  - 색상 기반 제품 품질 표시 (새상품/보통/좋지않음 등)
  - 호버 시 상태 설명
  - 애니메이션 효과

- **탭 시스템**
  - 카테고리별 상품 분류
  - 내 상점 관리 탭
  - 채팅방 목록 탭
  - 부드러운 전환 효과<br><br><br>

## BE 주요 기능  
### 1. Socket.io를 통한 실시간 채팅 기능  <br>

### 주요 기능
- 실시간 1:1 채팅
- 이미지 전송 지원
- 읽음 확인 기능
- 채팅방 생성 및 관리
- 실시간 메시지 동기화<br><br>

### 채팅 기능 설명

#### 1. 채팅방 관리
- 상품 상세 페이지에서 "채팅하기" 버튼을 통해 새로운 채팅방 생성
- 동일한 상품에 대한 중복 채팅방 생성 방지
- 채팅방 목록에서 실시간으로 채팅방 상태 확인 가능

#### 2. 실시간 메시지 전송
- Socket.IO를 활용한 실시간 양방향 통신
- 텍스트 메시지 및 이미지 전송 지원
- 메시지 전송 시 자동 스크롤 최하단 이동   

#### 3. 읽음 확인 시스템
- 메시지 수신 시 자동 읽음 처리
- 실시간 읽음 상태 동기화

#### 4. 채팅방 부가 기능
- 상품 정보와 판매자 정보 통합 표시
- 채팅방에서 상품 페이지로 이동하는 배너 지원
- 채팅방 나가기 기능 <br><br>

### 데이터 구조

#### 채팅방 (chatRoom)
```javascript
{
  member: [buyerId, sellerId],
  sellerName: String,
  sellerProfileImg: String,
  buyerName: String,
  productName: String,
  productPrice: Number,
  productFrontPhoto: String,
  productID: String,
  date: Date
}
```

#### 채팅 메시지 (chatMessages)
```javascript
{
  user: String,
  text: String,
  room: String,
  image: String,
  timestamp: Date,
  isRead: Boolean
}
```
<br>

### 보안 및 성능
- Socket.IO 연결 상태 모니터링
- MongoDB 연결 관리 및 에러 처리
- 메시지 전송 실패 시 자동 재시도
- 채팅방 접근 권한 검증<br><br>

### 사용자 경험
- 채팅방 진입 시 자동 스크롤 최상단 이동
- 이미지 미리보기 기능
- 실시간 타이핑 표시
- 채팅방 나가기 전 확인 대화상자<br><br><br>



## 2. 인증 시스템 (로그인/회원가입/로그아웃)

### 주요 기능
- 사용자 회원가입
- 로그인/로그아웃
- 세션 기반 인증
- 비밀번호 암호화
- 자동 로그인
<br><br>
### 인증 기능에서 사용한 기술 스택
- **BackEnd**: `Node.js`, `Express`, `Passport.js`
- **인증**: `Passport Local Strategy`, `bcrypt`
- **세션 관리**: `express-session`, `connect-mongo`
- **데이터베이스**: `MongoDB` (user 컬렉션)   
<br><br>
### 인증 기능 설명
   
#### 1. 회원가입 시스템
- ID/PW 유효성 검증
  - ID: 4~20자 제한
  - PW: 8~20자 제한
- 중복 ID 검사
- 비밀번호 암호화 (bcrypt)
- 회원가입 성공 시 자동 로그인
   
#### 2. 로그인 시스템
- `Passport.js` 기반 인증
- 세션 기반 로그인 유지
- 실시간 로그인 상태 관리
- 로그인 실패 시 에러 메시지 표시
   
#### 3. 보안 기능
- 비밀번호 해싱 (`bcrypt`)
- 세션 쿠키 보안 설정

  ``` javascript
  httpOnly: true
  secure: false      // 개발 환경
  sameSite: 'Lax'
  ```
- 세션 만료 시간 설정 (1시간)
   
#### 4. 사용자 경험
- 실시간 입력값 유효성 검사
- 직관적인 에러 메시지
- 자동 로그인 상태 유지<br><br>

### 데이터 구조

#### 사용자 (user)
```javascript
{
  username: String,      // 사용자 ID
  password: String,      // 암호화된 비밀번호
  profileImg: String     // 프로필 이미지 URL
}
``` 

### 보안 및 성능
- MongoDB 세션 스토어 사용
- 비동기 비밀번호 해싱
- 세션 데이터베이스 저장
- 에러 처리 및 로깅
