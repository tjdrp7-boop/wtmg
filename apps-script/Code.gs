/**
 * 윤미현 마스터플래너 랜딩 — 상담신청 → 구글시트 수집기
 *
 * 사용법은 README.md의 "폼을 구글시트에 연결하기" 참고.
 * 이 스크립트를 시트에 연결한 컨테이너 스크립트로 쓰거나(권장),
 * 독립 스크립트로 만들고 SHEET_ID 를 채워서 사용해도 됩니다.
 */

// 시트가 스크립트에 연결돼 있지 않은 '독립 스크립트'라면 여기에 스프레드시트 ID를 넣으세요.
// (스프레드시트 URL의 /d/ 와 /edit 사이 문자열). 컨테이너 스크립트면 '' 그대로 두면 됩니다.
var SHEET_ID = '';
var SHEET_NAME = '상담신청';

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);

    var data = (e && e.parameter) ? e.parameter : {};
    // JSON 본문으로 들어오는 경우도 대비
    if (e && e.postData && e.postData.type === 'application/json') {
      try { data = JSON.parse(e.postData.contents); } catch (err) {}
    }

    var ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // 헤더 줄 자동 생성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        '접수시각', '구분', '성함', '연락처', '관심분야',
        '희망통화시간', '업종/회사', '동의', '유입경로(UTM)', 'Referrer', '페이지', 'User-Agent'
      ]);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      data.track || '',
      data.name || '',
      "'" + (data.phone || ''),   // 앞의 ' 는 010... 이 숫자로 변환되는 것 방지
      data.interest || '',
      data.time || '',
      data.job || '',
      data.consent || '',
      data.utm || '',
      data.referrer || '',
      data.page || '',
      data.ua || ''
    ]);

    // (선택) 새 신청이 들어오면 메일 알림 — 아래 두 줄 주석 해제 + 이메일 입력
    // MailApp.sendEmail('받을주소@example.com', '[랜딩] 새 상담신청',
    //   (data.name||'') + ' / ' + (data.phone||'') + ' / ' + (data.interest||'') + ' / ' + (data.track||''));

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

// 배포가 살아있는지 브라우저로 확인할 때 사용 (GET 접속 시 ok 표시)
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
