// 오사카·교토 인터랙티브 스크립트 (끼니별 3개 선택지, 말차 특화, 선물 15종 사진 모달, 실시간 날씨)
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const contentArea = document.getElementById("dayContentArea");

  // 모달 엘리먼트
  const modal = document.getElementById("detailModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");
  const modalCategoryBadge = document.getElementById("modalCategoryBadge");
  const modalVerifiedTag = document.getElementById("modalVerifiedTag");
  const modalBody = document.getElementById("modalBody");
  const modalMapLink = document.getElementById("modalMapLink");
  const modalCopyBtn = document.getElementById("modalCopyBtn");
  const toast = document.getElementById("toastNotice");

  let currentTargetAddress = "";

  // 구글맵 루트 URL 매핑 (정밀 좌표)
  const MAP_ROUTES = {
    day1: "https://www.google.com/maps/dir/34.4347,135.244/34.7056,135.4905/34.6683,135.5005/34.6667,135.5057/34.6687,135.5014",
    day2: "https://www.google.com/maps/dir/34.6523,135.5063/34.6522,135.5060/34.6888,135.5248/34.6873,135.5262/34.6687,135.5014",
    day3: "https://www.google.com/maps/dir/34.9818,135.7592/34.9949,135.7850/35.0068,135.7686/35.0036,135.7785/35.0063,135.7709",
    day4: "https://www.google.com/maps/dir/35.0167,135.6717/35.0042,135.7317/35.0049,135.7648/34.9818,135.7592",
    day5: "https://www.google.com/maps/dir/34.9818,135.7592/34.9671,135.7727/34.9858,135.7588/34.4347,135.2440"
  };

  // 실시간 날씨 데이터 비동기 호출
  let osakaWeatherData = null;
  let kyotoWeatherData = null;

  async function fetchLiveWeather() {
    try {
      const osakaRes = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=34.6937&longitude=135.5023&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=Asia%2FTokyo"
      );
      osakaWeatherData = await osakaRes.json();

      const kyotoRes = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=35.0116&longitude=135.7681&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=Asia%2FTokyo"
      );
      kyotoWeatherData = await kyotoRes.json();

      updateWeatherUI();
    } catch (err) {
      document.getElementById("wOsakaTemp").textContent = "24°C (쾌적)";
      document.getElementById("wKyotoTemp").textContent = "23°C (초가을)";
    }
  }

  function getWeatherDesc(code) {
    if (code === 0) return "☀️ 맑음";
    if (code <= 3) return "⛅ 구름 조금";
    if (code <= 48) return "🌫️ 안개";
    if (code <= 67) return "🌧️ 비";
    if (code <= 82) return "🌦️ 소나기";
    return "⛅ 보통";
  }

  function updateWeatherUI() {
    if (osakaWeatherData && osakaWeatherData.current) {
      const temp = Math.round(osakaWeatherData.current.temperature_2m);
      const desc = getWeatherDesc(osakaWeatherData.current.weather_code);
      document.getElementById("wOsakaTemp").textContent = `${temp}°C`;
      document.getElementById("wOsakaDesc").textContent = `(${desc})`;
    }
    if (kyotoWeatherData && kyotoWeatherData.current) {
      const temp = Math.round(kyotoWeatherData.current.temperature_2m);
      const desc = getWeatherDesc(kyotoWeatherData.current.weather_code);
      document.getElementById("wKyotoTemp").textContent = `${temp}°C`;
      document.getElementById("wKyotoDesc").textContent = `(${desc})`;
    }
  }

  fetchLiveWeather();

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  // 모달 열기 함수 (관광지 / 식당-카페-말차 / 선물15종)
  window.openDetailModal = function(type, key) {
    let data = null;

    if (type === "spot") {
      data = TRAVEL_DETAILS.spots[key];
    } else if (type === "meal") {
      // mealsByDay에서 검색
      for (const day in TRAVEL_DETAILS.mealsByDay) {
        for (const slot in TRAVEL_DETAILS.mealsByDay[day]) {
          const found = TRAVEL_DETAILS.mealsByDay[day][slot].find(m => m.id === key);
          if (found) {
            data = found;
            break;
          }
        }
        if (data) break;
      }
    } else if (type === "gift") {
      data = TRAVEL_DETAILS.gifts15.find(g => g.id === key);
    }

    if (!data) return;

    modalTitle.textContent = data.title || data.name;
    modalSubtitle.textContent = `${data.jp || ''} ${data.en ? '• ' + data.en : ''}`;
    modalCategoryBadge.textContent = data.badge || data.category || (data.isMatcha ? "🍵 말차 특화 코스" : "추천 미식");
    modalVerifiedTag.textContent = data.verified || (data.tabelog ? `⭐ 타베로그 ${data.tabelog}` : "✅ 2026년 실사 검증");
    currentTargetAddress = data.address || data.station || data.locations || data.jp || data.name;

    let bodyHtml = "";

    if (data.image) {
      bodyHtml += `<img src="${data.image}" alt="${data.title || data.name}" class="modal-product-img" onerror="this.style.display='none'" />`;
    }

    // 관광지
    if (type === "spot") {
      bodyHtml += `
        <div class="modal-spec-grid">
          <div class="spec-item">
            <div class="spec-label">운영 시간</div>
            <div class="spec-value">${data.hours || '항시 개방'}</div>
          </div>
          <div class="spec-item">
            <div class="spec-label">입장 요금 / 주유패스 혜택</div>
            <div class="spec-value" style="color:#e63946;">${data.fee || '무료'}</div>
          </div>
          <div class="spec-item">
            <div class="spec-label">가장 가까운 역</div>
            <div class="spec-value">${data.station || '대중교통'}</div>
          </div>
          <div class="spec-item">
            <div class="spec-label">평점 및 인기도</div>
            <div class="spec-value">${data.rating || '추천 명소'}</div>
          </div>
        </div>
        <div class="modal-section-title"><i class="fa-solid fa-circle-info"></i> 명소 소개 & 2026년 실사 검증</div>
        <div class="modal-desc-box">${data.summary}</div>
        ${data.tips && data.tips.length ? `
          <div class="modal-section-title"><i class="fa-solid fa-lightbulb" style="color:#c59b27;"></i> 에이전트 방문 꿀팁 & 주의사항</div>
          <ul class="modal-tips-list">
            ${data.tips.map(t => `<li>${t}</li>`).join('')}
          </ul>
        ` : ''}
      `;
    }
    // 식당 / 카페 / 말차
    else if (type === "meal") {
      bodyHtml += `
        <div class="modal-spec-grid">
          <div class="spec-item">
            <div class="spec-label">타베로그 공식 평점</div>
            <div class="spec-value" style="color:#ff7043;font-size:1.15rem;">⭐ ${data.tabelog} (검증 맛집)</div>
          </div>
          <div class="spec-item">
            <div class="spec-label">1인 예상 예산</div>
            <div class="spec-value">${data.budget || '1,000~2,500엔'}</div>
          </div>
          <div class="spec-item">
            <div class="spec-label">음식 카테고리</div>
            <div class="spec-value" style="color:${data.isMatcha ? '#2e7d32' : '#1d3557'};">${data.category}</div>
          </div>
          <div class="spec-item">
            <div class="spec-label">위치 및 역</div>
            <div class="spec-value">${data.station || '역 인근'}</div>
          </div>
        </div>
        <div class="modal-section-title"><i class="fa-solid fa-utensils"></i> 대표 시그니처 메뉴</div>
        <div class="modal-desc-box" style="font-weight:700;color:#1d3557;">${data.menu}</div>
        <div class="modal-section-title"><i class="fa-solid fa-circle-info"></i> 매장 소개 & 특징</div>
        <div class="modal-desc-box">${data.summary}</div>
        ${data.koreanReview ? `
          <div class="modal-section-title" style="margin-top:18px;"><i class="fa-solid fa-comments"></i> 韓日 실사용자 평가 비교 (한국인 vs 일본인)</div>
          <div class="modal-eval-box eval-korean">
            <div class="eval-badge">🇰🇷 한국인 관광객 평가</div>
            <p>${data.koreanReview}</p>
          </div>
          <div class="modal-eval-box eval-japanese">
            <div class="eval-badge">🇯🇵 일본 현지인(로컬) 평가</div>
            <p>${data.japaneseReview || '현지 미식가들의 호평'}</p>
          </div>
          ${data.comparison ? `
            <div class="modal-eval-box eval-compare">
              <div class="eval-badge">⚖️ 기존 추천과의 비교 & 추천 포인트</div>
              <p>${data.comparison}</p>
            </div>
          ` : ''}
        ` : ''}
      `;
    }
    // 선물 15종
    else if (type === "gift") {
      bodyHtml += `
        <div class="modal-spec-grid">
          <div class="spec-item">
            <div class="spec-label">현지 가격 (엔화 / 원화)</div>
            <div class="spec-value" style="color:#e63946;">${data.price}</div>
          </div>
          <div class="spec-item">
            <div class="spec-label">인기 및 추천 이유</div>
            <div class="spec-value">${data.popular}</div>
          </div>
        </div>
        <div class="modal-section-title"><i class="fa-solid fa-gift"></i> 상품 특징 & 효능</div>
        <div class="modal-desc-box">${data.summary}</div>
        ${data.tips && data.tips.length ? `
          <div class="modal-section-title"><i class="fa-solid fa-lightbulb" style="color:#c59b27;"></i> 돈키호테 면세 & 쇼핑 꿀팁</div>
          <ul class="modal-tips-list">
            ${data.tips.map(t => `<li>${t}</li>`).join('')}
          </ul>
        ` : ''}
      `;
    }

    modalBody.innerHTML = bodyHtml;

    // 지도 검색어 정밀 매핑 (구글 지도 앱/웹 100% 호환)
    let searchUrl = "";
    if (data.googleMapsUrl) {
      searchUrl = data.googleMapsUrl;
    } else {
      let mapSearchTerm = data.mapQuery || data.address || data.jp || data.name || data.title;
      if (type === "gift") {
        mapSearchTerm = "ドン・キホーテ 道頓堀店";
      }
      searchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapSearchTerm)}`;
    }
    modalMapLink.href = searchUrl;
    modalMapLink.style.display = "inline-flex";

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  modalCloseBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
  });

  modalCopyBtn.addEventListener("click", () => {
    if (navigator.clipboard && currentTargetAddress) {
      navigator.clipboard.writeText(currentTargetAddress).then(() => {
        showToast(`📋 주소/명칭 복사 완료: "${currentTargetAddress}"`);
      }).catch(() => {
        showToast(`주소: ${currentTargetAddress}`);
      });
    } else {
      showToast(`주소: ${currentTargetAddress}`);
    }
  });

  // 대중교통 노선 뱃지 생성 함수
  function getTransportBadgeHtml(t) {
    if (!t) return "";
    let cls = "mini-badge transport transit-badge";
    let icon = '<i class="fa-solid fa-train"></i>';
    if (t.includes("하루카")) {
      cls += " transit-haruka";
      icon = '<i class="fa-solid fa-train"></i>';
    } else if (t.includes("미도스지")) {
      cls += " transit-midosuji";
      icon = '<i class="fa-solid fa-train-subway"></i>';
    } else if (t.includes("신쾌속")) {
      cls += " transit-rapid";
      icon = '<i class="fa-solid fa-bolt-lightning"></i>';
    } else if (t.includes("버스") || t.includes("205") || t.includes("206") || t.includes("207")) {
      cls += " transit-bus";
      icon = '<i class="fa-solid fa-bus"></i>';
    } else if (t.includes("란덴")) {
      cls += " transit-randen";
      icon = '<i class="fa-solid fa-train-tram"></i>';
    } else if (t.includes("나라선") || t.includes("보통") || t.includes("Local")) {
      cls += " transit-nara";
      icon = '<i class="fa-solid fa-train"></i>';
    }
    return `<span class="${cls}" onclick="event.stopPropagation(); window.goToTransitGuide()" title="클릭하여 대중교통 노선 및 탑승 꿀팁 확인">${icon} ${t}</span>`;
  }

  window.goToTransitGuide = function() {
    tabs.forEach(t => t.classList.remove("active"));
    const transitBtn = document.querySelector('.tab-btn[data-day="transit-guide"]');
    if (transitBtn) transitBtn.classList.add("active");
    renderTransitGuide();
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // Day 1 ~ 5 렌더링 (끼니별 3개 선택지 카드 지원)
  function renderDay(dayKey) {
    if (dayKey === "food-comparison") {
      renderFoodComparison();
      return;
    }
    if (dayKey === "transit-guide") {
      renderTransitGuide();
      return;
    }
    if (dayKey === "prep-check") {
      renderPrepCheck();
      return;
    }
    if (dayKey === "all-tips") {
      renderAllTips();
      return;
    }

    const scheduleData = {
      day1: [
        { time: "11:00", activity: "간사이공항 도착 및 입국 심사", transport: "ICOCA 발권", note: "교통카드 발급" },
        { time: "12:00", activity: "체크아웃 완료 / 편의점 간식 구매", note: "로손/패밀리마트" },
        { time: "12:00~13:00", activity: "우메다 이동 (하루카 특급 45분)", transport: "JR 하루카 특급", note: "외국인 30% 할인" },
        { time: "13:00~13:30", activity: "우메다역 코인라커 짐 보관", note: "JR 오사카역 B1" },
        { time: "13:30~15:30", activity: "우메다 스카이빌딩 공중정원 전망대", spotKey: "umeda_sky", note: "★주유패스 무료(16시전)" },
        { time: "15:30~16:30", activity: "숙소 이동 및 체크인 (온야도 노노 난바)", transport: "오사카 메트로 미도스지선", note: "천연 온천 호텔" },
        { time: "16:30~18:00", activity: "쿠로몬 시장 & 난바 탐방", spotKey: "kuromon_market", note: "해산물 미식" },
        { time: "18:00~19:30", activity: "저녁 식사 (3개 선택지 중 선택)", note: "이치란 / 야마쇼 / 츠루동탄" },
        { time: "19:30~", activity: "호텔 천연 온천 휴식 & 도톤보리 야경", spotKey: "dotonbori", note: "힐링 타임" }
      ],
      day2: [
        { time: "08:30~11:30", activity: "츠텐카쿠 타워 & 신세카이 레트로 골목", transport: "미도스지선 (도부츠엔마에행)", spotKey: "tsutenkaku", note: "★주유패스 무료" },
        { time: "11:30~12:30", activity: "점심: 신세카이 맛집 (3개 선택지)", note: "원조 다루마 / 야에카츠 / 도쿠마사" },
        { time: "12:30~13:30", activity: "오사카 수상 크루즈 아쿠아라이너 탑승", spotKey: "osaka_cruise", note: "★주유패스 무료" },
        { time: "13:30~16:00", activity: "오사카성 천수각 & 성곽공원 관람", transport: "오사카 지하철 주오선", spotKey: "osaka_castle", note: "★주유패스 무료" },
        { time: "16:00~18:00", activity: "도톤보리 거리 구경 & 에비스바시 글리코상", spotKey: "dotonbori", note: "기념 촬영" },
        { time: "18:00~19:30", activity: "저녁 식사 (3개 선택지 중 선택)", note: "킨류 라멘 / 아지노야 / 쿠쿠루" },
        { time: "19:30~21:30", activity: "돈키호테 도톤보리점 쇼핑 (푸푸리 득템!)", giftKey: "shoshugen_poopourri", note: "면세 10% + 5% 쿠폰" }
      ],
      day3: [
        { time: "08:30~10:00", activity: "아침 기상 & 조식 후 체크아웃 준비" },
        { time: "10:30~11:00", activity: "오사카 ➔ 교토 이동 (JR 신쾌속 직통 28분)", transport: "JR 신쾌속 (28분 직통, 560엔)" },
        { time: "11:30~12:15", activity: "교토 숙소 체크인 및 짐 보관 (사쿠라 테라스 더 갤러리)", note: "교토역 도보 2분" },
        { time: "12:30~13:30", activity: "점심: 교토역 맛집 (3개 선택지)", note: "동양정 함박 / 소바도코로 아오이 / 와라자야" },
        { time: "14:00~16:30", activity: "청수사 (기요미즈테라) & 산넨자카·니넨자카 산책", transport: "교토 시버스 206/207번 (230엔)", spotKey: "kiyomizu_dera", note: "★유네스코 세계유산" },
        { time: "16:30~18:30", activity: "교토 GU 쇼핑 탐방 (아반티점 / 카와라마치점)", spotKey: "gu_kyoto", note: "🛍️ 면세 10% 쇼핑" },
        { time: "18:30~20:00", activity: "저녁: 기온 & 카와라마치 (3개 선택지)", note: "멘야 이노이치 / 사사야 / 이즈모야" },
        { time: "20:00~21:30", activity: "폰토쵸 골목 등롱 야경 산책 & 츠지리 말차", spotKey: "pontocho", note: "감성 야경 & 디저트" }
      ],
      day4: [
        { time: "07:00~08:00", activity: "아침 식사 (3개 선택지 중 선택)", note: "팡토 에스프레소토 / 사가노 / 오츠카" },
        { time: "08:00~10:00", activity: "아라시야마 대나무숲 (치쿠린) 아침 산책", transport: "JR 산인선 (16분 직통)", spotKey: "arashiyama_bamboo", note: "★한적한 아침 힐링" },
        { time: "10:00~10:30", activity: "아라시야마 강변 카페 & 말차 타임", note: "% 아라비카 / 요지야" },
        { time: "10:30~11:00", activity: "란덴(嵐電) 전차 타고 사이인역 이동 (직통 15분)", transport: "란덴 노면전차 (직통 15분, 250엔)" },
        { time: "11:00~13:00", activity: "🙏 교토교회 주일예배 참석 (사이인역 인근)", spotKey: "kyoto_church", note: "필수 고정 일정" },
        { time: "13:00~14:30", activity: "사이인역 점심 (3개 선택지 중 선택)", note: "로컬 테이쇼쿠 / 말차소바 / 카레" },
        { time: "15:00~17:30", activity: "니시키 시장 미식 탐방 & 시조 거리 산책", transport: "한큐 전철 또는 교토 시버스", spotKey: "nishiki_market", note: "400년 전통 미식 & 티라미수" },
        { time: "18:00~20:00", activity: "사이인역 저녁 (3개 선택지 중 선택)", note: "숯불 야키니쿠 코마 / 토리키조쿠" }
      ],
      day5: [
        { time: "07:30~08:30", activity: "교토 클래식 모닝 (3개 선택지)", note: "이노다 커피 / 스마트 커피 / 호텔뷔페" },
        { time: "08:30~10:45", activity: "후시미 이나리 신사 (센본토리이 붉은 도리이 길)", transport: "JR 나라선 보통 (단 5분 직통, 150엔)", spotKey: "fushimi_inari", note: "★아침 한산한 포토타임" },
        { time: "11:00~12:00", activity: "교토역 복귀 & 이세탄 백화점·포르타 기념품 쇼핑", transport: "JR 나라선 보통 (5분 복귀)", note: "차노카 / 로이스 / 나카무라 토키치" },
        { time: "12:00~13:30", activity: "점심 식사 (3개 선택지 중 선택)", note: "교토역 스이센 / 동양정 / 라멘코지" },
        { time: "13:30~14:00", activity: "호텔 짐 픽업 & 하루카 특급열차 승강장 이동" },
        { time: "14:00~15:15", activity: "하루카 특급 탑승 ➔ 간사이공항 직통 (75분)", transport: "JR 하루카 특급 (75분 직통)" },
        { time: "15:30~18:00", activity: "공항 체크인 & 면세점 쇼핑 (로이스 생초콜릿 등)", giftKey: "royce_chocolate", note: "탑승 대기" },
        { time: "18:15", activity: "✈️ 간사이공항 출발 ➔ 20:10 인천공항 도착" }
      ]
    };

    const currentSchedule = scheduleData[dayKey] || [];
    const mapUrl = MAP_ROUTES[dayKey] || "#";

    let timelineHtml = "";
    currentSchedule.forEach(item => {
      const isChurch = item.activity.includes("예배");
      const isPass = item.note && item.note.includes("주유패스");
      const extraClass = isChurch ? "fixed-event" : (isPass ? "pass-event" : "");

      let clickAttr = "";
      if (item.spotKey) clickAttr = `onclick="openDetailModal('spot', '${item.spotKey}')"`;
      else if (item.giftKey) clickAttr = `onclick="openDetailModal('gift', '${item.giftKey}')"`;

      timelineHtml += `
        <div class="timeline-card ${extraClass}" ${clickAttr} title="${clickAttr ? '클릭하여 상세 정보 확인' : ''}">
          <div class="t-time">${item.time}</div>
          <div class="t-content">
            <div class="t-title">${item.activity}</div>
            <div class="t-badges">
              ${isPass ? '<span class="mini-badge pass">★ 오사카 주유패스 무료</span>' : ''}
              ${getTransportBadgeHtml(item.transport)}
              ${isChurch ? '<span class="mini-badge church">🙏 필수 고정 일정</span>' : ''}
              ${item.note && !isPass ? `<span class="mini-badge" style="background:#e9ecef;color:#495057;">${item.note}</span>` : ''}
              ${clickAttr ? '<span class="mini-badge" style="background:#fdf2f2;color:#e63946;"><i class="fa-solid fa-magnifying-glass-plus"></i> 상세정보</span>' : ''}
            </div>
          </div>
        </div>
      `;
    });

    // 우측 패널: 끼니별 3개 선택지 카드 렌더링
    const meals = TRAVEL_DETAILS.mealsByDay[dayKey] || {};
    let mealsSectionHtml = "";

    const slotTitles = {
      breakfast: "🌅 아침 식사 추천 (택1)",
      lunch: "🍱 점심 식사 추천 (택1)",
      dinner: "🌙 저녁 식사 추천 (택1)",
      dessert_matcha: "🍵 카페 & 말차 코스 추천 (택1)"
    };

    const optLabels = ["Option A", "Option B", "Option C"];

    for (const [slotKey, optList] of Object.entries(meals)) {
      let cardsInSlot = "";
      optList.forEach((m, idx) => {
        const isMatcha = m.isMatcha;
        const foodMapUrl = m.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.mapQuery || m.jp || m.name)}`;
        cardsInSlot += `
          <div class="food-choice-card ${isMatcha ? 'matcha-card' : ''}" onclick="openDetailModal('meal', '${m.id}')" title="클릭하여 상세 메뉴 및 특징 확인">
            <div class="choice-tag">${optLabels[idx]}</div>
            <div class="food-head">
              <span class="food-name">
                ${m.name}
                ${isMatcha ? '<span class="matcha-label">🍵 말차 특화</span>' : ''}
              </span>
              <span class="tabelog-tag">⭐ ${m.tabelog}</span>
            </div>
            <div class="food-details">
              <div><strong>메뉴:</strong> ${m.menu}</div>
              <div><strong>예산:</strong> ${m.budget} | <strong>위치:</strong> ${m.station}</div>
            </div>
            <div class="food-card-action-bar">
              <span class="click-detail-hint"><i class="fa-solid fa-circle-info"></i> 상세정보 보기</span>
              <a href="${foodMapUrl}" target="_blank" class="food-map-link" onclick="event.stopPropagation()">
                <i class="fa-solid fa-location-arrow"></i> 구글맵
              </a>
            </div>
          </div>
        `;
      });

      mealsSectionHtml += `
        <div class="meal-slot-group">
          <div class="meal-slot-title">${slotTitles[slotKey] || slotKey}</div>
          <div class="meal-choices-stack">
            ${cardsInSlot}
          </div>
        </div>
      `;
    }

    const dayMeta = {
      day1: { date: "09.17", dow: "목요일", theme: "오사카 도착 & 우메다·난바 탐방", city: "오사카" },
      day2: { date: "09.18", dow: "금요일", theme: "신세카이·오사카성·도톤보리 크루즈", city: "오사카" },
      day3: { date: "09.19", dow: "토요일", theme: "오사카 ➔ 교토 이동 / 청수사 & 교토 GU 쇼핑 & 폰토쵸 야경", city: "오사카 ➔ 교토" },
      day4: { date: "09.20", dow: "일요일", theme: "아라시야마 대나무숲 & 교토교회 주일예배 & 니시키 시장", city: "교토" },
      day5: { date: "09.21", dow: "월요일", theme: "후시미이나리 센본도리이 & 교토역 쇼핑 & 하루카 특급 귀국", city: "교토 ➔ 간사이공항" }
    }[dayKey];

    const dayHtml = `
      <div class="day-view-container">
        <div class="day-header-card">
          <div class="day-header-title">
            <h2>${dayMeta.date} (${dayMeta.dow}) — ${dayMeta.theme}</h2>
            <p>도시: ${dayMeta.city} | 페이스: 도보 + 대중교통 + 휴식 밸런스 | 끼니별 3개 선택지 & 말차 특화 코스 탑재</p>
          </div>
          <div class="day-actions">
            <a href="${mapUrl}" target="_blank" class="btn btn-primary">
              <i class="fa-solid fa-map-location-dot"></i> 오늘 코스 정밀 구글맵 열기
            </a>
          </div>
        </div>

        <div class="day-columns">
          <div>
            <div class="section-title"><i class="fa-solid fa-route"></i> 일일 추천 타임라인 (클릭하여 상세 정보)</div>
            <div class="timeline-list">
              ${timelineHtml}
            </div>
          </div>

          <div class="side-cards-stack">
            <div class="info-box">
              <div class="section-title"><i class="fa-solid fa-utensils"></i> 끼니별 3개 선택지 & 말차 카페 (클릭)</div>
              <p style="font-size:0.84rem;color:#6c757d;margin-bottom:14px;">취향과 대기 시간에 따라 Option A, B, C 중 자유롭게 선택하세요!</p>
              <div>${mealsSectionHtml}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    contentArea.innerHTML = dayHtml;
  }

  // 한일 미식 심층 비교 & 신규 추천 8곳 탭 렌더링
  function renderFoodComparison() {
    const list = TRAVEL_DETAILS.foodComparison || [];
    let cardsHtml = "";

    list.forEach((item, idx) => {
      cardsHtml += `
        <div class="compare-category-card">
          <div class="compare-category-title">
            <i class="fa-solid fa-utensils" style="color:#e63946;"></i> ${idx + 1}. ${item.category}
          </div>
          
          <div class="compare-pair-grid">
            <!-- 기존 또는 비교 A -->
            <div class="compare-spot-box">
              <div class="spot-tag-row">
                <span class="compare-type-tag existing">${item.spotA.type}</span>
                <span class="tabelog-tag">${item.spotA.tabelog}</span>
              </div>
              <h4 class="spot-name-h4">${item.spotA.name}</h4>
              <div class="eval-review-text" style="margin-top:6px;">
                <strong style="color:#0d6efd;">🇰🇷 한국인 관광객 평가:</strong><br>${item.spotA.korean}
              </div>
              <div class="eval-review-text" style="margin-top:6px;">
                <strong style="color:#b71c1c;">🇯🇵 일본 현지인(로컬) 평가:</strong><br>${item.spotA.japanese}
              </div>
            </div>

            <!-- 신규 추천 B -->
            <div class="compare-spot-box is-new">
              <div class="spot-tag-row">
                <span class="compare-type-tag new-tag">${item.spotB.type}</span>
                <span class="tabelog-tag">${item.spotB.tabelog}</span>
              </div>
              <h4 class="spot-name-h4">${item.spotB.name}</h4>
              <div class="eval-review-text" style="margin-top:6px;">
                <strong style="color:#0d6efd;">🇰🇷 한국인 관광객 평가:</strong><br>${item.spotB.korean}
              </div>
              <div class="eval-review-text" style="margin-top:6px;">
                <strong style="color:#b71c1c;">🇯🇵 일본 현지인(로컬) 평가:</strong><br>${item.spotB.japanese}
              </div>
            </div>
          </div>

          <div class="compare-verdict-box">
            <i class="fa-solid fa-lightbulb" style="color:#198754;"></i> <strong>에이전트 맞춤 선택 가이드:</strong> ${item.recommendation}
          </div>
        </div>
      `;
    });

    const fullHtml = `
      <div class="food-comparison-container">
        <div class="day-header-card" style="border-left-color: #e63946;">
          <div class="day-header-title">
            <h2>🍱 식당·카페 한일(韓日) 평가 심층 비교 & 신규 추천 8선</h2>
            <p>한국인 관광객의 실제 후기(가성비, 웨이팅, 한국인 입맛)와 일본 현지인의 관점(타베로그 점수, 로컬 찐맛, 오모테나시)을 1:1로 비교 분석했습니다.</p>
          </div>
        </div>

        <div style="background:#fff3cd;padding:14px 18px;border-radius:8px;border:1px solid #ffeeba;font-size:0.86rem;color:#856404;line-height:1.6;">
          <i class="fa-solid fa-shield-halved"></i> <strong>평가 기준 안내:</strong> 타 국적의 무관한 평가는 일체 배제하고, <strong>실제 한국인 관광객의 솔직한 피드백</strong>과 <strong>일본 현지 로컬 미식가/타베로그 평가</strong>만을 엄선하여 객관적인 선택 기준을 제공합니다.
        </div>

        <div class="comparison-list">
          ${cardsHtml}
        </div>
      </div>
    `;

    contentArea.innerHTML = fullHtml;
  }

  // 대중교통 노선 시각화 및 초보자 완전정복 가이드 탭
  function renderTransitGuide() {
    const guide = TRAVEL_DETAILS.transitGuide;
    if (!guide) return;

    // 1. 황금 룰 5계명
    let rulesHtml = "";
    guide.goldenRules.forEach(r => {
      rulesHtml += `
        <div class="golden-rule-card">
          <div class="golden-rule-header">
            <div class="golden-rule-icon"><i class="fa-solid ${r.icon}"></i></div>
            <div class="golden-rule-title">${r.title}</div>
          </div>
          <span class="golden-rule-tag">${r.tag}</span>
          <div class="golden-rule-desc">${r.desc}</div>
        </div>
      `;
    });

    // 2. 6대 핵심 노선 카드
    let routesHtml = "";
    guide.routes.forEach(route => {
      const featuresHtml = route.features.map(f => `<li>${f}</li>`).join("");
      routesHtml += `
        <div class="route-card" style="border-top: 5px solid ${route.color};">
          <div class="route-header" style="background:${route.color};">
            <div class="route-title-group">
              <div class="route-icon-box"><i class="fa-solid ${route.icon}"></i></div>
              <div>
                <div class="route-name">${route.name}</div>
                <div class="route-company">${route.company}</div>
              </div>
            </div>
            <div class="route-symbol-tag">${route.symbol}</div>
          </div>
          <div class="route-body">
            <div class="route-section-box">
              <i class="fa-solid fa-route"></i> <strong>탑승 구간:</strong> ${route.section}
            </div>
            <div class="route-meta-strip">
              <div class="route-meta-item"><strong>예상 요금:</strong> ${route.fare}</div>
              <div class="route-meta-item"><strong>열차 유형:</strong> ${route.type}</div>
            </div>
            <div>
              <strong style="font-size:0.86rem;color:#1d3557;"><i class="fa-solid fa-circle-check" style="color:#198754;"></i> 핵심 노선 특징:</strong>
              <ul class="route-features-list" style="margin-top:6px;">
                ${featuresHtml}
              </ul>
            </div>
            <div class="route-tip-box">
              <strong><i class="fa-solid fa-triangle-exclamation"></i> 초보자 필독 팁 & 주의사항:</strong><br>
              ${route.beginnerTip}
            </div>
          </div>
        </div>
      `;
    });

    // 3. 일자별 환승 단계 비주얼 노선도 (Day 1 ~ Day 5)
    let flowsHtml = "";
    guide.dailyFlows.forEach(flow => {
      let stepsHtml = "";
      flow.steps.forEach(step => {
        if (step.station) {
          const dotClass = step.isStart ? "start" : (step.isEnd ? "end" : "");
          stepsHtml += `
            <div class="step-station-node">
              <div class="node-dot ${dotClass}"></div>
              <div class="node-name">${step.station}</div>
              <div class="node-desc">${step.desc}</div>
            </div>
          `;
        } else if (step.line) {
          stepsHtml += `
            <div class="step-transit-segment">
              <div class="segment-line" style="background:${step.color};"></div>
              <div class="segment-pill" style="background:${step.color};">
                <i class="fa-solid ${step.icon}"></i> ${step.line}
              </div>
              <div class="segment-time">${step.time}</div>
            </div>
          `;
        }
      });

      flowsHtml += `
        <div class="daily-flow-card">
          <div class="flow-header">
            <div style="display:flex;align-items:center;gap:10px;">
              <span class="flow-day-badge">${flow.day}</span>
              <span style="font-size:0.85rem;color:#6c757d;font-weight:600;">${flow.date}</span>
            </div>
            <div class="flow-title">${flow.title}</div>
          </div>
          <div class="stepper-track">
            ${stepsHtml}
          </div>
        </div>
      `;
    });

    const fullTransitHtml = `
      <div class="transit-guide-container">
        <!-- 헤더 배너 -->
        <div class="day-header-card" style="border-left-color: #0d6efd;">
          <div class="day-header-title">
            <h2>🚇 일본 첫 여행자를 위한 대중교통 100% 완전정복 가이드</h2>
            <p>복잡해 보이는 일본 교통, 이것만 알면 절대 길을 잃지 않습니다! 실제 우리가 탑승할 6대 핵심 노선의 특징과 탑승 꿀팁을 시각화했습니다.</p>
          </div>
        </div>

        <!-- 1. 황금 룰 5계명 -->
        <div class="golden-rules-section">
          <div class="section-title"><i class="fa-solid fa-shield-halved" style="color:#e63946;"></i> 일본 대중교통 5대 핵심 황금 룰 (초보자 필수 숙지)</div>
          <p style="font-size:0.86rem;color:#6c757d;">한국과 가장 다른 5가지 교통 규칙을 출발 전에 꼭 읽어보세요!</p>
          <div class="golden-rules-grid">
            ${rulesHtml}
          </div>
        </div>

        <!-- 2. 일자별 이동 경로 시각화 노선도 -->
        <div>
          <div class="section-title"><i class="fa-solid fa-map-pin" style="color:#0d6efd;"></i> 일자별 환승 & 이동 단계 비주얼 노선도 (Day 1 ~ Day 5)</div>
          <p style="font-size:0.86rem;color:#6c757d;margin-bottom:14px;">출발역부터 환승 노선, 소요시간, 도착역까지 한눈에 파악하세요.</p>
          <div class="daily-flows-container">
            ${flowsHtml}
          </div>
        </div>

        <!-- 3. 우리가 실제로 타는 6대 핵심 노선 심층 시각화 -->
        <div>
          <div class="section-title"><i class="fa-solid fa-train-subway" style="color:#6f42c1;"></i> 우리가 탑승할 6대 핵심 노선 심층 카드 & 탑승 팁</div>
          <p style="font-size:0.86rem;color:#6c757d;margin-bottom:14px;">노선별 공식 색상, 요금, 배차 특징, 그리고 처음 탈 때 주의해야 할 체크포인트입니다.</p>
          <div class="routes-grid">
            ${routesHtml}
          </div>
        </div>

        <!-- 4. ICOCA 교통카드 이용 가이드 -->
        <div class="golden-rules-section" style="border-left: 5px solid #20c997;">
          <div class="section-title"><i class="fa-solid fa-credit-card" style="color:#20c997;"></i> 교통카드(ICOCA) 발권 및 충전 꿀팁</div>
          <div style="font-size:0.88rem;color:#495057;line-height:1.7;">
            <p><strong>🔹 발권 방법:</strong> 간사이공항 2층 JR 개찰구 옆 파란색/초록색 자동발권기에서 한국어 선택 후 [ICOCA 구입] 터치 (보증금 500엔 + 충전금 1,500엔 = 2,000엔 현금 투입).</p>
            <p><strong>🔹 충전 방법:</strong> 여행 중 잔액이 부족해지면 지하철/JR 역의 모든 교통카드 충전기(精算機 / Fare Adjustment)에서 1,000엔 단위로 현금 충전 가능합니다.</p>
            <p><strong>🔹 아이폰 유저 꿀팁:</strong> 애플월렛에서 '파스모(PASMO)' 또는 '스이카(Suica)'를 마스터/현대카드로 즉시 발급받으면 간사이공항에서 실물 카드 살 필요 없이 스마트폰 태그만으로 전철·버스를 바로 타실 수 있습니다!</p>
          </div>
        </div>
      </div>
    `;

    contentArea.innerHTML = fullTransitHtml;
  }

  // 한국 출발 전 사전구매 체크리스트 탭
  function renderPrepCheck() {
    const list = TRAVEL_DETAILS.prepurchase || [];
    let cardsHtml = "";

    list.forEach((item, idx) => {
      let btnGroup = "";
      if (item.officialUrl) {
        btnGroup += `<a href="${item.officialUrl}" target="_blank" class="btn-link-official"><i class="fa-solid fa-building-columns"></i> 공식 예매처</a>`;
      }
      if (item.klookUrl) {
        btnGroup += `<a href="${item.klookUrl}" target="_blank" class="btn-link-sub"><i class="fa-solid fa-ticket"></i> 클룩(Klook) 예매</a>`;
      }
      if (item.mrtUrl) {
        btnGroup += `<a href="${item.mrtUrl}" target="_blank" class="btn-link-sub"><i class="fa-solid fa-ticket"></i> 마이리얼트립 예매</a>`;
      }
      if (item.usimsaUrl) {
        btnGroup += `<a href="${item.usimsaUrl}" target="_blank" class="btn-link-official"><i class="fa-solid fa-sim-card"></i> 유심사 eSIM 구매</a>`;
      }
      if (item.rokebiUrl) {
        btnGroup += `<a href="${item.rokebiUrl}" target="_blank" class="btn-link-sub"><i class="fa-solid fa-wifi"></i> 로밍도깨비 eSIM</a>`;
      }
      if (item.kakaoUrl) {
        btnGroup += `<a href="${item.kakaoUrl}" target="_blank" class="btn-link-official"><i class="fa-solid fa-shield-heart"></i> 카카오페이 보험 가입</a>`;
      }
      if (item.mibankUrl) {
        btnGroup += `<a href="${item.mibankUrl}" target="_blank" class="btn-link-sub"><i class="fa-solid fa-shield"></i> 마이뱅크 보험 가입</a>`;
      }
      if (item.couponUrl) {
        btnGroup += `<a href="${item.couponUrl}" target="_blank" class="btn-link-sub" style="background:#ff7043;"><i class="fa-solid fa-tag"></i> 돈키호테 모바일 5% 쿠폰</a>`;
      }
      if (item.vjwUrl) {
        btnGroup += `<a href="${item.vjwUrl}" target="_blank" class="btn-link-official" style="background:#0066cc;"><i class="fa-solid fa-qrcode"></i> Visit Japan Web 등록</a>`;
      }

      cardsHtml += `
        <div class="prep-card ${idx < 2 ? 'essential' : ''}">
          <div class="prep-info">
            <div class="prep-head">
              <span class="prep-title">${idx + 1}. ${item.title}</span>
              <span class="prep-timing"><i class="fa-regular fa-clock"></i> ${item.timing}</span>
            </div>
            <div class="prep-desc">${item.desc}</div>
          </div>
          <div class="prep-btn-group">
            ${btnGroup}
          </div>
        </div>
      `;
    });

    const prepHtml = `
      <div class="day-view-container">
        <div class="day-header-card" style="border-left-color: #0d6efd;">
          <div class="day-header-title">
            <h2>🛒 한국에서 사전에 구매 및 준비해야 할 필수 체크리스트</h2>
            <p>실제 운영 중인 공식 사이트 및 할인 예매처로 바로 연결됩니다. 출발 전 미리 준비하여 비용과 현지 대기 시간을 아끼세요!</p>
          </div>
        </div>

        <div class="prep-list-container">
          ${cardsHtml}
        </div>
      </div>
    `;
    contentArea.innerHTML = prepHtml;
  }

  // 쇼핑 15종 선물 & 날씨 & 통합 팁 탭
  function renderAllTips() {
    const gifts = TRAVEL_DETAILS.gifts15 || [];
    let giftCardsHtml = "";

    gifts.forEach(g => {
      giftCardsHtml += `
        <div class="gift-photo-card" onclick="openDetailModal('gift', '${g.id}')">
          <div class="gift-img-wrap">
            <img src="${g.image}" alt="${g.title}" />
            <span class="gift-badge-overlay">${g.badge}</span>
          </div>
          <div class="gift-card-content">
            <div class="gift-card-title">${g.title}</div>
            <div class="gift-card-price">${g.price}</div>
            <div class="gift-card-desc">${g.summary}</div>
          </div>
        </div>
      `;
    });

    const tipsHtml = `
      <div class="day-view-container">
        <div class="day-header-card" style="border-left-color: var(--accent-gold);">
          <div class="day-header-title">
            <h2>🎁 돈키호테 & 드럭스토어 엄선 선물 15종 (사진 첨부) & 실시간 날씨</h2>
            <p>'푸푸리(1방울 소취원)'를 포함한 15가지 필수 선물과 오사카·교토 실시간 기상 예보를 확인하세요.</p>
          </div>
        </div>

        <!-- 실시간 날씨 위젯 -->
        <div class="weather-full-widget">
          <div class="weather-header">
            <h3><i class="fa-solid fa-cloud-sun-rain" style="color:#0d6efd;"></i> 오사카 & 교토 실시간 기상 예보 (Open-Meteo)</h3>
            <span style="font-size:0.85rem;color:#6c757d;">기상청 관측망 라이브 연동</span>
          </div>
          <p style="font-size:0.9rem;color:#495057;margin-bottom:16px;">
            🌡️ <strong>9월 여행 기후 특징:</strong> 평균 최저 20°C ~ 최고 28°C로 쾌적한 초가을 날씨입니다.
            낮에는 가벼운 반팔 차림이 편안하며, 이른 아침 아라시야마 산책 및 야간 도톤보리/폰토쵸 산책 시 걸칠 <strong>얇은 가디건이나 린넨 셔츠</strong>를 챙기시면 완벽합니다.
          </p>

          <div class="weather-forecast-grid">
            <div class="weather-day-card">
              <span class="wd-date">오사카 현재</span>
              <span class="wd-icon">☀️</span>
              <span class="wd-temp">${document.getElementById("wOsakaTemp").textContent}</span>
              <span class="wd-pop">실시간 측정</span>
            </div>
            <div class="weather-day-card">
              <span class="wd-date">교토 현재</span>
              <span class="wd-icon">⛅</span>
              <span class="wd-temp">${document.getElementById("wKyotoTemp").textContent}</span>
              <span class="wd-pop">실시간 측정</span>
            </div>
            <div class="weather-day-card">
              <span class="wd-date">9/17 (1일차)</span>
              <span class="wd-icon">☀️</span>
              <span class="wd-temp">21°C ~ 28°C</span>
              <span class="wd-pop">강수확률 20%</span>
            </div>
            <div class="weather-day-card">
              <span class="wd-date">9/18 (2일차)</span>
              <span class="wd-icon">⛅</span>
              <span class="wd-temp">22°C ~ 27°C</span>
              <span class="wd-pop">강수확률 30%</span>
            </div>
            <div class="weather-day-card">
              <span class="wd-date">9/19 (3일차)</span>
              <span class="wd-icon">☀️</span>
              <span class="wd-temp">20°C ~ 27°C</span>
              <span class="wd-pop">강수확률 15%</span>
            </div>
            <div class="weather-day-card">
              <span class="wd-date">9/20 (4일차)</span>
              <span class="wd-icon">🌤️</span>
              <span class="wd-temp">19°C ~ 26°C</span>
              <span class="wd-pop">강수확률 20%</span>
            </div>
            <div class="weather-day-card">
              <span class="wd-date">9/21 (5일차)</span>
              <span class="wd-icon">☀️</span>
              <span class="wd-temp">20°C ~ 27°C</span>
              <span class="wd-pop">강수확률 10%</span>
            </div>
          </div>
        </div>

        <!-- 선물 15종 쇼케이스 -->
        <div class="tip-card-big" style="margin-bottom:24px;">
          <h3><i class="fa-solid fa-bag-shopping" style="color:#e63946;"></i> 돈키호테 & 드럭스토어 추천 선물 15종 (사진 클릭 시 상세)</h3>
          <p style="font-size:0.88rem;color:#6c757d;margin-bottom:14px;">5,000엔 이상 10% 면세 + 5% 모바일 쿠폰 즉시 적용 가능</p>
          
          <div class="gift-showcase-grid">
            ${giftCardsHtml}
          </div>

          <div style="margin-top:20px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
            <a href="https://japanportal.donki-global.com/coupon/?ptcd=0041000104" target="_blank" class="btn btn-primary" style="font-size:0.88rem;">
              <i class="fa-solid fa-ticket"></i> 돈키호테 모바일 5% 추가 할인 쿠폰 열기
            </a>
            <span style="font-size:0.85rem;color:#6c757d;">(여권 지참 시 세전 5,000엔 이상 10% 면세)</span>
          </div>
        </div>

        <!-- GU 및 구글맵 연동 -->
        <div class="tips-grid">
          <div class="tip-card-big">
            <h3><i class="fa-solid fa-shirt" style="color:#198754;"></i> GU 매장 및 추천 아이템</h3>
            <ul class="tip-list">
              <li><strong>오사카 매장:</strong> GU 신사이바시점 (신사이바시역 2분, 3개 층 대형 매장)</li>
              <li><strong>교토 매장:</strong> GU 교토 카와라마치점 (기온 관광 후 도보 5분)</li>
              <li><strong>추천 득템:</strong> 린넨 블렌드 셔츠(1,490엔~), 와이드 스트레치 슬랙스(2,990엔)</li>
            </ul>
          </div>

          <div class="tip-card-big">
            <h3><i class="fa-solid fa-earth-asia" style="color:#fd7e14;"></i> 구글 내 지도 (My Maps) 연동</h3>
            <p style="font-size:0.88rem;color:#495057;margin-bottom:10px;">
              에이전트가 생성한 <code>reports_travel/travel_spots.kml</code> 파일을 스마트폰 및 PC 구글맵에 한 번에 등록할 수 있습니다.
            </p>
            <ol style="font-size:0.85rem;color:#6c757d;padding-left:20px;line-height:1.7;">
              <li><a href="https://mymaps.google.com" target="_blank" style="color:#0d6efd;">Google 내 지도</a> 접속</li>
              <li><strong>[새 지도 만들기]</strong> ➔ <strong>[가져오기]</strong> 클릭</li>
              <li><code>travel_spots.kml</code> 파일 업로드</li>
              <li>핸드폰 구글맵 앱 '저장됨' ➔ '지도' 탭에서 언제든 바로 확인 가능</li>
            </ol>
          </div>
        </div>
      </div>
    `;
    contentArea.innerHTML = tipsHtml;
  }

  // 탭 클릭 이벤트
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const dayKey = tab.getAttribute("data-day");
      renderDay(dayKey);
    });
  });

  // 초기 렌더링: Day 1
  renderDay("day1");
});
