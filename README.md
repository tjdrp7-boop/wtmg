# 윤미현 마스터플래너 랜딩페이지

AIA프리미어파트너스 청담본부 윤미현 마스터플래너 상담신청 랜딩.
정적 사이트(HTML/CSS/JS)라 **GitHub Pages**로 무료 배포할 수 있고, 상담 폼은
**Google Apps Script + 구글시트**로 받습니다(서버 불필요).

## 폴더 구조

```
yoonmihyun-landing/
├── index.html              # 페이지 본문 (자산가/자영업자 1페이지 분기)
├── assets/
│   ├── css/style.css       # 전체 스타일
│   ├── js/main.js          # 분기 전환 + 폼 전송 (★ ENDPOINT 설정)
│   └── img/                # 이미지 5장을 여기에 (아래 파일명)
├── apps-script/Code.gs     # 구글시트 수집용 Apps Script
├── robots.txt / sitemap.xml
├── .nojekyll               # GitHub Pages가 폴더를 그대로 서빙하게 함
└── README.md
```

## 넣어야 할 이미지 (`assets/img/`)

| 파일명 | 용도 | 권장 비율 |
|---|---|---|
| `profile.jpg` | 히어로 인물 컷 + 폼 썸네일 | 세로 3:4 |
| `mdrt.png` | 히어로 2024 MDRT 뱃지 | 정사각 |
| `cert.png` | 달러보험 전문가과정 수료증 | 세로 |
| `lecture.jpg` | 강의 사진 (신뢰 블록) | 가로 4:3 |
| `card.jpg` | 명함 (푸터) | 가로 9:5 |
| `og.jpg` | 카카오/메타 공유 미리보기 (선택) | 1200×630 |

> 파일이 없으면 회색 placeholder가 자동으로 보입니다. 같은 이름으로 넣으면 바로 교체됩니다.

---

## 1) GitHub Pages 배포

```bash
cd yoonmihyun-landing
git init
git add .
git commit -m "init: 윤미현 마스터플래너 랜딩"
git branch -M main
git remote add origin https://github.com/<아이디>/<레포명>.git
git push -u origin main
```

GitHub 저장소 → **Settings → Pages → Build and deployment**
→ Source: **Deploy from a branch** / Branch: **main** / 폴더: **/(root)** → Save.
1~2분 뒤 `https://<아이디>.github.io/<레포명>/` 으로 접속됩니다.

배포 후 `index.html`의 `og:url`·`canonical`과 `sitemap.xml`의 주소를 실제 주소로 바꾸세요.

---

## 2) 폼을 구글시트 하나에 연결하기 (핵심)

### A. 시트 + 스크립트 만들기
1. [sheets.new](https://sheets.new) 로 새 구글시트 생성 (이름 예: `상담신청 DB`).
2. 그 시트에서 상단 메뉴 **확장 프로그램 → Apps Script** 클릭.
3. 열린 편집기의 기존 코드를 지우고, 이 레포의 **`apps-script/Code.gs`** 내용을 통째로 붙여넣고 저장(💾).
   - (시트 안에서 만들었으므로 `SHEET_ID`는 `''` 그대로 두면 됩니다.)

### B. 웹앱으로 배포
1. 편집기 우측 상단 **배포 → 새 배포**.
2. 톱니바퀴(⚙️) → **웹 앱** 선택.
3. 설정:
   - 설명: 아무거나
   - **다음 사용자로 실행: 나(본인 계정)**
   - **액세스 권한: 모든 사용자(Anyone)**  ← 꼭 이걸로!
4. **배포** → 권한 승인(본인 구글 계정) → 마지막에 나오는 **웹 앱 URL**을 복사.
   (형태: `https://script.google.com/macros/s/AKfy.../exec`)

### C. 사이트에 URL 연결
`assets/js/main.js` 맨 위 한 줄만 바꿉니다:

```js
var ENDPOINT = 'https://script.google.com/macros/s/AKfy.../exec';
```

저장 → 커밋 → 푸시. 끝. 이제 폼 제출이 시트에 한 줄씩 쌓입니다.
시트 컬럼: `접수시각 · 구분 · 성함 · 연락처 · 관심분야 · 희망통화시간 · 업종/회사 · 동의 · UTM · Referrer · 페이지 · UA`

### 동작 방식 메모
- 전송은 `mode:'no-cors'`라 브라우저가 응답 본문을 못 읽습니다(보안 정상 동작). 그래서 사이트는 "전송됨"으로 처리하고, 실제 기록 여부는 **시트에서 확인**하면 됩니다.
- 코드를 **수정**한 뒤에는 반드시 **배포 → 배포 관리 → (기존 배포) 편집 → 버전: 새 버전 → 배포**로 다시 올려야 반영됩니다. (URL은 그대로 유지)
- 새 신청 시 **메일 알림**을 받고 싶으면 `Code.gs`의 `MailApp.sendEmail` 두 줄 주석을 풀고 이메일을 넣으세요.

### 테스트
배포한 웹앱 URL을 브라우저에 그냥 붙여 접속했을 때 `{"result":"ok"}` 가 보이면 살아있는 것입니다.
그 후 사이트에서 폼을 한 번 제출하고 시트에 줄이 생기는지 확인하세요.

---

## 3) 배포 전 교체 체크리스트
- [ ] 이미지 5장 (`assets/img/`)
- [ ] `main.js`의 `ENDPOINT` (구글시트 연결)
- [ ] 준법감시인 **심의필 번호** (`index.html` 푸터 `제 0000-000호`)
- [ ] `og:url` · `canonical` · `sitemap.xml` 의 실제 도메인
- [ ] (선택) `og.jpg` 공유 썸네일
- [ ] (선택) GA4/메타픽셀 스니펫 — 넣으면 폼 전환이 `generate_lead`/`Lead`로 자동 집계됨

## 광고 유입 팁
- 자영업자 광고는 링크에 `?track=self`, 전문직/법인 광고는 `?track=wealth`를 붙이면
  해당 트랙이 자동으로 열립니다. (예: `https://.../?track=self&utm_source=meta&utm_campaign=jaesa`)
- `utm_*` 파라미터는 그대로 시트의 'UTM' 칼럼에 기록됩니다.
