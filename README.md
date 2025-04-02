# MINIQUE_ROKAF
대한민국 공군 兵 852기 김호준, 兵 852기 이민섭이 군생할동안 개발한 토이 프로젝트, 유아 의류 중고거래 플랫폼입니다.<br><br>
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
- 주 4회, 1회당 2시간 이상씩 시간을 할애하고자 했다.
- 군 조직 특성상 훈련, 휴가, 당직 등으로 인한 유동적 스케줄을 염두에 두고 개발했다.<br><br>


## 실행 방법
1. Nodejs 설치 (LTS v18.20.5)
2. MongoDB community server 설치
3. `/BE`와 `/FE` 콘솔에서 `npm i`
4. `/FE` 콘솔에서 `npm run build`
5. `/BE` 콘솔에서 `node server.js` 또는 `nodemon server.js`
6. 콘솔에 뜨는 서버 `ctrl+클릭`으로 서버 주소 클릭<br><br>

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
<br><br><br>

## 로그인
![Image](https://github.com/user-attachments/assets/188de43b-74fa-4797-b5c5-02e003cbb19c)
<br><br><br>

## 이미지 드래그 & 드랍
![Image](https://github.com/user-attachments/assets/8abd2c9e-b1ca-48d5-82f2-4d0b77fce6ce)
<br><br><br>

## 찜 기능
![Image](https://github.com/user-attachments/assets/7bc47a28-4b81-4196-82eb-49673cbfdbf2)
<br><br><br>

## 카테고리 기능
![Image](https://github.com/user-attachments/assets/c9b7a85d-759b-4e39-84ec-c8af2d280363)
<br><br><br>

## 실시간 채팅 기능 및 이미지 첨부
![Image](https://github.com/user-attachments/assets/7344699d-51c5-4adb-ac94-5f001daf6444)
<br><br><br>

## 실시간 읽음 처리 기능 (탭 전환으로 1인 2역)
![Image](https://github.com/user-attachments/assets/460ab196-2571-4888-ac2b-1c42fbf3bda0)
<br><br><br><br>

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
- 실시간 메시지 및 읽음 상태 동기화<br><br>


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
  buyerPofileImg: String,
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
- 자동 로그인<br><br>

### 인증 기능에서 사용한 기술 스택
- **BackEnd**: `Node.js`, `Express`, `Passport.js`
- **인증**: `Passport Local Strategy`, `bcrypt`
- **세션 관리**: `express-session`, `connect-mongo`
- **데이터베이스**: `MongoDB` (user 컬렉션)<br><br>

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
- 에러 처리 및 로깅 <br><br>


## 프로젝트를 진행하면서 아쉬웠던 점
> BE <br>

#### 군 내 특성상 외부 서버와 연결하는 것이 불가능했던 것
- MongoDB를 로컬로 돌렸던 것이 생각보다 불편했다.
- 이미지 변환을 위해 AWS S3를 사용할 수 없어서 BASE64 기반으로 이미지를 변환해서 저장
  - 변환해서 저장된 이미지의 URL이 너무 길어져 더미 데이터가 많아질 수록 서버와 DB에 부담이 많이 간 것으로 예상된다.

#### 첫 프로젝트라 API 명세서나 DB 스키마를 미리 작성하지 않고 프로젝트를 진행해서 도중에 어려움이 많았다.
- API 명세서와 DB 스키마 등 프로젝트 전에 작성하고 진행하는 이유를 직접 몸으로 느낄 수 있었다.

#### 에러 처리의 일관성 부족
- 일부 라우트에서는 상세한 에러 메시지를 반환 BUT 특정 라우트에서는 단순히 "에러가 발생했습니다" 정도의 메시지만 반환했던 점
- 좀 더 상세한 에러 메시지를 통해 더 쉽게 디버깅을 할 수 있었을 것 같다. <br><br>


> FE <br>

#### 반응형 웹에 대한 고려를 하지 않은 점
- 첫 프로젝트인 만큼 고려사항을 줄이기 위해 반응형 웹에 대해 전혀 고려하지 않았다.
- 프로젝트 특성상 모바일 환경에서도 잘 작동할 수 있도록 고려하면 좋았을 것 같다.

#### Typescript를 사용하지 않은 점
- Javascript는 사용해 봤지만, Typescript는 사용해 본 경험이 없어 Javascript를 채택해 개발했다.
- Javascript를 사용하다 보니 props와 state의 자료형으로 인해 에러가 빈번하게 발생하는 등 타입 안정성이 떨어졌다.

#### 코드 스타일 일관성 부족
- 컴포넌트 네이밍 컨벤션/CSS 클래스 셀렉터 네이밍 등의 통일성 부족
- styled-components를 사용하는 경우도, CSS 클래스 셀렉터를 사용하는 경우도 혼재되어 있어 통일성 부족


> 공통 <br>

#### Git을 통한 버전 관리 부족
- 첫 협업이었기 때문에 git을 통한 버전 관리 능력이 부족했음.
- 브랜치를 새로 생성하여 개발, merge하는 등의 체계적 git 관리 개선 필요.
- 커밋 메시지 컨벤션을 보기 쉽게 통일하면 더 좋앗을 것으로 생각된다.

#### 개발 전 기능에 대한 충분한 협의 부족
- 포함될 기능에 대한 협의 및 디자인을 개발 전에 했음에도 불구하고, 개발하면서 바뀌는 점들이 많았음.
- 개발 전 포함될 기능과 디자인 컴포넌트, API 등을 더 확실하게 협의 후 개발했다면 완성도가 높아졌을 것으로 예상.
