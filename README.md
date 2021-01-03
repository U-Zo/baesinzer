# Baesinzer

React + Spring Boot 텍스트 기반 웹 게임

![](https://github.com/U-Zo/project-w/blob/master/_github_img/main.png)

## Skills

### Client

- React
- Redux
- Redux-saga
- Styled-components
- SockJS
- Stomp

### Server

- Spring-boot
- SockJS
- Stomp
- JPA (Hibernate)
- Oracle DB

## Contributors

- 김우조 (PM)
- 박세진
- 박성원

# Running Project

## 프로젝트 환경

BaesinZer 프로젝트는 개발 서버 구동을 위해 아래의 환경이 필요합니다.

### Client

- Node.js LTS
- Yarn

### Server

- IntelliJ or Spring Tools 4

### Database

- Oracle 11g

## 프로젝트 복사

```
git clone https://github.com/U-Zo/baesinzer.git
```

## Database 준비

아래 경로의 SQL 코드 sys 계정에서 수행

```
./server/sql/baesinzer.sql
```

## Client

### 자바스크립트 의존 모듈 설치

```
cd ./client
yarn install
```

### 프로젝트 실행

```
yarn start
```

### 회원 가입

```
http://localhost:3000/register
```

1. 이메일, 비밀번호, 비밀번호 확인 후 회원가입
2. 회원가입 시 이메일로 온 메일 링크 확인

### 로그인

```
http://localhost:3000/
```

이메일 인증 후 로그인

### Lobby (대기실)

```
http://localhost:3000/lobby
```

- 방 만들기
  1. 상단의 NICKNAME 입력란에 원하는 닉네임 입력
  2. 하단의 방 만들기 버튼 클릭
  3. 방 제목 입력 후 방 만들기 버튼 클릭
- 방 접속하기
  1. 상단의 NICKNAME 입력란에 원하는 닉네임 입력
  2. 중단의 방 목록에서 방 클릭

### Room (게임 방)

```
http://localhost:3000/room/{roomCode}
```

게임 방은 방 접속 또는 방 만들기를 통해서만 접속 가능

#### 게임 승리 조건

- 시민
  1. 모든 시민이 모든 일과를 수행할 경우 (죽었을 시에도 수행해야 함)
  2. 투표에서 BaesinZer를 찾아냈을 경우
- BaesinZer
  1. 시민의 수를 1명 이하로 줄였을 경우

#### 기능 및 명령어

- 채팅
  - 하단의 입력란에 입력 후 Enter 또는 입력 버튼 클릭
- 게임 시작 (방장)
  - 오른쪽 하단의 `START` 버튼 클릭
  - 게임 시작은 참가자가 3명 이상일 때 가능
  - BaesinZer 1명 랜덤 지정
  - 모든 시민의 일과 랜덤 지정
- 퇴장
  - 오른쪽 하단의 `EXIT` 버튼 클릭
- 게임 중
  - 공통
    1. 이동
        - `/이동` 입력, 엔터 후 원하는 장소 번호 선택 입력, 엔터
    2. 투표 (회의 중)
        - `/투표 사용자 번호` 입력, 엔터
  - 시민
    1. 일과
        - `/일과` 입력, 엔터 후 원하는 일과 번호 선택 입력, 엔터
  - BaesinZer
    1. 살해
        - `/살해` 입력, 엔터 후 원하는 사용자 번호 선택 입력, 엔터
    2. 방해
        - `/방해` 입력, 엔터 후 원하는 방해 번호 선택 입력, 엔터

## Server

### 프로젝트 실행

```
open as gradle project
run BaesinzerApplication.java
```

