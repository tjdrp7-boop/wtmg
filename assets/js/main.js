(function () {
  'use strict';

  /* =========================================================
     ⚙️  설정 — 여기 한 줄만 바꾸면 폼이 구글시트로 전송됩니다.
     Google Apps Script 배포 후 받은 웹앱 URL을 붙여넣으세요.
     비워두면(''): 데모 모드 — 실제 전송 없이 성공 화면만 표시.
     ========================================================= */
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbyy-FRFT5DqVXndaeIhcTtP2kwIZweKiQBjRbz0BP1pSzY9Ii5yH6t1oeXVNU2PNkRqPA/exec';

  var qp = new URLSearchParams(location.search);
  var body = document.body;
  var cards = document.querySelectorAll('.switch-card');
  var trackWealth = document.getElementById('track-wealth');
  var trackSelf = document.getElementById('track-self');
  var trackField = document.getElementById('trackField');
  var firstInterest = document.getElementById('i1');

  /* ---------- 트랙(자산가/자영업자) 전환 ---------- */
  function setTrack(track, doScroll) {
    var isWealth = track !== 'self';
    body.classList.toggle('track-wealth', isWealth);
    body.classList.toggle('track-self', !isWealth);
    trackWealth.classList.toggle('show', isWealth);
    trackSelf.classList.toggle('show', !isWealth);
    cards.forEach(function (c) {
      var on = c.getAttribute('data-track') === (isWealth ? 'wealth' : 'self');
      c.classList.toggle('active', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (trackField) trackField.value = isWealth ? '전문직/법인' : '자영업자';
    if (firstInterest) firstInterest.checked = true;
    if (doScroll) {
      var p = document.getElementById('principle');
      if (p) p.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  cards.forEach(function (c) {
    c.addEventListener('click', function () {
      setTrack(c.getAttribute('data-track'), true);
    });
  });

  // 광고 랜딩 분리: ?track=self 또는 ?track=wealth 로 진입하면 자동 분기
  var qtrack = qp.get('track');
  if (qtrack === 'self' || qtrack === 'wealth') setTrack(qtrack, false);

  /* ---------- 폼 제출 ---------- */
  var form = document.getElementById('leadForm');
  var msg = document.getElementById('formMsg');
  var success = document.getElementById('formSuccess');
  var btn = form.querySelector('.submit');

  function showError(text) {
    msg.textContent = text;
    msg.className = 'form-msg err';
  }
  function clearError() {
    msg.textContent = '';
    msg.className = 'form-msg';
  }

  function collectUTM() {
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    var parts = [];
    keys.forEach(function (k) {
      var v = qp.get(k);
      if (v) parts.push(k + '=' + v);
    });
    return parts.join('&');
  }

  function showSuccess() {
    form.style.display = 'none';
    if (success) success.classList.add('show');
    // 광고 전환 추적(설치돼 있을 때만 동작, 없으면 무시)
    try { if (window.gtag) gtag('event', 'generate_lead'); } catch (e) {}
    try { if (window.fbq) fbq('track', 'Lead'); } catch (e) {}
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearError();

    // 허니팟에 값이 차 있으면 봇 → 조용히 무시
    if (form.company_hp && form.company_hp.value) return;

    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    if (!name) { showError('성함을 입력해 주세요.'); form.name.focus(); return; }
    if (!/^[0-9\-\s]{9,}$/.test(phone)) { showError('연락처를 정확히 입력해 주세요.'); form.phone.focus(); return; }
    if (!form.consent.checked) { showError('개인정보 수집·이용에 동의해 주세요.'); return; }

    // 전송 데이터 구성
    var fd = new FormData(form);
    fd.delete('company_hp');
    fd.append('utm', collectUTM());
    fd.append('referrer', document.referrer || '');
    fd.append('ua', navigator.userAgent || '');
    fd.append('page', location.href);

    // 데모 모드
    if (!ENDPOINT) { showSuccess(); return; }

    btn.disabled = true;
    btn.textContent = '전송 중…';

    // Apps Script는 no-cors(simple request)로 보내면 프리플라이트 없이 항상 기록됩니다.
    // 응답 본문은 읽을 수 없으므로(opaque), 성공/네트워크오류만 구분합니다.
    fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: fd })
      .then(function () { showSuccess(); })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = '상담 신청하기';
        showError('전송에 실패했습니다. 잠시 후 다시 시도하시거나 010-6693-1936으로 연락 주세요.');
      });
  });
})();
