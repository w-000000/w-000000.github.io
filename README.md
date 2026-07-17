# SKALA Front-End 개인 포털

HTML, CSS, JavaScript로 제작한 임창우의 개인 포털 웹사이트입니다.
개발자로서의 프로젝트와 성장 과정뿐만 아니라 강의, 일상, 여행 기록을 하나의 공간에 담았습니다.

## 웹사이트 접속

브라우저 주소창에 아래 주소를 입력하거나 링크를 클릭하면 접속할 수 있습니다.

**[https://w-000000.github.io/](https://w-000000.github.io/)**

## 주요 페이지

- `index.html` : 전체 콘텐츠를 연결하는 메인 포털
- `myProfile.html` : 개인 소개와 성장 과정
- `portfolio.html` : 프로젝트, 기술 스택, 수상 내역
- `myClass.html` : 주간 강의 시간표
- `myHoliday.html` : 휴일 시간대별 일과
- `myTrip.html` : 여행 사진, 음악, 영상
- `signUp.html` : Firebase 회원가입
- `signUpResult.html` : 회원가입 완료 안내
- `login.html` : Firebase 로그인
- `comments.html` : 로그인 사용자 댓글 게시판

## 사용 기술

- HTML5
- CSS3
- JavaScript
- Firebase Authentication
- Cloud Firestore
- GitHub Pages

Bootstrap, Tailwind CSS, jQuery 등의 외부 UI 라이브러리 없이 직접 디자인하고 구현했습니다.

## 주요 기능

- 여러 HTML 페이지를 연결한 개인 포털 구조
- Flexbox와 Grid를 활용한 반응형 레이아웃
- 모바일 환경을 고려한 화면 구성
- 라이트 모드와 다크 모드 전환
- 스크롤 진행 표시와 콘텐츠 등장 애니메이션
- 사용자 컴퓨터 기준 실시간 날짜와 시계
- Firebase 기반 회원가입, 로그인, 로그아웃
- 로그인 사용자 댓글 등록, 수정, 삭제
- 최고·최근·플레이 기록이 저장되는 Up-Down 게임
- 이미지, 오디오, 비디오 콘텐츠 제공
- 표, 폼, 목록 등 다양한 HTML 요소 활용

## 포트폴리오 내용

- 멀티에이전트 기반 면접 표현 습관 분석 시스템
- AI 기반 감귤 자동 수확 및 품질 분류 로봇
- TabPFN 기반 소프트웨어 결함 예측
- LSTM AutoEncoder 기반 시스템 이상 탐지
- 사용자 맞춤 레시피 추천 시스템
- Java 기반 Shoot the Duck 게임
- 프로그래밍 언어 및 기술 스택
- 수상 내역 및 자격증

## 프로젝트 구조

```text
skala-front/
├── index.html
├── myProfile.html
├── portfolio.html
├── myClass.html
├── myHoliday.html
├── myTrip.html
├── signUp.html
├── signUpResult.html
├── login.html
├── comments.html
├── css/
│   ├── style.css
│   └── showcase.css
├── js/
│   ├── auth-menu.js
│   ├── comments.js
│   ├── firebase-config.js
│   ├── login.js
│   ├── showcase.js
│   ├── signup.js
│   └── theme.js
├── script/
│   └── upDown.js
└── media/
    ├── myphoto.jpeg
    ├── music.mp3
    ├── croatia_travel.mp4
    └── 여행 이미지 파일
```

## 로컬 실행

저장소를 내려받은 후 VS Code의 Live Server로 `index.html`을 실행하면 전체 기능을 확인할 수 있습니다.
