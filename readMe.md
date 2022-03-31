# Sejong Web Programming

## 실행 방법 (처음 브랜치 가져왔을때)

### 1. Node module 생성하기

#### vscode에서 terminal 혹은 cmd 창을 열어, 다음 명령어를 실행한다.

    npm install

### 2. 로컬 서버에서 실행하기

#### vscode에서 terminal 혹은 cmd 창을 열어, 다음 명령어를 실행한다. (명령어 집합은 package.json에서 확인가능)

    npm run dev

## Asset 관련

### 1.asset 저장

#### assets 폴더 안에 넣기, (확장자 별로 정리하면 좋음)

### 2. asset , javascript에서 사용방법

#### ex) /src/scripts/landing.js 에서 /assets/jpeg/mask.jpeg을 쓰고싶다

```

    //이렇게 써도 되긴한데, 비효율 적임, 아래 코드 권장
    //const WRONG_URL =  '../../assets/jpeg/mask.jpeg';

    // 라우트 설정을  (root)/assets <- 로 설정해서, 그냥 /jpeg.mask.jpeg 해도 됨
    const RIGHT_URL = '/jpeg/mask.jpeg'
```
