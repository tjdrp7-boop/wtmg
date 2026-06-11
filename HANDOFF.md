# 인수인계 문서 (담당 개발자용)

윤미현 마스터플래너 상담 랜딩페이지. **순수 정적 사이트(HTML/CSS/JS)** 라 빌드 과정이 없고,
어떤 정적 호스팅에도 그대로 올라갑니다. (GitHub Pages 기준으로 설명)

상세 배포·시트 연결은 `README.md` 참고. 이 문서는 **인계받아 실제 도메인으로 띄우기까지** 필요한 것만 정리합니다.

---

## 0. 한눈에 — 띄우기 전 반드시 교체할 4가지

| # | 항목 | 위치 | 안 하면 |
|---|---|---|---|
| 1 | 이미지 5장 | `assets/img/` (파일명 고정) | 회색 placeholder 노출 |
| 2 | 폼 수집 endpoint | `assets/js/main.js` 1번째 설정줄 `ENDPOINT` | 폼이 데모 모드(전송 안 됨) |
| 3 | 준법감시인 **심의필 번호** | `index.html` 푸터 `제 0000-000호` | **보험광고 집행 불가** |
| 4 | 도메인 주소 | 아래 2번 섹션의 5곳 | SEO/공유 미리보기 주소 오류 |

---

## 1. 레포 인계 방법 (셋 중 택1)

- **(권장) 새 레포에 그대로 올리기**: 이 폴더 내용을 회사 레포로 복사 후 push.
  ```bash
  git clone https://github.com/tjdrp7-boop/wtmg.git
  cd wtmg
  git remote set-url origin https://github.com/<회사계정>/<레포명>.git
  git push -u origin main
  ```
- **소유권 이전**: 현재 레포(Settings → Transfer ownership)를 회사 계정/조직으로 이전.
- **Fork**: 회사 계정으로 Fork 후 Pages 설정.

> 빌드 도구·node_modules·환경변수 **없음**. 파일만 올리면 됩니다. `.nojekyll`은 GitHub Pages가
> 폴더를 가공 없이 서빙하게 하는 파일이니 **삭제 금지**.

---

## 2. 커스텀 도메인 연결 (윤미현 대표가 도메인 제공)

도메인을 받으면 아래 순서로 진행합니다. 예시 도메인을 `ymh-wm.co.kr`이라고 가정.

### (A) GitHub Pages 설정
1. 레포 **Settings → Pages**
2. Source: **Deploy from a branch** / Branch: **main / (root)** → Save
3. **Custom domain** 칸에 도메인 입력 (`ymh-wm.co.kr` 또는 `www.ymh-wm.co.kr`) → Save
   - 저장하면 레포 루트에 `CNAME` 파일이 자동 생성됩니다.
4. DNS 전파 후 **Enforce HTTPS** 체크 (인증서 자동 발급, 몇 분~수십 분 소요)

### (B) 도메인 등록업체(가비아/후이즈/카페24 등)에서 DNS 설정
**apex(루트) 도메인** `ymh-wm.co.kr` 을 쓸 경우 — A 레코드 4개:
```
A   @   185.199.108.153
A   @   185.199.109.153
A   @   185.199.110.153
A   @   185.199.111.153
```
**www 서브도메인** `www.ymh-wm.co.kr` 을 쓸 경우 — CNAME:
```
CNAME   www   <회사계정>.github.io.
```
> 보통 apex + www 둘 다 설정하고, GitHub Pages에서 한쪽으로 리다이렉트되게 둡니다.
> (IPv6도 쓰면 AAAA: `2606:50c0:8000::153` ~ `:8003::153` 추가)

### (C) 코드 안의 도메인 주소 교체 (현재 `tjdrp7-boop.github.io/wtmg` 로 박혀 있음)
실제 도메인으로 아래 **5곳**을 일괄 변경:
- `index.html` → `<link rel="canonical" ...>`
- `index.html` → `<meta property="og:url" ...>`
- `index.html` → `<meta property="og:image" ...>` (도메인 부분)
- `sitemap.xml` → `<loc>`
- `robots.txt` → `Sitemap:` 줄

---

## 3. 상담 폼 → 구글시트 연결 (누가 받을지 먼저 정하기)

폼 제출은 **Google Apps Script 웹앱**으로 구글시트에 쌓입니다. (서버·DB 불필요)

- **시트/스크립트를 누구 구글 계정으로 만들지 결정** 필요. (윤미현 대표 계정 권장 — 리드 데이터 주인)
- 설정 절차는 `README.md`의 **"2) 폼을 구글시트 하나에 연결하기"** 그대로 따라 하면 됩니다.
- 마지막에 받은 웹앱 URL을 `assets/js/main.js`의 `ENDPOINT`에 넣고 commit/push → 끝.
- 전송 방식은 `mode:'no-cors'`라 CORS 설정 불필요. 응답 본문은 못 읽으므로 **기록 확인은 시트에서**.

대안(개발자 선호 시): Formspree, Tally, 구글폼 등으로 교체 가능. 그 경우 `index.html`의 `<form>`과
`main.js`의 제출 로직만 바꾸면 됩니다.

---

## 4. 콘텐츠 수정 가이드 (자주 만질 곳)

- **문구/카피**: `index.html` 텍스트 직접 수정.
- **색상/여백/폰트**: `assets/css/style.css` 상단 `:root` 변수.
  - `--red` = AIA 레드(브랜드), `track-self`의 `--accent` = 자영업자 트랙 색.
- **트랙 분기 자동 오픈**: 광고 링크에 `?track=self`(자영업) / `?track=wealth`(전문직·법인).
- **UTM**: `?utm_source=...&utm_campaign=...` 붙이면 시트에 그대로 기록.
- **아이콘**: 인라인 SVG(라인 아이콘). 이모지 미사용.
- **전화번호**: `010-6693-1936` / `tel:01066931936` 형태로 여러 곳에 있음(일괄 검색 후 교체).

---

## 5. 광고 추적(선택)
GA4 또는 메타 픽셀 스니펫을 `index.html` `<head>`에 넣으면, 폼 제출 시
`gtag('event','generate_lead')` / `fbq('track','Lead')` 가 자동 발화하도록 이미 연결돼 있습니다.

---

## 6. 법무/준법 체크 (집행 전 필수)
- 보험광고 **준법감시인 심의필 번호** 발급 후 푸터 기재.
- 실제 상담 사례는 **고객 동의·가명 처리** 상태인지 최종 확인.
- 세무·상속 관련 단정 표현은 "~할 수 있습니다" 어투로 작성됨(추가 표현 변경 시 심의 재확인 권장).
