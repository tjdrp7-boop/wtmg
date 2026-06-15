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
