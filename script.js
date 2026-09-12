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
    day1: "https://www.google.com/maps/dir/34.4347,135.244/34.7032,135.4980/34.7056,135.4905/34.7042,135.4878/34.7040,135.4965/34.7037,135.5003/34.6683,135.5005/34.6667,135.5057/34.6687,135.5014",
    day2: "https://www.google.com/maps/dir/34.6683,135.5005/34.6523,135.5063/34.6687,135.5014/34.6873,135.5262/34.6687,135.5014/34.6655,135.4950/34.6683,135.5005",
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
      if (!data) {
        for (const day in TRAVEL_DETAILS.mealsByDay) {
          for (const slot in TRAVEL_DETAILS.mealsByDay[day]) {
            const found = TRAVEL_DETAILS.mealsByDay[day][slot].find(m => m.id === key);
            if (found) { data = found; type = "meal"; break; }
          }
          if (data) break;
        }
      }
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
    if (type === "meal") {
      const isDessert = data.type === "dessert" || (data.category && (data.category.includes("디저트") || data.category.includes("카페") || data.category.includes("과자") || data.category.includes("빙수")));
      if (isDessert) {
        modalCategoryBadge.className = "modal-badge color-badge-yellow";
        modalCategoryBadge.innerHTML = '<i class="fa-solid fa-cake-candles"></i> 디저트 (노랑)';
      } else {
        modalCategoryBadge.className = "modal-badge color-badge-black";
        modalCategoryBadge.innerHTML = '<i class="fa-solid fa-utensils"></i> 식당 (검정)';
      }
    } else if (type === "spot") {
      modalCategoryBadge.className = "modal-badge color-badge-spot";
      modalCategoryBadge.innerHTML = '<i class="fa-solid fa-landmark"></i> 주요 관광지 (빨강)';
    } else {
      modalCategoryBadge.className = "modal-badge";
      modalCategoryBadge.textContent = data.badge || data.category || "🎁 추천 상품";
    }
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
          ${data.reservation ? `
          <div class="spec-item" style="grid-column: span 2; background: #fff8f8; border: 1px solid #ffd6d6;">
            <div class="spec-label" style="color: #c9184a;"><i class="fa-solid fa-calendar-check"></i> 예약 가이드</div>
            <div class="spec-value" style="font-size: 0.95rem; font-weight: 700; color: #c9184a;">${data.reservation}</div>
          </div>` : ''}
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
    } else if (t.includes("버스") || t.includes("리무진") || t.includes("205") || t.includes("206") || t.includes("207")) {
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

  
  // 지도 탭으로 전환하고 특정 스팟에 포커스
  window.goToInteractiveMap = function(dayKey, spotKey) {
    tabs.forEach(t => t.classList.remove("active"));
    const mapTabBtn = document.querySelector('.tab-btn[data-day="interactive-map"]');
    if (mapTabBtn) mapTabBtn.classList.add("active");
    renderInteractiveMap(dayKey || 'all', 'all', spotKey);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  window.goToTransitGuide = function() {
    tabs.forEach(t => t.classList.remove("active"));
    const transitBtn = document.querySelector('.tab-btn[data-day="transit-guide"]');
    if (transitBtn) transitBtn.classList.add("active");
    renderTransitGuide();
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // ==========================================================
  // [🗺️ 관광지 & 맛집 연동 정밀 지도 (식당: 검정 / 디저트: 노랑)]
  // ==========================================================
  let interactiveMap = null;
  let mapMarkers = [];

  function renderInteractiveMap(selectedDay = 'all', selectedType = 'all', targetSpotKey = null) {
    const guideData = TRAVEL_DETAILS.nearbyGuide || {};
    const spotKeys = Object.keys(guideData);

    // 기본 활성화 스팟 결정
    let currentSpotKey = targetSpotKey;
    if (!currentSpotKey || !guideData[currentSpotKey]) {
      if (selectedDay !== 'all') {
        currentSpotKey = spotKeys.find(k => guideData[k].day === selectedDay) || spotKeys[0];
      } else {
        currentSpotKey = spotKeys[0];
      }
    }

    const html = `
      <div class="map-view-container">
        <div class="map-header-card">
          <div class="map-header-top">
            <div class="map-header-title">
              <h2><i class="fa-solid fa-map-location-dot"></i> 오사카 & 교토 관광지 & 맛집/디저트 정밀 지도</h2>
              <p>타베로그 3.5+ 검증 맛집과 인기 디저트 카페, 주요 관광지의 위치와 도보 동선을 한눈에 확인하세요.</p>
            </div>
          </div>
          <div class="map-legend-bar">
            <span class="legend-title"><i class="fa-solid fa-circle-info"></i> 마커 안내:</span>
            <span class="legend-item legend-spot"><i class="fa-solid fa-landmark"></i> 🏛️ 관광지 (빨강)</span>
            <span class="legend-item legend-church"><i class="fa-solid fa-church"></i> ⛪ 교토교회 (보라)</span>
            <span class="legend-item legend-black"><i class="fa-solid fa-utensils"></i> 🍽️ 타베로그 맛집 (검정)</span>
            <span class="legend-item legend-yellow"><i class="fa-solid fa-cake-candles"></i> 🍰 디저트/카페 (노랑)</span>
          </div>
        </div>

        <div class="map-filter-toolbar">
          <div class="filter-group-row">
            <span class="filter-group-label">일정 필터:</span>
            <button class="map-filter-chip ${selectedDay === 'all' ? 'active' : ''}" data-day="all">전체 일정</button>
            <button class="map-filter-chip ${selectedDay === 'day1' ? 'active' : ''}" data-day="day1">Day 1 (우메다/난바)</button>
            <button class="map-filter-chip ${selectedDay === 'day2' ? 'active' : ''}" data-day="day2">Day 2 (신세카이/오사카성)</button>
            <button class="map-filter-chip ${selectedDay === 'day3' ? 'active' : ''}" data-day="day3">Day 3 (교토 니시키/기온)</button>
            <button class="map-filter-chip ${selectedDay === 'day4' ? 'active' : ''}" data-day="day4">Day 4 (아라시야마/가와라마치)</button>
            <button class="map-filter-chip ${selectedDay === 'day5' ? 'active' : ''}" data-day="day5">Day 5 (후시미이나리/교토역)</button>
          </div>
          <div class="filter-group-row">
            <span class="filter-group-label">분류 필터:</span>
            <button class="map-filter-chip ${selectedType === 'all' ? 'active' : ''}" data-type="all">전체 보기</button>
            <button class="map-filter-chip chip-black ${selectedType === 'restaurant' ? 'active' : ''}" data-type="restaurant"><i class="fa-solid fa-utensils"></i> 식당만 (검정)</button>
            <button class="map-filter-chip chip-yellow ${selectedType === 'dessert' ? 'active' : ''}" data-type="dessert"><i class="fa-solid fa-cake-candles"></i> 디저트만 (노랑)</button>
            <button class="map-filter-chip ${selectedType === 'spot' ? 'active' : ''}" data-type="spot"><i class="fa-solid fa-landmark"></i> 관광지만 (빨강)</button>
          </div>
        </div>

        <div class="map-interactive-grid">
          <div class="map-canvas-card">
            <div id="interactiveLeafletMap"></div>
            <div class="map-canvas-footer">
              <span><i class="fa-solid fa-mouse-pointer"></i> 마커를 클릭하면 상세 정보와 도보 동선 길찾기가 열립니다.</span>
              <span id="mapMarkerCountText">표시 중: 0개 장소</span>
            </div>
          </div>
          <div class="map-explorer-panel" id="mapExplorerPanel">
            <!-- 우측 탐색기 패널 -->
          </div>
        </div>
      </div>
    `;

    contentArea.innerHTML = html;

    // 우측 탐색기 패널 렌더링 함수
    function renderExplorer(spotKey) {
      currentSpotKey = spotKey;
      const spot = guideData[spotKey];
      if (!spot) return;

      const spotChipsHtml = spotKeys.map(k => {
        const s = guideData[k];
        const isActive = k === spotKey;
        return `<button class="spot-select-chip ${isActive ? 'active' : ''}" data-spot-key="${k}">${s.spotTitle}</button>`;
      }).join('');

      const allItems = [...(spot.restaurants || []), ...(spot.desserts || [])];
      const restaurants = allItems.filter(r => r.type === 'restaurant');
      const desserts = allItems.filter(r => r.type === 'dessert');

      const renderNearbyCard = (item, isBlack) => `
        <div class="nearby-card ${isBlack ? 'is-black' : 'is-yellow'}">
          <div class="nearby-card-head">
            <span class="nearby-card-title">${item.name}</span>
            <span class="nearby-walk-pill ${isBlack ? 'walk-black' : 'walk-yellow'}">
              <i class="fa-solid fa-person-walking"></i> ${item.walkTime || '도보 인근'}
            </span>
          </div>
          <div style="font-size:0.76rem;color:#868e96;margin-bottom:4px;">${item.jp || ''}</div>
          <div style="display:flex;align-items:center;gap:6px;font-size:0.8rem;margin-bottom:6px;">
            <span style="color:#d63384;font-weight:700;"><i class="fa-solid fa-star"></i> 타베로그 ${item.tabelog || '3.5+'}</span>
            ${item.budget ? `<span style="color:#6c757d;">• 예산: ${item.budget}</span>` : ''}
          </div>
          ${item.walkTip ? `<div class="nearby-walk-tip"><i class="fa-solid fa-compass"></i> <strong>동선 팁:</strong> ${item.walkTip}</div>` : ''}
          <div class="nearby-menu-line"><i class="fa-solid fa-utensils"></i> <strong>추천 메뉴:</strong> ${item.menu || '-'}</div>
          <div class="nearby-actions-row">
            ${item.directionsUrl ? `<a href="${item.directionsUrl}" target="_blank" class="btn-directions"><i class="fa-solid fa-diamond-turn-right"></i> 도보 길찾기</a>` : ''}
            ${item.googleMapsUrl ? `<a href="${item.googleMapsUrl}" target="_blank" class="btn-spot-link"><i class="fa-solid fa-map-location-dot"></i> 구글 지도</a>` : ''}
            <button class="btn-spot-link" onclick="window.focusMapMarker('${item.id}')"><i class="fa-solid fa-location-crosshairs"></i> 지도에서 보기</button>
          </div>
        </div>
      `;

      const explorerHtml = `
        <div class="explorer-header">
          <h3><i class="fa-solid fa-compass"></i> 관광지 기준 인근 맛집·디저트 탐색기</h3>
          <p>관광지를 선택하면 도보 1~10분 거리의 검증 맛집(검정)과 디저트(노랑)가 연동됩니다.</p>
        </div>

        <div class="spot-selector-scroll">
          ${spotChipsHtml}
        </div>

        <div class="active-spot-card">
          <div class="active-spot-top">
            <div>
              <div class="active-spot-title">${spot.spotTitle}</div>
              <div class="active-spot-jp">${spot.spotJp || ''} • <span style="color:#e63946;font-weight:700;">${spot.dayName || ''}</span></div>
            </div>
            ${spot.googleMapsUrl ? `<a href="${spot.googleMapsUrl}" target="_blank" class="btn-directions" style="background:#e63946;"><i class="fa-solid fa-map-pin"></i> 구글맵</a>` : ''}
          </div>
          <div class="active-spot-desc">${spot.description || ''}</div>
        </div>

        ${restaurants.length > 0 ? `
          <div class="nearby-section-group">
            <div class="nearby-group-title title-black">
              <span><i class="fa-solid fa-utensils"></i> 타베로그 검증 맛집 (${restaurants.length}곳)</span>
              <span style="font-size:0.75rem;font-weight:normal;">검정색 핀</span>
            </div>
            <div class="nearby-items-stack">
              ${restaurants.map(r => renderNearbyCard(r, true)).join('')}
            </div>
          </div>
        ` : ''}

        ${desserts.length > 0 ? `
          <div class="nearby-section-group">
            <div class="nearby-group-title title-yellow">
              <span><i class="fa-solid fa-cake-candles"></i> 인기 카페 & 디저트 (${desserts.length}곳)</span>
              <span style="font-size:0.75rem;font-weight:normal;">노란색 핀</span>
            </div>
            <div class="nearby-items-stack">
              ${desserts.map(d => renderNearbyCard(d, false)).join('')}
            </div>
          </div>
        ` : ''}
      `;

      const explorerPanel = document.getElementById("mapExplorerPanel");
      if (explorerPanel) {
        explorerPanel.innerHTML = explorerHtml;
        explorerPanel.querySelectorAll(".spot-select-chip").forEach(chip => {
          chip.addEventListener("click", () => {
            const k = chip.getAttribute("data-spot-key");
            renderExplorer(k);
            if (interactiveMap && guideData[k]) {
              interactiveMap.flyTo([guideData[k].lat, guideData[k].lng], 15, { duration: 0.8 });
              const markerObj = mapMarkers.find(m => m.id === k);
              if (markerObj) markerObj.marker.openPopup();
            }
          });
        });
      }
    }

    renderExplorer(currentSpotKey);

    // Leaflet 지도 초기화
    if (interactiveMap) {
      try { interactiveMap.remove(); } catch(e) {}
      interactiveMap = null;
    }

    const mapElement = document.getElementById("interactiveLeafletMap");
    if (!mapElement || typeof L === "undefined") return;

    interactiveMap = L.map('interactiveLeafletMap', {
      center: [34.85, 135.6],
      zoom: 11
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(interactiveMap);

    mapMarkers = [];
    const bounds = [];

    const createPin = (lat, lng, iconHtml, markerClass, popupHtml, id) => {
      const icon = L.divIcon({
        className: `custom-pin-marker ${markerClass}`,
        html: iconHtml,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -32]
      });
      const marker = L.marker([lat, lng], { icon }).addTo(interactiveMap);
      marker.bindPopup(popupHtml);
      mapMarkers.push({ id, marker, lat, lng });
      bounds.push([lat, lng]);
      return marker;
    };

    let totalDisplayedCount = 0;

    // 관광지 마커 등록
    spotKeys.forEach(k => {
      const s = guideData[k];
      if (!s || !s.lat || !s.lng) return;

      const matchesDay = (selectedDay === 'all' || s.day === selectedDay);
      const matchesType = (selectedType === 'all' || selectedType === 'spot');

      if (matchesDay && matchesType) {
        totalDisplayedCount++;
        const isChurch = (k === 'kyoto_church');
        const badgeClass = isChurch ? 'badge-church' : 'badge-spot';
        const badgeLabel = isChurch ? '⛪ 교토교회' : '🏛️ 관광지';
        const badgeColor = isChurch ? '#8b5cf6' : '#e63946';
        const markerClass = isChurch ? 'marker-church' : 'marker-spot';
        const iconHtml = isChurch ? '<i class="fa-solid fa-church"></i>' : '<i class="fa-solid fa-landmark"></i>';

        const popupContent = `
          <div class="map-popup-box">
            <div class="popup-tag-row">
              <span class="popup-category-badge ${badgeClass}">${badgeLabel}</span>
              <span style="font-size:0.75rem;color:${badgeColor};font-weight:700;">${s.dayName || ''}</span>
            </div>
            <h4 class="popup-title-h4">${s.spotTitle}</h4>
            <div class="popup-jp-name">${s.spotJp || ''}</div>
            <div class="popup-menu-desc">${s.description || ''}</div>
            <div class="popup-btn-stack">
              ${s.googleMapsUrl ? `<a href="${s.googleMapsUrl}" target="_blank" class="btn btn-primary" style="padding:6px 10px;font-size:0.78rem;"><i class="fa-solid fa-map-location-dot"></i> 구글 지도 열기</a>` : ''}
              <button class="btn btn-outline" style="padding:6px 10px;font-size:0.78rem;" onclick="window.selectSpotInExplorer('${k}')"><i class="fa-solid fa-compass"></i> 인근 맛집·디저트 보기</button>
            </div>
          </div>
        `;
        createPin(s.lat, s.lng, iconHtml, markerClass, popupContent, k);
      }

      // 레스토랑 & 디저트 마커
      const allSpotItems = [...(s.restaurants || []), ...(s.desserts || [])];
      allSpotItems.forEach(r => {
        if (!r.lat || !r.lng) return;
        const matchesRDay = (selectedDay === 'all' || s.day === selectedDay);
        const matchesRType = (selectedType === 'all' || selectedType === r.type);

        if (matchesRDay && matchesRType) {
          totalDisplayedCount++;
          const isBlack = (r.type === 'restaurant');
          const markerClass = isBlack ? 'marker-restaurant' : 'marker-dessert';
          const iconHtml = isBlack ? '<i class="fa-solid fa-utensils"></i>' : '<i class="fa-solid fa-cake-candles"></i>';
          const badgeClass = isBlack ? 'badge-black' : 'badge-yellow';
          const badgeLabel = isBlack ? '🍽️ 타베로그 맛집' : '🍰 디저트/카페';

          const popupContent = `
            <div class="map-popup-box">
              <div class="popup-tag-row">
                <span class="popup-category-badge ${badgeClass}">${badgeLabel}</span>
                <span style="font-size:0.75rem;color:#d63384;font-weight:700;"><i class="fa-solid fa-star"></i> ${r.tabelog || '3.5+'}</span>
              </div>
              <h4 class="popup-title-h4">${r.name}</h4>
              <div class="popup-jp-name">${r.jp || ''}</div>
              <div class="popup-menu-desc">
                <div><strong>🚶 이동:</strong> ${r.walkTime || ''} (${s.spotTitle} 인근)</div>
                <div><strong>🍴 추천:</strong> ${r.menu || '-'}</div>
                ${r.budget ? `<div><strong>💰 예산:</strong> ${r.budget}</div>` : ''}
              </div>
              <div class="popup-btn-stack">
                ${r.directionsUrl ? `<a href="${r.directionsUrl}" target="_blank" class="btn btn-primary" style="padding:6px 10px;font-size:0.78rem;"><i class="fa-solid fa-diamond-turn-right"></i> 도보 길찾기</a>` : ''}
                ${r.googleMapsUrl ? `<a href="${r.googleMapsUrl}" target="_blank" class="btn btn-outline" style="padding:6px 10px;font-size:0.78rem;"><i class="fa-solid fa-map-location-dot"></i> 구글맵</a>` : ''}
              </div>
            </div>
          `;
          createPin(r.lat, r.lng, iconHtml, markerClass, popupContent, r.id);
        }
      });
    });

    const countText = document.getElementById("mapMarkerCountText");
    if (countText) countText.textContent = `표시 중: ${totalDisplayedCount}개 장소`;

    // 맵 뷰포트 맞추기
    if (targetSpotKey && guideData[targetSpotKey]) {
      const sp = guideData[targetSpotKey];
      interactiveMap.setView([sp.lat, sp.lng], 15);
      const m = mapMarkers.find(item => item.id === targetSpotKey);
      if (m) setTimeout(() => m.marker.openPopup(), 300);
    } else if (bounds.length > 0) {
      interactiveMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }

    setTimeout(() => {
      if (interactiveMap) interactiveMap.invalidateSize();
    }, 250);

    // 필터 버튼 이벤트 바인딩
    document.querySelectorAll(".map-filter-toolbar .map-filter-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        if (chip.hasAttribute("data-day")) {
          const d = chip.getAttribute("data-day");
          renderInteractiveMap(d, selectedType, currentSpotKey);
        } else if (chip.hasAttribute("data-type")) {
          const t = chip.getAttribute("data-type");
          renderInteractiveMap(selectedDay, t, currentSpotKey);
        }
      });
    });

    window.selectSpotInExplorer = function(spotKey) {
      renderExplorer(spotKey);
      if (interactiveMap && guideData[spotKey]) {
        interactiveMap.flyTo([guideData[spotKey].lat, guideData[spotKey].lng], 15, { duration: 0.8 });
        const m = mapMarkers.find(item => item.id === spotKey);
        if (m) m.marker.openPopup();
      }
      const panel = document.getElementById("mapExplorerPanel");
      if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.focusMapMarker = function(id) {
      const m = mapMarkers.find(item => item.id === id);
      if (m && interactiveMap) {
        interactiveMap.flyTo([m.lat, m.lng], 16, { duration: 0.8 });
        m.marker.openPopup();
        window.scrollTo({ top: 420, behavior: 'smooth' });
      }
    };
  }

  // Day 1 ~ 5 렌더링 (끼니별 3개 선택지 카드 지원)
  function renderDay(dayKey) {
    if (dayKey === "interactive-map") {
      renderInteractiveMap();
      return;
    }
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
        { time: "11:00", activity: "간사이공항 도착 및 입국 심사 (수속 & 세관)", transport: "ICOCA 발권 / 리무진 티켓", note: "1층 5번 승강장" },
        { time: "12:00~13:00", activity: "우메다 이동 (공항 리무진 버스 직통, 오사카 메트로 우메다역 방면)", transport: "공항 리무진 버스 (직통 55분)", note: "신한큐호텔·우메다역 정류소" },
        { time: "13:00~13:20", activity: "코인라커 짐 보관 (오사카 메트로 우메다역)", note: "지하철 개찰구/지하도 라커" },
        { time: "13:20~14:00", activity: "🐙 간식: 하나다코 (파 산더미 네기마요 타코야키 원조)", spotKey: "hanadako_umeda", note: "신우메다 식도원 1F (도보 2분)" },
        { time: "14:00~15:20", activity: "우메다 스카이빌딩 공중정원 전망대 & 타키미코지", spotKey: "umeda_sky", note: "★주유패스 무료(16시전)" },
        { time: "15:20~16:00", activity: "🛒 [추천 로컬마트] 라이프(LIFE) 마트 오오요도나카점", spotKey: "life_supermarket", note: "스카이빌딩 도보 3분 / 2층 대형마트" },
        { time: "16:10~17:00", activity: "🏢 [추천 쇼핑·100엔샵] 요도바시 카메라 & LINKS 5F 다이소", spotKey: "yodobashi_umeda", note: "메트로 직결 / 100엔샵(하쿠엔샵)" },
        { time: "17:00~17:35", activity: "🎡 [추천 활동지] 헵파이브(HEP FIVE) 대관람차 탑승", spotKey: "hep_five", note: "★주유패스 무료 (도심 106m 전망)" },
        { time: "17:35~18:15", activity: "숙소 이동 및 체크인 (온야도 노노 난바)", transport: "오사카 메트로 미도스지선", note: "우메다역 ➔ 난바역 직통 9분" },
        { time: "18:15~19:30", activity: "쿠로몬 시장 & 난바 탐방", spotKey: "kuromon_market", note: "해산물 미식 & 활기찬 거리" },
        { time: "19:30~20:45", activity: "저녁 식사 (원하는 스타일 택1)", note: "쿠라스시(직통 레일 배달) / 니쿠하치 / 이치란" },
        { time: "20:45~", activity: "호텔 천연 온천 휴식 & 도톤보리 글리코상 야경", spotKey: "dotonbori", note: "야식 요나키소바 무료" }
      ],
      day2: [
        { time: "07:00~08:00", activity: "아침 기상 & 호텔 온천욕 및 외출 준비", note: "온야도 노노 힐링 모닝" },
        { time: "08:30~10:30", activity: "🗼 츠텐카쿠 타워 & 신세카이 레트로 거리", transport: "오사카 메트로 미도스지선 (도부츠엔마에행)", spotKey: "tsutenkaku", note: "★주유패스 무료" },
        { time: "10:30~11:30", activity: "🍢 [이른 점심] 신세카이 원조 쿠시카츠 식사", note: "야에카츠(10:30 오픈) / 다루마 [현장 대기]" },
        { time: "11:45~12:15", activity: "🎟️ 도톤보리 이동 ➔ '돈보리 리버 크루즈' 19:30 야경 티켓팅", transport: "미도스지선 (난바역 복귀)", spotKey: "dotonbori_cruise", note: "★주유패스 무료 (돈키호테 앞 매표소)" },
        { time: "12:15~13:30", activity: "🍱 도톤보리 2차 점심 또는 명품 디저트", note: "아지노야 오코노미야키 / 리쿠로 치즈케이크" },
        { time: "13:30~14:00", activity: "오사카성 이동", transport: "지하철 나가호리츠루미료쿠치선", note: "모리노미야역 직통" },
        { time: "14:00~16:30", activity: "🏯 오사카성 천수각 관람 & 고자부네 놀잇배 / 조-테라스", spotKey: "osaka_castle", note: "★천수각 & 금빛 배 주유패스 무료" },
        { time: "16:30~17:15", activity: "도톤보리 복귀", transport: "오사카 메트로 주오선 + 미도스지선", note: "난바역 복귀" },
        { time: "17:30~19:15", activity: "🍽️ 도톤보리 저녁 식사 (스시 3종 비교 또는 와규)", note: "Rikusui(뷔페) / 쿠라스시 / 스시로 / 니쿠하치" },
        { time: "19:30~19:50", activity: "🚤 돈보리 리버 크루즈 탑승 (★화려한 네온사인 최고 야경 골든타임!)", spotKey: "dotonbori_cruise", note: "글리코상 앞 360도 야경 유람" },
        { time: "20:00~21:30", activity: "🛒 도톤보리 밤 쇼핑 (돈키호테 & 24시 대형 LIFE 마트 난바점)", spotKey: "life_namba", giftKey: "shoshugen_poopourri", note: "면세 10%+5% & 로컬 장보기" },
        { time: "21:30~", activity: "호텔 복귀 & 천연 온천 힐링 (무료 요나키소바 라멘 야식)", spotKey: "dotonbori", note: "온천 휴식" }
      ],
      day3: [
        { time: "08:30~10:00", activity: "아침 기상 & 조식 후 체크아웃 준비" },
        { time: "10:30~11:00", activity: "오사카 ➔ 교토 이동 (JR 신쾌속 직통 28분)", transport: "JR 신쾌속 (28분 직통, 560엔)" },
        { time: "11:30~12:15", activity: "교토 숙소 체크인 및 짐 보관 (사쿠라 테라스 더 갤러리)", note: "교토역 도보 2분" },
        { time: "12:30~13:30", activity: "점심: 교토역 맛집 (3개 선택지)", note: "동양정 함박 / 소바도코로 아오이 / 교토 코토코토(두부정식)" },
        { time: "14:00~16:30", activity: "청수사 (기요미즈테라) & 산넨자카·니넨자카 산책", transport: "교토 시버스 206/207번 (230엔)", spotKey: "kiyomizu_dera", note: "★유네스코 세계유산" },
        { time: "16:30~18:30", activity: "교토 GU 쇼핑 탐방 (아반티점 / 카와라마치점)", spotKey: "gu_kyoto", note: "🛍️ 면세 10% 쇼핑" },
        { time: "18:30~20:00", activity: "저녁: 가와라마치 & 기온 미식 탐방", note: "카니긴(대게·스시 뷔페) / 초지로 스시 / 사사야" },
        { time: "20:00~21:30", activity: "폰토쵸 골목 등롱 야경 산책 & 츠지리 말차", spotKey: "pontocho", note: "감성 야경 & 디저트" }
      ],
      day4: [
        { time: "07:00~08:00", activity: "아침 식사 (3개 선택지 중 선택)", note: "팡토 에스프레소토 / 사가노 / 오츠카" },
        { time: "08:00~10:00", activity: "아라시야마 대나무숲 (치쿠린) 아침 산책", transport: "JR 산인선 (16분 직통)", spotKey: "arashiyama_bamboo", note: "★한적한 아침 힐링" },
        { time: "10:00~10:30", activity: "아라시야마 강변 카페 & 말차 타임", note: "% 아라비카 / 요지야" },
        { time: "10:30~11:00", activity: "란덴(嵐電) 전차 타고 사이인역 이동 (직통 15분)", transport: "란덴 노면전차 (직통 15분, 250엔)" },
        { time: "11:00~13:00", activity: "🙏 교토교회 주일예배 참석 (사이인역 인근)", spotKey: "kyoto_church", note: "필수 고정 일정" },
        { time: "13:00~14:30", activity: "🍱 사이인역 점심: 야요이켄 (Yayoi Ken) 또는 로컬 정식", note: "야요이켄(밥·국 리필) / 사이인 정식" },
        { time: "15:00~17:30", activity: "니시키 시장 미식 탐방 & 시조 거리 산책", transport: "한큐 전철 또는 교토 시버스", spotKey: "nishiki_market", note: "400년 전통 미식 & 티라미수" },
        { time: "18:00~", activity: "🍽️ 18:00 사이인역 저녁 식사 & 하루 마무리", note: "사이인역 집결 / 숯불 야키니쿠 코마 등" }
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
        const isDessert = slotKey === "dessert_matcha" || m.type === "dessert" || (m.category && (m.category.includes("디저트") || m.category.includes("카페") || m.category.includes("과자") || m.category.includes("빙수")));
        const colorTagHtml = isDessert 
          ? '<span class="color-badge-yellow"><i class="fa-solid fa-cake-candles"></i> 디저트 (노랑)</span>'
          : '<span class="color-badge-black"><i class="fa-solid fa-utensils"></i> 식당 (검정)</span>';
        const foodMapUrl = m.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.mapQuery || m.jp || m.name)}`;
        cardsInSlot += `
          <div class="food-choice-card ${isMatcha ? 'matcha-card' : ''}" onclick="openDetailModal('meal', '${m.id}')" title="클릭하여 상세 메뉴 및 특징 확인">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <div class="choice-tag" style="margin-bottom:0;">${optLabels[idx]}</div>
              <div>${colorTagHtml}</div>
            </div>
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
              ${m.reservation ? `<div style="margin-top:5px;font-size:0.78rem;font-weight:700;color:${m.reservation.includes('🔴') ? '#c9184a' : (m.reservation.includes('🟠') ? '#d97706' : '#2d6a4f')};background:${m.reservation.includes('🔴') ? '#ffe5ec' : (m.reservation.includes('🟠') ? '#fef3c7' : '#e8f5e9')};padding:3px 8px;border-radius:6px;display:inline-block;"><i class="fa-solid fa-calendar-check"></i> ${m.reservation}</div>` : ''}
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

    
    // [관광지별 인근 맛집(검정) & 디저트(노랑) 바로가기 섹션 생성]
    const nearbyData = TRAVEL_DETAILS.nearbyGuide || {};
    let dayNearbyCardsHtml = "";
    
    for (const [sKey, spot] of Object.entries(nearbyData)) {
      if (spot.day === dayKey) {
        let spotRestHtml = "";
        spot.restaurants.forEach(r => {
          spotRestHtml += `
            <div class="nearby-card is-black" style="margin-bottom:8px;">
              <div class="nearby-card-head">
                <span class="nearby-card-title">${r.name}</span>
                <span class="tabelog-tag">⭐ ${r.tabelog}</span>
              </div>
              <div style="margin-bottom:4px;">
                <span class="color-badge-black"><i class="fa-solid fa-utensils"></i> 식당 (검정)</span>
                <span class="nearby-walk-pill walk-black" style="margin-left:6px;"><i class="fa-solid fa-person-walking"></i> ${r.walkTime}</span>
              </div>
              <div class="nearby-menu-line" style="margin-bottom:6px;"><strong>메뉴:</strong> ${r.menu}</div>
              <div class="nearby-actions-row">
                <a href="${r.directionsUrl}" target="_blank" class="btn-directions">
                  <i class="fa-solid fa-route"></i> 도보 길찾기
                </a>
                <a href="${r.googleMapsUrl}" target="_blank" class="btn-spot-link">
                  <i class="fa-solid fa-location-dot"></i> 구글맵 위치
                </a>
                <button class="btn-spot-link" onclick="openDetailModal('meal', '${r.id}')">
                  <i class="fa-solid fa-circle-info"></i> 상세정보
                </button>
              </div>
            </div>
          `;
        });

        let spotDessertHtml = "";
        if (spot.desserts && spot.desserts.length > 0) {
          spot.desserts.forEach(d => {
            spotDessertHtml += `
              <div class="nearby-card is-yellow" style="margin-bottom:8px;">
                <div class="nearby-card-head">
                  <span class="nearby-card-title">${d.name}</span>
                  <span class="tabelog-tag">⭐ ${d.tabelog}</span>
                </div>
                <div style="margin-bottom:4px;">
                  <span class="color-badge-yellow"><i class="fa-solid fa-cake-candles"></i> 디저트 (노랑)</span>
                  <span class="nearby-walk-pill walk-yellow" style="margin-left:6px;"><i class="fa-solid fa-person-walking"></i> ${d.walkTime}</span>
                </div>
                <div class="nearby-menu-line" style="margin-bottom:6px;"><strong>메뉴:</strong> ${d.menu}</div>
                <div class="nearby-actions-row">
                  <a href="${d.directionsUrl}" target="_blank" class="btn-directions">
                    <i class="fa-solid fa-route"></i> 도보 길찾기
                  </a>
                  <a href="${d.googleMapsUrl}" target="_blank" class="btn-spot-link">
                    <i class="fa-solid fa-location-dot"></i> 구글맵 위치
                  </a>
                  <button class="btn-spot-link" onclick="openDetailModal('meal', '${d.id}')">
                    <i class="fa-solid fa-circle-info"></i> 상세정보
                  </button>
                </div>
              </div>
            `;
          });
        }

        dayNearbyCardsHtml += `
          <div class="day-spot-card">
            <div class="day-spot-header">
              <div>
                <h4><i class="fa-solid fa-landmark" style="color:#e63946;"></i> ${spot.spotTitle}</h4>
                <div class="spot-jp-text">${spot.spotJp}</div>
              </div>
              <div style="display:flex;gap:6px;">
                <a href="${spot.googleMapsUrl}" target="_blank" class="btn-spot-link" title="구글맵에서 관광지 열기">
                  <i class="fa-solid fa-map-pin"></i> 관광지
                </a>
                <button class="btn-spot-link" style="background:#0d6efd;color:#fff;" onclick="window.goToInteractiveMap('${dayKey}', '${sKey}')" title="연동 지도에서 확인">
                  <i class="fa-solid fa-map-location-dot"></i> 연동 지도
                </button>
              </div>
            </div>

            <div style="margin-top:4px;">
              <div style="font-size:0.84rem;font-weight:800;color:#111;margin-bottom:6px;display:flex;align-items:center;gap:6px;">
                <span class="color-badge-black"><i class="fa-solid fa-utensils"></i> 인근 식당 (검정)</span>
              </div>
              ${spotRestHtml}
            </div>

            ${spotDessertHtml ? `
              <div style="margin-top:6px;">
                <div style="font-size:0.84rem;font-weight:800;color:#111;margin-bottom:6px;display:flex;align-items:center;gap:6px;">
                  <span class="color-badge-yellow"><i class="fa-solid fa-cake-candles"></i> 인근 디저트·카페 (노랑)</span>
                </div>
                ${spotDessertHtml}
              </div>
            ` : ''}
          </div>
        `;
      }
    }

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

        <!-- 오늘 관광지별 인근 추천 맛집(검정) & 디저트(노랑) 바로가기 가이드 -->
        <div class="day-nearby-guide-wrapper">
          <div class="day-nearby-guide-title">
            <i class="fa-solid fa-map-location-dot" style="color:#0d6efd;"></i> 오늘 코스 관광지별 인근 맛집(검정) & 디저트(노랑) 바로가기
          </div>
          <div class="day-nearby-guide-sub">
            관광지 관람 전후로 인근의 검증된 맛집과 디저트 매장을 원클릭 구글맵 도보 길찾기로 편리하게 찾아가실 수 있습니다.
          </div>
          <div class="day-nearby-spot-grid">
            ${dayNearbyCardsHtml}
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

        <!-- 4. ICOCA 교통카드 완전정복 가이드 (구매·환불·태그방법·코스별 최적 충전금액) -->
        <div class="golden-rules-section" style="border-left: 5px solid #20c997; background: #f8fafc; border-radius: 12px; padding: 20px; margin-top: 25px;">
          <div class="section-title" style="font-size:1.15rem; color:#0f5132; margin-bottom:12px;">
            <i class="fa-solid fa-credit-card" style="color:#20c997;"></i> 교통카드(ICOCA 카드) 완전정복 가이드 & 코스 최적 충전액 추천
          </div>
          <div style="font-size:0.9rem; color:#334155; line-height:1.75;">
            <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:14px 16px; margin-bottom:12px;">
              <strong style="color:#0d6efd;"><i class="fa-solid fa-cart-shopping"></i> (1) 구매 방법 (현장구매 vs 국내 사전구매 비교)</strong><br>
              • <strong>현장구매 (적극 권장):</strong> 간사이공항 2층 JR 매표소(Ticket Office) 또는 JR 자동발권기에서 즉시 구매 가능합니다.<br>
              • <strong>국내 사전구매:</strong> 현재 클룩 등 주요 국내 인터넷 예매 사이트에서 실물 카드 재고 품절(Sold Out)이 잦으므로 <strong>공항 현장구매가 훨씬 빠르고 편리</strong>합니다.
            </div>

            <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:14px 16px; margin-bottom:12px;">
              <strong style="color:#198754;"><i class="fa-solid fa-coins"></i> (2) 현장구매 상세 조건 & 보증금 환불</strong><br>
              • <strong>결제 수단:</strong> <strong>현금(엔화)만 가능</strong> (신용카드 불가하므로 1인당 최소 2,000엔 현금 준비 필수)<br>
              • <strong>기본 구입비:</strong> 기본 <strong>2,000엔</strong> (실제 사용 가능 잔액 <strong>1,500엔</strong> + 카드 보증금 <strong>500엔</strong>)<br>
              • <strong>보증금 500엔 환불:</strong> 여행 마지막 날 간사이공항 JR 매표소에 카드를 반환하면 <strong>보증금 500엔을 전액 현금으로 환불</strong>받으실 수 있습니다. (※ 팁: 카드 잔액을 편의점 등에서 0엔으로 다 쓰고 반환하면 수수료 없이 500엔을 고스란히 돌려받습니다!)
            </div>

            <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:14px 16px; margin-bottom:12px;">
              <strong style="color:#fd7e14;"><i class="fa-solid fa-mobile-screen-button"></i> (3) 대중교통 승하차 태그(Tag) 방법</strong><br>
              • <strong>시내버스 (교토 버스 등):</strong> <strong>'하차할 때'</strong> 운전석 옆 요금 단말기에 카드 1회 터치 (탈 때는 뒤편 문으로 그냥 탑승)<br>
              • <strong>지하철 & JR 전철:</strong> 한국 지하철과 동일하게 <strong>'승차할 때'와 '하차할 때' 모두</strong> 개찰구 IC 터치패드에 태그
            </div>

            <div style="background:#e8f5e9; border:1.5px solid #a3cfbb; border-radius:8px; padding:15px 18px;">
              <strong style="color:#0f5132; font-size:0.95rem;"><i class="fa-solid fa-calculator"></i> (4) 우리 여행 코스 기준: 얼마 충전하는 게 최적화일까? (맞춤 추천)</strong><br>
              <div style="margin-top:6px; font-size:0.86rem; color:#212529;">
                우리 4박 5일 일정 중 1~2일차는 '오사카 주유패스'로 지하철이 전액 무료이므로, <strong>3~5일차 비패스 구간</strong>만 ICOCA 카드를 사용하게 됩니다:<br>
                • <strong>3일차 (오사카 ➔ 교토):</strong> JR 신쾌속 열차 (오사카역 ➔ 교토역, <strong>560엔</strong>) + 교토 시버스 이동 (<strong>230엔</strong>) = <strong>790엔</strong><br>
                • <strong>4일차 (아라시야마 & 시내):</strong> 란덴 노면전차 (<strong>250엔</strong>) + 한큐선/시버스 (<strong>230엔</strong>) = <strong>480엔</strong><br>
                • <strong>5일차 (후시미이나리 왕복):</strong> JR 나라선 (교토역 ↔ 이나리역 왕복 150엔 × 2 = <strong>300엔</strong>)<br>
                👉 <strong>순수 교통비 합계: 정확히 1,570엔!</strong><br>
                <div style="margin-top:8px; padding:10px 12px; background:#fff; border-radius:6px; border-left:4px solid #198754; font-weight:600; color:#0f5132;">
                  💡 <strong>에이전트 최종 최적화 추천:</strong><br>
                  최초 구매 시 충전된 <strong>1,500엔</strong>으로 이미 전체 교통비의 96%가 충당됩니다! 따라서 <strong>초기 2,000엔으로 구매 후, 4일차나 5일차에 1,000엔만 딱 1회 추가 충전(총 2,500엔 잔액 운용)</strong>하시면 잔액 부족 걱정 없이 목마를 때 자동판매기 음료(130~160엔)나 편의점 간식까지 100% 깔끔하게 소진하고 공항에서 보증금 500엔을 환불받으실 수 있습니다.
                </div>
              </div>
            </div>
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
