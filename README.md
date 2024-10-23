# API Endpoint

## 목차
1. [사용자 관리](#사용자-관리)
2. [연결 관리](#연결-관리)
3. [리더보드](#리더보드)

## 사용자 관리

### 사용자 생성
- **URL**: `/api/auth/signup`
- **메소드**: `POST`
- **Request**:
  ```json
  {
    "username": "testuser",
    "current_profile_picture": "https://example.com/profile.jpg",
    "twitter_id": "testuser123",
    "wallet_address": "0x123..."
  }
  ```
- **Response**: 생성된 사용자 객체

### 사용자 삭제
- **URL**: `/api/auth/:userId`
- **메소드**: `DELETE`
- **Response**: 삭제 확인 메시지

### 사용자 프로필 업데이트
- **URL**: `/api/auth/:userId/profile`
- **메소드**: `PATCH`
- **Request**: 업데이트할 사용자 필드
  ```json
  {
    "username": "String",
    "current_profile_picture": "String"
  }
  ```
- **Response**: 업데이트된 사용자 객체

### 트위터 계정 연결
- **URL**: `/api/auth/:userId/connect-twitter`
- **메소드**: `PATCH`
- **Request**:
  ```json
  {
    "twitterId": "String"
  }
  ```
- **Response**: 업데이트된 사용자 객체
- 
### 디스코드 계정 연결
- **URL**: `/api/auth/:userId/connect-discord`
- **메소드**: `PATCH`
- **Request**:
  ```json
  {
    "discordId": "String"
  }
  ```
- **Response**: 업데이트된 사용자 객체

### 지갑 주소 연결
- **URL**: `/api/auth/:userId/connect-wallet`
- **메소드**: `PATCH`
- **Request**:
  ```json
  {
    "walletAddress": "String"
  }
  ```
- **Response**: 업데이트된 사용자 객체

### 사용자 연결 목록 조회
- **URL**: `/api/auth/:userId/connections`
- **메소드**: `GET`
- **응답**: 연결된 사용자 객체 배열
  ```json
  [
    {
      "id": "String",
      "username": "String",
      "current_profile_picture": "String"
    }
  ]

## 연결 관리

### 연결 요청
- **URL**: `/api/connection/request`
- **메소드**: `POST`
- **Request**:
  ```json
  {
    "requester_username": "String",
    "receiver_username": "String",
    "proofImage": "String"
  }
  ```
- **Response**: 
  ```json
  {
    "success": "Boolean",
    "message": "String",
    "code": "200",
    "data" {
      "successful": "Connections object",
      "failed": "failedObject",
    }
  }
  ```

## 리더보드

### 연결 리더보드 조회
- **URL**: `/api/leaderboard/connections`
- **메소드**: `GET`
- **Params**:
  - `page`: 페이지 번호 (기본값: 1)
  - `limit`: 페이지당 결과 수 (기본값: 100)
  - `sortOrder`: 정렬 순서 ('ASC' 또는 'DESC', 기본값: 'DESC')
- **Response**: 연결 수에 따른 사용자 배열
  ```json
  [
    {
      "username": "String",
      "connectionCount": "Number"
    }
  ]

## 참고 사항
- 현재 모든 엔드포인트는 인증을 필요로 하지 않습니다.