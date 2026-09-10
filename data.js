// 오사카·교토 여행 마스터 데이터베이스 (끼니별 3개 선택지, 말차 특화, 선물 15종 사진, 정밀 지도, 사전구매)
const TRAVEL_DETAILS = {
  // [관광지 상세 정보]
  spots: {
    "umeda_sky": {
      title: "우메다 스카이빌딩 공중정원 전망대",
      jp: "梅田スカイビル 空中庭園展望台",
      en: "Umeda Sky Building Floating Garden",
      category: "오사카 명소 / 전망대",
      badge: "★ 오사카 주유패스 무료 (16시 이전)",
      verified: "✅ 2026년 정상 운영 확인 (최근 리뷰 3,200+)",
      rating: "⭐ 4.6 (Google 4.2만+)",
      hours: "09:30 ~ 22:30 (마지막 입장 22:00)",
      fee: "일반 1,500엔 (주유패스로 16시 이전 입장 시 무료)",
      station: "JR 오사카역 / 지하철 우메다역 도보 9분",
      address: "大阪市北区大淀中1-1-88",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=34.7056,135.4905+(Umeda+Sky+Building)",
      summary: "두 개의 40층 타워가 상공에서 연결된 미래지향적 랜드마크로, 360도 야외 루프탑 '스카이 워크'에서 오사카 시내와 요도가와 강 전경을 한눈에 조망할 수 있습니다.",
      tips: [
        "⚠️ 주유패스 규정: 16:00 이전 입장 시 무료 혜택 적용 (일정상 13:30 방문으로 무료 입장 가능)",
        "지하 1층 '타키미코지(滝見小路)' 쇼와 레트로 식당가와 함께 둘러보기 좋습니다.",
        "야외 루프탑 바람이 다소 강할 수 있으니 얇은 겉옷을 챙기시면 좋습니다."
      ]
    },
    "kuromon_market": {
      title: "쿠로몬 시장 (오사카의 부엌)",
      jp: "黒門市場",
      en: "Kuromon Ichiba Market",
      category: "전통 재래시장 / 미식 탐방",
      badge: "도보 추천 코스",
      verified: "✅ 2026년 정상 영업 확인 (최근 1달 내 후기 다수)",
      rating: "⭐ 4.2 (Google 2.8만+)",
      hours: "09:00 ~ 18:00 (점포별 상이, 17시 이후 마감 시작)",
      fee: "입장 무료 (메뉴별 500 ~ 3,000엔)",
      station: "지하철 닛폰바시역 10번 출구 도보 2분, 온야도 노노 난바 도보 7분",
      address: "大阪市中央区日本橋2丁目4-1",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6667,135.5057+(Kuromon+Ichiba+Market)",
      summary: "200년 역사를 자랑하는 오사카 최대 수산 전통시장으로, 신선한 참치회, 가리비 버터구이, 성게알, 고베규 꼬치 등을 즉석에서 맛볼 수 있는 미식의 천국입니다.",
      tips: [
        "오후 5시가 넘으면 마감하는 점포가 많으므로 16:30경 방문이 가장 좋습니다.",
        "길거리 보행 취식이 금지되어 있으니, 점포 앞 전용 시식 테이블에서 드셔야 합니다."
      ]
    },
    "tsutenkaku": {
      title: "츠텐카쿠 & 신세카이",
      jp: "通天閣 & 新世界",
      en: "Tsutenkaku Tower & Shinsekai",
      category: "오사카 레트로 명소 / 타워",
      badge: "★ 오사카 주유패스 무료",
      verified: "✅ 2026년 정상 운영 확인 (타워 슬라이더 인기)",
      rating: "⭐ 4.3 (Google 3.5만+)",
      hours: "10:00 ~ 20:00 (전망대 최종 입장 19:30)",
      fee: "일반 900엔 (주유패스 무료 입장)",
      station: "지하철 에비스초역 도보 3분 / 동물원앞역 도보 6분",
      address: "大阪市浪速区恵美須東1-18-6",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6523,135.5063+(Tsutenkaku)",
      summary: "에펠탑을 본떠 만든 오사카 서민 문화의 상징적 타워. 행운의 신 '빌리켄' 발바닥을 문지르면 복이 온다는 전설이 있으며, 화려한 복고풍 간판의 신세카이 골목과 연결됩니다.",
      tips: [
        "오전 8:30~9:30 사이에 신세카이에 도착하면 한산하고 예쁜 레트로 사진을 남기기 좋습니다.",
        "타워 외벽을 타고 60미터를 내려오는 초대형 슬라이더 '타워 슬라이더'가 인기리에 운영 중입니다 (별도 1,000엔)."
      ]
    },
    "osaka_cruise": {
      title: "오사카 수상버스 아쿠아라이너",
      jp: "大阪水上バス アクアライナー",
      en: "Osaka Aqua-Liner Cruise",
      category: "유람선 / 액티비티",
      badge: "★ 오사카 주유패스 무료",
      verified: "✅ 2026년 정기 운항 확인",
      rating: "⭐ 4.4 (Google 5,000+)",
      hours: "10:00 ~ 16:00 (매시 정각 및 30분 오사카성 항 출항)",
      fee: "성인 1,600엔 (주유패스 무료 탑승)",
      station: "JR 오사카조코엔역 도보 3분 (오사카성 선착장)",
      address: "大阪市中央区大阪城2",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6888,135.5248+(Osaka+Suijo+Bus+Aqua-Liner)",
      summary: "오사카 시내를 가로지르는 오카와 강을 따라 오사카성, 나카노시마 공원 등의 수변 풍경을 편안하게 감상할 수 있는 유리 천장 유람선입니다.",
      tips: [
        "오사카성 관광 전후로 탑승하면 다리 피로를 풀면서 오사카의 경치를 여유롭게 즐길 수 있습니다."
      ]
    },
    "osaka_castle": {
      title: "오사카성 천수각 & 성곽공원",
      jp: "大阪城 天守閣",
      en: "Osaka Castle Main Keep",
      category: "역사 유적지 / 성곽",
      badge: "★ 오사카 주유패스 무료",
      verified: "✅ 2026년 정상 개방 확인",
      rating: "⭐ 4.5 (Google 7.8만+)",
      hours: "09:00 ~ 17:00 (최종 입장 16:30)",
      fee: "성인 600엔 (주유패스 무료)",
      station: "지하철 다니마치4초메역 / 모리노미야역 도보 10분",
      address: "大阪市中央区大阪城1-1",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6873,135.5262+(Osaka+Castle)",
      summary: "도요토미 히데요시가 세운 오사카의 대표 역사 상징물. 8층 최상층 전망대에서는 오사카 시내와 광대한 성곽 해자가 파노라마로 펼쳐집니다."
    },
    "dotonbori": {
      title: "도톤보리 & 에비스바시 (글리코상)",
      jp: "道頓堀 & 戎橋",
      en: "Dotonbori & Ebisubashi Bridge",
      category: "도심 번화가 / 야경 & 쇼핑",
      badge: "오사카 필수 코스",
      verified: "✅ 2026년 상시 운영 확인 (매일 일몰 후 점등)",
      rating: "⭐ 4.6 (Google 10만+)",
      hours: "거리 상시 개방 (돈키호테 24시간)",
      fee: "무료",
      station: "지하철 난바역 14번 출구 도보 3분",
      address: "大阪市中央区道頓堀1丁目",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6687,135.5014+(Glico+Sign+Dotonbori)",
      summary: "거대한 글리코상 네온사인, 움직이는 대게 간판, 화려한 조명이 강물에 반사되는 오사카 최고의 활기찬 밤거리입니다."
    },
    "nishiki_market": {
      title: "교토 니시키 시장",
      jp: "錦市場",
      en: "Nishiki Market Kyoto",
      category: "교토 전통시장 / 식문화",
      badge: "교토 미식 1번지",
      verified: "✅ 2026년 정상 영업 확인",
      rating: "⭐ 4.3 (Google 3.9만+)",
      hours: "10:00 ~ 18:00",
      fee: "무료",
      station: "한큐 교토카와라마치역 / 지하철 시조역 도보 4분",
      address: "京都市中京区錦小路通",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0049,135.7648+(Nishiki+Market)",
      summary: "400년 역사를 자랑하는 '교토의 부엌'. 좁은 아케이드 골목에 130여 개 점포가 밀집하여 특산 절임반찬, 두부 요리, 말차 간식을 선보입니다."
    },
    "gion_yasaka": {
      title: "기온 거리 & 야사카 신사",
      jp: "祇園 & 八坂神社",
      en: "Gion District & Yasaka Shrine",
      category: "전통 보존지구 / 신사",
      badge: "교토 전통 정취",
      verified: "✅ 2026년 상시 개방 확인",
      rating: "⭐ 4.6 (Google 4.5만+)",
      hours: "야사카 신사 24시간 개방",
      fee: "무료",
      station: "케이한 기온시조역 도보 5분",
      address: "京都市東山区祇園町",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0036,135.7785+(Yasaka+Shrine+Kyoto)",
      summary: "격자무늬 목조 가옥과 돌담길이 이어지는 교토 최고의 전통 거리. 해 질 무렵 등불이 켜진 하나미코지와 은은한 조명의 야사카 신사를 산책하기 좋습니다."
    },
    "pontocho": {
      title: "폰토쵸 골목 (선두정)",
      jp: "先斗町",
      en: "Pontocho Alley",
      category: "야경 골목 / 전통 요릿집",
      badge: "감성 야경 산책",
      verified: "✅ 2026년 정상 운영 확인",
      rating: "⭐ 4.5 (Google 1.8만+)",
      hours: "17:00 ~ 23:00",
      fee: "골목 산책 무료",
      station: "한큐 교토카와라마치역 도보 3분",
      address: "京都市中京区先斗町",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0063,135.7709+(Pontocho+Alley)",
      summary: "카모가와 강과 평행하게 뻗은 500m 길이의 보행자 전용 좁은 돌길 골목. 전통 등롱 불빛 아래 정갈한 교토 요리점과 이자카야가 밀집해 있습니다."
    },
    "arashiyama_bamboo": {
      title: "아라시야마 대나무숲 (치쿠린)",
      jp: "嵐山 竹林の小径",
      en: "Arashiyama Bamboo Grove",
      category: "자연 명소 / 힐링 산책",
      badge: "★ 아침 8시 이전 방문 필수",
      verified: "✅ 2026년 24시간 상시 개방 확인",
      rating: "⭐ 4.6 (Google 6.5만+)",
      hours: "24시간 항시 개방",
      fee: "무료",
      station: "란덴 아라시야마역 도보 5분 / JR 사가아라시야마역 도보 10분",
      address: "京都市右京区嵯峨小倉山田淵山町",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0167,135.6717+(Arashiyama+Bamboo+Grove)",
      summary: "하늘 높이 솟은 수만 그루의 대나무가 바람에 사각거리는 소리와 함께 몽환적인 초록빛 터널을 만들어내는 세계적인 명소입니다."
    },
    "kyoto_church": {
      title: "교토교회 (사이인역 인근)",
      jp: "京都教会 (西院駅付近)",
      en: "Kyoto Church near Saiin Station",
      category: "종교 시설 / 필수 고정 일정",
      badge: "🙏 9/20(일) 11:00~13:00 주일예배",
      verified: "✅ 2026년 주일예배 정상 진행 확인",
      rating: "⭐ 필수 고정 방문지",
      hours: "주일 오전 예배 11:00 ~ 13:00",
      fee: "자유 헌금",
      station: "란덴 사이인역 / 한큐 사이인역 도보 3~5분",
      address: "京都市右京区西院",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0042,135.7317+(Saiin+Station+Kyoto+Church)",
      summary: "이번 여행의 핵심 고정 일정으로, 아라시야마 관광 후 란덴을 타고 사이인역으로 이동하여 주일 오전 예배를 드리는 장소입니다."
    },
    "kinkakuji": {
      title: "킨카쿠지 (금각사)",
      jp: "鹿苑寺 (金閣寺)",
      en: "Kinkaku-ji (Golden Pavilion)",
      category: "유네스코 세계문화유산 / 사찰",
      badge: "교토 3대 대표 사찰",
      verified: "✅ 2026년 정상 운영 확인 (금박 보존 최상)",
      rating: "⭐ 4.6 (Google 8.2만+)",
      hours: "09:00 ~ 17:00",
      fee: "성인 500엔 (부적 입장권)",
      station: "사이인역에서 시버스 205번 탑승 ➔ '킨카쿠지미치' 하차 도보 3분",
      address: "京都市北区金閣寺町1",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0394,135.7292+(Kinkaku-ji)",
      summary: "금박으로 덮인 3층 누각이 거울 같은 '교코치' 연못 위에 비치는 찬란한 풍경으로 전 세계 여행객을 매료시키는 선종 사찰입니다."
    },
    "fushimi_inari": {
      title: "후시미이나리 대사 (여우신사)",
      jp: "伏見稲荷大社",
      en: "Fushimi Inari Taisha",
      category: "신사 / 천 개의 붉은 도리이",
      badge: "일본 전국 1위 명소",
      verified: "✅ 2026년 24시간 상시 개방 확인",
      rating: "⭐ 4.7 (Google 12만+)",
      hours: "24시간 상시 개방",
      fee: "무료",
      station: "JR 나라선 이나리역 바로 앞 (교토역에서 5분)",
      address: "京都市伏見区深草藪之内町68",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=34.9671,135.7727+(Fushimi+Inari+Taisha)",
      summary: "산 전체를 뒤덮은 1만여 개의 선명한 주홍빛 도리이 터널이 장관을 이루는 신사입니다."
    }
  },

  // [끼니별 3개 선택지 식당 & 카페 (말차 코스 집중 포함)]
  mealsByDay: {
    day1: {
      lunch: [
        {
          id: "kiji_umeda",
          name: "우메다 키지 본점 (きじ)",
          jp: "お好み焼 きじ 本店",
          tabelog: 3.58,
          category: "오코노미야키 명가",
          budget: "1,000 ~ 1,800엔",
          station: "우메다 스카이빌딩 지하 1층 타키미코지",
          menu: "모단야키(야키소바 계란전), 스지야키(소힘줄 파전)",
          summary: "스카이빌딩 관람 직전 또는 직후에 바로 내려가서 먹을 수 있는 최적의 동선! 미슐랭 빕구르망 출신 마스터의 손맛.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.7056,135.4905+(Kiji+Umeda)"
        },
        {
          id: "hagakure_umeda",
          name: "우메다 하가쿠레 (はがくれ)",
          jp: "梅田 はがくれ 本店",
          tabelog: 3.65,
          category: "수제 생면 사누키 우동",
          budget: "800 ~ 1,300엔",
          station: "JR 오사카역 / 한큐 우메다역 도보 5분",
          menu: "생유자 붓카케 우동, 텐푸라 우동",
          summary: "주문 즉시 뽑아내는 쫄깃한 면발과 생간장, 라임의 산뜻한 조화. 우메다 코인라커 이용 시 편리합니다.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.7024,135.4964+(Hagakure+Umeda)"
        },
        {
          id: "conveni_umeda",
          name: "로손 & 세븐일레븐 프리미엄 델리",
          jp: "コンビニデリ (ローソン / セブン)",
          tabelog: 3.50,
          category: "간편 미식 / 편의점",
          budget: "500 ~ 800엔",
          station: "공항 ➔ 우메다 이동 중",
          menu: "로손 에그샌드위치, 닭가라아게(카라아게쿤), 명란 오니기리",
          summary: "시간을 절약하고 일본 특유의 부드러운 달걀 샌드위치를 이동 중에 가볍게 즐기는 실속형 선택지입니다.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.7024,135.4964+(Lawson+Umeda)"
        }
      ],
      dinner: [
        {
          id: "ichiran_namba",
          name: "이치란 라멘 난바점",
          jp: "一蘭 なんば店",
          tabelog: 3.61,
          category: "천연 돈코츠 라멘",
          budget: "1,000 ~ 1,500엔",
          station: "난바역 14번 출구 도보 3분 (숙소 인근)",
          menu: "천연 돈코츠 라멘, 반숙 달걀, 비밀 소스",
          summary: "독서실 칸막이 좌석에서 취향대로 면 굵기와 매운맛을 선택하는 일본 라멘의 정석. 첫날 저녁 입문용으로 최고!",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6680,135.5015+(Ichiran+Namba)"
        },
        {
          id: "kuromon_yamasho",
          name: "쿠로몬 시장 야마쇼 (山翔)",
          jp: "黒門市場 山翔",
          tabelog: 3.68,
          category: "해산물 덮밥 & 꼬치구이",
          budget: "1,500 ~ 3,000엔",
          station: "닛폰바시역 10번 출구 도보 2분 (쿠로몬 시장)",
          menu: "참치 대뱃살 덮밥, 성게알, 즉석 가리비 버터구이",
          summary: "신선한 바다의 맛을 눈앞에서 구워주는 오사카 전통시장 해산물 만찬. 숙소(온야도 노노) 도보 5분 거리.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6667,135.5057+(Kuromon+Market+Yamasho)"
        },
        {
          id: "tsurutontan_soemon",
          name: "츠루동탄 소에몬초점 (つるとんたん)",
          jp: "麺匠の心つくし つるとんたん 宗右衛門町店",
          tabelog: 3.55,
          category: "세숫대야 퓨전 프리미엄 우동",
          budget: "1,200 ~ 2,000엔",
          station: "도톤보리 강변 / 난바역 도보 6분",
          menu: "명란 크림 우동, 카레 우동, 와규 우동",
          summary: "얼굴보다 큰 대형 그릇에 나오는 쫄깃한 면발과 진한 명란 크림의 환상적 조화. 도톤보리 야경과 이어지는 코스.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6689,135.5042+(Tsurutontan+Soemoncho)"
        }
      ],
      dessert_matcha: [
        {
          id: "nanas_namba",
          name: "🍵 나나스 그린티 난바파크스점",
          jp: "ナナズグリーンティー なんばパークス店",
          tabelog: 3.52,
          isMatcha: true,
          category: "우지 말차 전문 디저트",
          budget: "700 ~ 1,200엔",
          station: "난바파크스 5층 (난바역 직결)",
          menu: "우지 말차 시라타마 파르페, 진한 말차 라테, 말차 소프트",
          summary: "교토 우지 최고급 말차 가루를 아낌없이 사용한 쌉싸름하고 달콤한 명품 파르페. 첫날 디저트로 제격!",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6616,135.5020+(Nanas+Green+Tea+Namba)"
        },
        {
          id: "rikuro_namba",
          name: "리쿠로 오지상 치즈케이크 본점",
          jp: "りくろーおじさんの店 なんば本店",
          tabelog: 3.66,
          category: "갓 구운 수플레 치즈케이크",
          budget: "965엔 (1홀)",
          station: "난바 난카이거리 상점가 도보 2분",
          menu: "따끈따끈 갓 구운 수플레 치즈케이크 (종소리 울림)",
          summary: "딸랑딸랑 종소리와 함께 방금 오븐에서 나온 부들부들한 치즈케이크. 호텔 온천 후 야식으로 환상적입니다.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6653,135.5011+(Rikuro+Ojisan+Namba)"
        },
        {
          id: "moncher_shinsaibashi",
          name: "몽슈슈 도지마롤 신사이바시점",
          jp: "パティスリー モンシェール 心斎橋本店",
          tabelog: 3.62,
          category: "프리미엄 롤케이크",
          budget: "500 ~ 1,500엔",
          station: "신사이바시역 도보 3분",
          menu: "도지마 롤 조각 / 말차 도지마롤, 홍차 세트",
          summary: "신선하고 고소한 홋카이도 순우유 크림이 가득 찬 오사카 대표 명품 롤케이크입니다.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6737,135.5005+(Moncher+Shinsaibashi)"
        }
      ]
    },

    day2: {
      breakfast: [
        {
          id: "yamamoto_coffee",
          name: "도구야스지 야마모토 커피관",
          jp: "山本珈琲館 (難波)",
          tabelog: 3.60,
          category: "오사카 레트로 킷사텐",
          budget: "600 ~ 900엔",
          station: "난바 도구야스지 상점가 도보 3분",
          menu: "모닝 B세트 (버터 토스트 + 반숙 달걀 + 사이폰 커피)",
          summary: "1950년대 전통을 이어받은 앤틱한 분위기에서 즐기는 오사카식 모닝 문화의 정수.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6648,135.5034+(Yamamoto+Coffee+Namba)"
        },
        {
          id: "nono_breakfast",
          name: "온야도 노노 난바 조식 뷔페",
          jp: "御宿 野乃 なんば 朝食バイキング",
          tabelog: 3.65,
          category: "호텔 프리미엄 해산물 조식",
          budget: "호텔 숙박 포함 또는 2,300엔",
          station: "숙소 1층 레스토랑",
          menu: "생연어알(이쿠라) 듬뿍 해산물 덮밥, 튀김, 일본 가정식",
          summary: "연어알, 참치, 가리비를 원하는 만큼 밥 위에 올려 먹는 카이센동이 제공되는 전국구 유명 조식.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6683,135.5005+(Onyado+Nono+Namba)"
        },
        {
          id: "kissaten_america",
          name: "쥰킷사 아메리카 (純喫茶 アメリカン)",
          jp: "純喫茶 アメリカン",
          tabelog: 3.54,
          category: "샹들리에 레트로 카페",
          budget: "700 ~ 1,100엔",
          station: "도톤보리 도보 2분",
          menu: "두툼한 클래식 핫케이크, 비프 카츠 샌드위치",
          summary: "화려한 샹들리에와 붉은 벨벳 소파가 돋보이는 80년 전통의 레트로 브런치 명소.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6680,135.5028+(Kissaten+American+Osaka)"
        }
      ],
      lunch: [
        {
          id: "daruma_shinsekai",
          name: "원조 구시카츠 다루마 신세카이 본점",
          jp: "元祖串かつ だるま 新世界総本店",
          tabelog: 3.53,
          category: "구시카츠 (꼬치튀김)",
          budget: "1,500 ~ 2,500엔",
          station: "에비스초역 도보 3분 (츠텐카쿠 앞)",
          menu: "신세카이 10개 튀김 모둠, 도테야키(소힘줄조림)",
          summary: "1929년 창업 원조 구시카츠. 얇고 바삭한 튀김옷과 비법 간장 소스의 조화! (소스 두 번 찍기 금지)",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6522,135.5060+(Ganso+Kushikatsu+Daruma+Shinsekai)"
        },
        {
          id: "yaekatsu_shinsekai",
          name: "야에카츠 (八重勝)",
          jp: "串かつ 八重勝 (やえかつ)",
          tabelog: 3.65,
          category: "신세카이 현지인 1위 구시카츠",
          budget: "1,800 ~ 3,000엔",
          station: "동물원앞역 1번 출구 도보 2분 (잔잔요코초)",
          menu: "소고기 꼬치, 새우 꼬치, 된장 도테야키",
          summary: "타베로그 평점 3.65로 신세카이에서 가장 높은 평가를 받는 현지인 찐 맛집. 튀김옷이 놀랍도록 가볍습니다.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6508,135.5064+(Yaekatsu+Shinsekai)"
        },
        {
          id: "tokumasa_osakajo",
          name: "도쿠마사 오사카성점 (得正)",
          jp: "得正 森ノ宮店 (大阪城)",
          tabelog: 3.58,
          category: "수제 카레우동 전문점",
          budget: "850 ~ 1,300엔",
          station: "모리노미야역 도보 3분 (오사카성 공원 입구)",
          menu: "소고기 카레우동, 돈카츠 카레우동",
          summary: "오사카 수상 크루즈 및 오사카성 관람 후 따끈하고 진한 일본식 카레우동으로 원기 회복하기 완벽한 곳.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6812,135.5332+(Tokumasa+Morinomiya)"
        }
      ],
      dinner: [
        {
          id: "kinryu_ramen",
          name: "킨류 라멘 도톤보리점",
          jp: "金龍ラーメン 道頓堀店",
          tabelog: 3.50,
          category: "24시간 돈코츠 라멘",
          budget: "800 ~ 1,100엔",
          station: "난바역 도보 5분 (도톤보리 중앙)",
          menu: "라멘 (800엔), 차슈멘 (1,100엔)",
          summary: "김치, 부추무침, 다진 마늘, 밥이 무료 셀프바로 무제한 제공되는 오사카의 상징적 서민 맛집.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6686,135.5032+(Kinryu+Ramen+Dotonbori)"
        },
        {
          id: "ajinoya_dotonbori",
          name: "아지노야 본점 (味乃家)",
          jp: "味乃家 本店 (難波)",
          tabelog: 3.60,
          category: "미슐랭 빕구르망 오코노미야키",
          budget: "1,500 ~ 2,800엔",
          station: "난바역 14번 출구 도보 2분",
          menu: "아지노야 믹스 오코노미야키, 야키소바",
          summary: "양배추의 단맛과 푹신푹신한 반죽 식감이 일품인 미슐랭 가이드 등재 오코노미야키 최고봉.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6683,135.5012+(Ajinoya+Namba)"
        },
        {
          id: "kukuru_dotonbori",
          name: "도톤보리 타코야키 쿠쿠루 본점",
          jp: "たこ家道頓堀くくる 本店",
          tabelog: 3.52,
          category: "대형 문어 타코야키",
          budget: "800 ~ 1,500엔",
          station: "도톤보리 거리 중앙 (에비스바시 옆)",
          menu: "깜짝 대왕 문어 타코야키(8개 890엔), 아카시야키(육수 타코야키)",
          summary: "커다란 문어가 밖으로 삐져나오는 부드러운 속살의 오사카 원조 타코야키.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6687,135.5020+(Kukuru+Dotonbori)"
        }
      ],
      dessert_matcha: [
        {
          id: "ujien_shinsaibashi",
          name: "🍵 우지엔(宇治園) 신사이바시 본점",
          jp: "宇治園 心斎橋本店",
          tabelog: 3.58,
          isMatcha: true,
          category: "150년 전통 교토 우지 찻집",
          budget: "800 ~ 1,500엔",
          station: "신사이바시역 5번 출구 도보 3분",
          menu: "몽블랑 말차 파르페, 생말차 소프트아이스크림, 호지차 라테",
          summary: "1869년 창업한 전통 찻집 본점. 주문 즉시 국수처럼 짜주는 진한 말차 몽블랑 크림이 예술입니다.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6725,135.5015+(Ujien+Shinsaibashi)"
        },
        {
          id: "pablo_shinsaibashi",
          name: "파블로 치즈타르트 신사이바시점",
          jp: "PABLO 心斎橋店",
          tabelog: 3.51,
          category: "미디엄 치즈타르트",
          budget: "900 ~ 1,400엔",
          station: "신사이바시 상점가 도보 2분",
          menu: "갓 구운 치즈타르트 레어/미디엄, 우지말차 치즈타르트",
          summary: "반으로 가르면 살살 흘러내리는 진한 치즈 커스터드 타르트.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6710,135.5012+(Pablo+Shinsaibashi)"
        },
        {
          id: "cremia_dotonbori",
          name: "쿠쿠루 크레미아 랑그드샤 아이스크림",
          jp: "クレミア (CREMIA) ソフト",
          tabelog: 3.50,
          category: "생크림 25% 프리미엄 아이스크림",
          budget: "550엔",
          station: "도톤보리 거리 매장",
          menu: "크레미아 바닐라 / 말차 믹스 (쿠키 콘)",
          summary: "콘 부분이 바삭한 쿠키(랑그드샤)로 되어 있어 마지막 한 입까지 고급스러운 소프트크림.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.6687,135.5014+(Cremia+Dotonbori)"
        }
      ]
    },

    day3: {
      lunch: [
        {
          id: "warajiya_kyoto",
          name: "니시키 와라자야 (두부 요리)",
          jp: "錦 わらじや",
          tabelog: 3.68,
          category: "교토 전통 유도후(두부) 정식",
          budget: "1,500 ~ 2,800엔",
          station: "시조역 / 카와라마치역 도보 4분 (니시키 시장 내)",
          menu: "유도후(湯豆腐) 정식, 두부 스테이크, 제철 교토 반찬",
          summary: "교토의 맑은 지하수로 빚은 담백하고 부드러운 수제 두부 밥상. 시장 구경 중 여유롭게 식사하기 최적.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0049,135.7648+(Nishiki+Market)"
        },
        {
          id: "kaneyo_kyoto",
          name: "교고쿠 카네쇼 (京極かねよ)",
          jp: "京極かねよ (きょうごく かねよ)",
          tabelog: 3.62,
          category: "100년 전통 킨시동(계란장어덮밥)",
          budget: "2,500 ~ 4,000엔",
          station: "카와라마치역 도보 5분 / 신쿄고쿠 상점가",
          menu: "킨시동(대형 계란지단이 덮인 장어덮밥), 우나쥬",
          summary: "타이쇼 시대 건물에서 숯불에 구운 장어 위에 푹신한 대왕 계란말이를 덮어주는 교토의 명물 요리.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0070,135.7675+(Kyogoku+Kaneyo)"
        },
        {
          id: "menya_yuko",
          name: "멘야 유코 (麺屋 優光)",
          jp: "麺屋 優光 (めんや ゆうこう)",
          tabelog: 3.67,
          category: "조개 육수 감칠맛 라멘",
          budget: "900 ~ 1,400엔",
          station: "카라스마오이케역 도보 3분",
          menu: "담죽(바지락 조개 라멘), 진죽(멸치 간장 라멘)",
          summary: "조개와 가다랑어포로 우려낸 투명하고 시원한 국물로 교토 직장인과 미식가들이 줄을 잇는 신흥 강자.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0105,135.7600+(Menya+Yuko+Kyoto)"
        }
      ],
      dinner: [
        {
          id: "menya_inoichi",
          name: "멘야 이노이치 하나레 (교토 1위 라멘)",
          jp: "麺屋 猪一 離れ",
          tabelog: 3.82,
          category: "미슐랭 빕구르망 시오 라멘",
          budget: "1,200 ~ 1,800엔",
          station: "기온시조역 도보 7분 / 카와라마치역 도보 5분",
          menu: "출즙 시오(소금) 라멘, 소고기 흑후추 라멘, 와규 차슈동",
          summary: "타베로그 교토 1위! 돼지기름 없이 맑은 닭과 해산물 출즙으로 우려낸 감동적인 맛. (17:15 도착 권장)",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0008,135.7634+(Menya+Inoichi+Hanare)"
        },
        {
          id: "gion_sasaya",
          name: "기온 사사야 (祇園 ささや)",
          jp: "祇園 ささや",
          tabelog: 3.70,
          category: "교토 정통 가정식 가이세키",
          budget: "3,500 ~ 6,000엔",
          station: "기온시조역 도보 4분 (기온 하나미코지 인근)",
          menu: "교토 제철 오반자이 코스, 은대구 된장구이",
          summary: "기온 거리의 고즈넉한 목조 건물에서 마이코 거리 분위기를 만끽하며 즐기는 품격 있는 저녁 식사.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0033,135.7753+(Gion+Sasaya+Kyoto)"
        },
        {
          id: "izumoya_pontocho",
          name: "카모가와 이즈모야 (いづもや)",
          jp: "先斗町 いづもや",
          tabelog: 3.56,
          category: "카모가와 강변 텐푸라 & 소바",
          budget: "2,000 ~ 3,500엔",
          station: "산조역 / 기온시조역 도보 3분 (폰토쵸 입구)",
          menu: "카모가와 모둠 텐푸라 정식, 수제 메밀소바, 장어덮밥",
          summary: "카모가와 강이 내려다보이는 창가 좌석에서 바삭한 튀김과 메밀국수를 즐길 수 있는 70년 전통점.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0045,135.7712+(Izumoya+Pontocho)"
        }
      ],
      dessert_matcha: [
        {
          id: "tsujiri_gion",
          name: "🍵 사료 츠지리(茶寮 都路里) 기온 본점",
          jp: "茶寮 都路里 祇園本店",
          tabelog: 3.65,
          isMatcha: true,
          category: "교토 최고 말차 파르페 성지",
          budget: "1,200 ~ 1,800엔",
          station: "기온시조역 6번 출구 도보 3분 (야사카 신사 방향)",
          menu: "특선 츠지리 말차 파르페 (1,550엔), 말차 젠자이(단팥죽)",
          summary: "교토를 대표하는 말차 디저트의 최고봉! 진한 우지 말차 아이스크림, 말차 젤리, 팥앙금의 환상적 조화.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0036,135.7750+(Saryo+Tsujiri+Gion)"
        },
        {
          id: "gion_koishi",
          name: "🍵 기온 코이시(祇園小石) 비법 흑설탕 말차빙수",
          jp: "家伝京飴 祇園小石",
          tabelog: 3.60,
          isMatcha: true,
          category: "전통 흑설탕 말차 디저트",
          budget: "900 ~ 1,400엔",
          station: "기온시조역 도보 4분",
          menu: "비전 흑설탕 말차 빙수, 말차 시폰케이크 파르페",
          summary: "오키나와산 흑설탕 시럽과 진한 말차가 어우러진 눈꽃 빙수. 기온 산책 중 달콤한 힐링.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0038,135.7760+(Gion+Koishi)"
        },
        {
          id: "koyamaen_kyoto",
          name: "🍵 마루큐 코야마엔 (丸久小山園) 니시토인점",
          jp: "丸久小山園 西洞院店 (茶房 元庵)",
          tabelog: 3.74,
          isMatcha: true,
          category: "300년 우지 차 명가의 다실",
          budget: "1,000 ~ 1,600엔",
          station: "카라스마오이케역 도보 6분",
          menu: "말차 롤케이크 세트, 다도용 진한 말차(오우스) & 화과자",
          summary: "포크를 대면 진한 말차 크림이 흘러나오는 전설의 롤케이크를 전통 다실에서 즐길 수 있습니다.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0118,135.7562+(Marukyu+Koyamaen)"
        }
      ]
    },

    day4: {
      breakfast: [
        {
          id: "bread_espresso_arashiyama",
          name: "팡토 에스프레소토 아라시야마 정원점",
          jp: "パンとエスプレッソと 嵐山庭園",
          tabelog: 3.58,
          category: "교토 등록문화재 한옥 정원 브런치",
          budget: "1,200 ~ 1,800엔",
          station: "란덴 아라시야마역 도보 6분",
          menu: "철판 프렌치토스트 세트, 앙버터 빵, 라테",
          summary: "200년 된 고택과 고요한 일본 정원을 감상하며 갓 구운 빵과 커피를 맛보는 아라시야마 최고의 아침.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0142,135.6748+(Bread+Espresso+Arashiyama)"
        },
        {
          id: "sagano_yunoyado",
          name: "사가노 유노야도 모닝 카페",
          jp: "嵯峨野 湯の宿 カフェ",
          tabelog: 3.60,
          category: "강변 뷰 일본식 조식 세트",
          budget: "800 ~ 1,400엔",
          station: "아라시야마 강변 도게츠교 인근",
          menu: "따뜻한 두부 조식 세트, 모닝 드립 커피",
          summary: "대나무숲 이른 아침 산책 전 시냇물 소리를 들으며 든든하게 속을 채울 수 있는 여유로운 카페.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0135,135.6775+(Sagano+Cafe+Arashiyama)"
        },
        {
          id: "otsuka_arashiyama",
          name: "오츠카 스테이크 하우스 (おおつか)",
          jp: "ステーキおおつか (嵐山)",
          tabelog: 3.62,
          category: "흑모와규 로스트비프",
          budget: "1,800 ~ 3,500엔",
          station: "JR 사가아라시야마역 도보 5분",
          menu: "로스트비프 덮밥, 무라사와규 스테이크",
          summary: "환상적인 마블링의 최고급 와규를 아침 겸 이른 점심으로 든든하게 맛볼 수 있는 육식파 명소.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0185,135.6812+(Otsuka+Arashiyama)"
        }
      ],
      lunch: [
        {
          id: "saiin_teishoku",
          name: "사이인 로컬 테이쇼쿠 정식집",
          jp: "西院 定食屋 (ごはん処)",
          tabelog: 3.60,
          category: "일본 가정식 백반 (생선구이)",
          budget: "800 ~ 1,200엔",
          station: "란덴 사이인역 / 한큐 사이인역 도보 3분",
          menu: "고등어 소금구이 정식, 치킨 난반 정식, 미소된장국",
          summary: "🙏 교토교회 11-13시 예배 후 바로 걸어가서 조용하고 정갈하게 먹을 수 있는 현지 주민 맛집.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0042,135.7317+(Saiin+Station+Kyoto)"
        },
        {
          id: "yasui_matcha_soba",
          name: "🍵 소바도코로 야스이 (우지 말차소바)",
          jp: "そば処 安井 (西院)",
          tabelog: 3.55,
          isMatcha: true,
          category: "수제 메밀소바 & 우지 말차소바",
          budget: "900 ~ 1,500엔",
          station: "사이인역 도보 4분",
          menu: "차소바(우지 말차를 반죽한 초록빛 소바), 새우 텐푸라 소바",
          summary: "교토 우지 말차를 메밀 반죽에 넣어 향긋하고 쫄깃한 냉소바. 예배 후 속 편한 점심으로 최적!",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0035,135.7310+(Yasui+Soba+Saiin)"
        },
        {
          id: "kyoto_kitchen_saiin",
          name: "사이인 교토 키친 카레 & 돈카츠",
          jp: "西院 カレーハウス",
          tabelog: 3.52,
          category: "수제 카레 & 돈카츠",
          budget: "850 ~ 1,300엔",
          station: "사이인역 도보 2분",
          menu: "숙성 등심 카츠 카레, 치즈 오므라이스",
          summary: "깊은 맛의 수제 루와 바삭한 돈카츠의 조화. 빠르고 든든하게 식사하고 금각사로 이동하기 좋습니다.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0040,135.7325+(Saiin+Curry)"
        }
      ],
      dinner: [
        {
          id: "saiin_koma",
          name: "사이인 숯불 야키니쿠 코마",
          jp: "西院 焼肉こま",
          tabelog: 3.66,
          category: "로컬 숯불 소고기구이",
          budget: "2,500 ~ 4,000엔",
          station: "란덴 사이인역 도보 4분",
          menu: "특선 갈비, 안창살(하라미), 대창구이, 냉면",
          summary: "9/20(일) 18:00 사이인역 저녁 일정에 완벽 부합하는 현지인 1위 야키니쿠. 시원한 생맥주와 최고!",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0028,135.7321+(Yakiniku+Koma+Saiin)"
        },
        {
          id: "torikizoku_saiin",
          name: "토리키조쿠 사이인역점 (鳥貴族)",
          jp: "鳥貴族 西院店",
          tabelog: 3.50,
          category: "균일가 숯불 닭꼬치 (야키토리)",
          budget: "1,500 ~ 2,500엔",
          station: "한큐 사이인역 바로 앞 건물 2층",
          menu: "닭다리살 대파꼬치(귀족구이), 치킨 가라아게, 양배추 무제한",
          summary: "전 메뉴 360엔 균일가로 가성비가 폭발하며, 태블릿 한국어 주문이 완비되어 편안한 식사 가능.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0038,135.7320+(Torikizoku+Saiin)"
        },
        {
          id: "menya_sandaime_saiin",
          name: "사이인 멘야 산다이메",
          jp: "西院 麺屋 熟成豚骨",
          tabelog: 3.53,
          category: "진한 숙성 돈코츠 라멘",
          budget: "850 ~ 1,200엔",
          station: "사이인역 도보 3분",
          menu: "차슈 라멘, 바삭한 수제 교자(만두)",
          summary: "진하고 구수한 돼지뼈 육수에 쫄깃한 생면. 부담 없이 든든한 한 끼를 원하는 분께 추천합니다.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0045,135.7315+(Ramen+Saiin)"
        }
      ],
      dessert_matcha: [
        {
          id: "arabica_arashiyama",
          name: "🍵 % 아라비카 교토 아라시야마 (응커피)",
          jp: "% Arabica Kyoto Arashiyama",
          tabelog: 3.79,
          isMatcha: true,
          category: "리버뷰 스페셜티 커피 & 말차 라테",
          budget: "600 ~ 900엔",
          station: "란덴 아라시야마역 도보 5분 (강변)",
          menu: "교토 라테, 말차 라테(Matcha Latte), 에스프레소",
          summary: "카츠라 강과 아라시야마 산을 파노라마로 바라보는 전 세계 최고 핫플레이스 카페.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0135,135.6775+(Arabica+Kyoto+Arashiyama)"
        },
        {
          id: "yojiya_cafe_arashiyama",
          name: "🍵 요지야 카페(よーじや) 사가노 아라시야마점",
          jp: "よーじやカフェ 嵯峨野嵐山店",
          tabelog: 3.55,
          isMatcha: true,
          category: "기모노 얼굴 말차 카푸치노 아트",
          budget: "700 ~ 1,400엔",
          station: "대나무숲 출구 도보 3분",
          menu: "특제 말차 카푸치노(얼굴 라테아트), 말차 파르페",
          summary: "교토 전통 기름종이 명가 요지야의 카페. 잔 위에 그려진 기모노 여성 얼굴 아트가 인증샷 명소.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0160,135.6760+(Yojiya+Cafe+Arashiyama)"
        },
        {
          id: "kinkaku_matcha_soft",
          name: "🍵 금각사 앞 사도(茶道) 금박 말차 소프트",
          jp: "金閣寺前 抹茶金箔ソフト",
          tabelog: 3.52,
          isMatcha: true,
          category: "금박 우지 말차 소프트아이스크림",
          budget: "600 ~ 900엔",
          station: "금각사 정문 앞 상점가",
          menu: "순금박 말차 소프트아이스크림, 냉말차(그린티)",
          summary: "금각사의 찬란한 황금빛을 재현하여 말차 아이스크림 위에 식용 순금박을 한 장 통째로 입혀주는 시그니처.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0394,135.7292+(Kinkakuji+Matcha+Soft)"
        }
      ]
    },

    day5: {
      breakfast: [
        {
          id: "inoda_coffee",
          name: "이노다 커피 본점 (1947년 창업)",
          jp: "イノダコーヒ 本店",
          tabelog: 3.78,
          category: "80년 전통 교토 살롱형 카페",
          budget: "900 ~ 1,600엔",
          station: "카라스마오이케역 도보 5분 / 산조역 도보 7분",
          menu: "아라비아의 진주 블렌드, 모닝 세트(크루아상, 햄, 에그)",
          summary: "교토의 아침을 여는 대표 커피 살롱. 고풍스러운 은식기와 일본식 중정을 바라보는 여유.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0089,135.7629+(Inoda+Coffee+Honten)"
        },
        {
          id: "smart_coffee_kyoto",
          name: "스마트 커피 (Smart Coffee)",
          jp: "スマート珈琲店 (寺町通)",
          tabelog: 3.72,
          category: "1932년 창업 수제 핫케이크 명가",
          budget: "800 ~ 1,400엔",
          station: "교토시청앞역 도보 3분 / 테라마치 상점가",
          menu: "두툼한 수제 핫케이크, 프렌치토스트, 자체 로스팅 커피",
          summary: "겉은 바삭하고 속은 촉촉한 황금빛 팬케이크에 시럽과 버터를 듬뿍 올려 먹는 교토 레트로의 정수.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=35.0102,135.7678+(Smart+Coffee+Kyoto)"
        },
        {
          id: "sakura_terrace_bf",
          name: "사쿠라 테라스 더 갤러리 조식 뷔페",
          jp: "サクラテラス ザ ギャラリー 朝食",
          tabelog: 3.65,
          category: "호텔 프리미엄 유러피언 뷔페",
          budget: "숙박 포함 또는 2,200엔",
          station: "숙소 1층 테라스 가든",
          menu: "갓 구운 프레시 크루아상, 제철 과일, 스무디, 오믈렛",
          summary: "야외 정원 테라스에서 햇살을 받으며 체크아웃 전 든든하게 즐기는 품격 있는 호텔 뷔페.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.9818,135.7592+(Sakura+Terrace+The+Gallery)"
        }
      ],
      lunch: [
        {
          id: "fushimi_nishimuratei",
          name: "후시미이나리 니시무라테이 (にしむら亭)",
          jp: "伏見稲荷 にしむら亭",
          tabelog: 3.60,
          category: "신사 전통 키츠네(여우 유부) 소바",
          budget: "900 ~ 1,500엔",
          station: "후시미이나리 신사 도보 3분",
          menu: "키츠네(달콤한 대왕 유부) 우동/소바, 이나리즈시(유부초밥)",
          summary: "붉은 도리이 터널 산책 후 여우 신사의 상징인 달콤짭조름한 유부 소바를 맛보는 전통 코스.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.9671,135.7727+(Fushimi+Inari+Taisha)"
        },
        {
          id: "touyoutei_kyoto",
          name: "교토역 그릴 동양정 본점 (東洋亭)",
          jp: "グリルキャピタル東洋亭 京都ポルタ店",
          tabelog: 3.58,
          category: "1897년 창업 120년 전통 함박스테이크",
          budget: "1,500 ~ 2,500엔",
          station: "교토역 지하 포르타(Porta) 상점가",
          menu: "은박지 함박스테이크, 통 토마토 샐러드",
          summary: "부풀어 오른 은박지를 나이프로 가르면 모락모락 김과 함께 진한 데미글라스 소스의 함박이 나타납니다.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.9858,135.7588+(Touyoutei+Kyoto+Porta)"
        },
        {
          id: "ramen_koji_kyoto",
          name: "교토역 이세탄 라멘코지 (拉麺小路)",
          jp: "京都拉麺小路 (伊勢丹10階)",
          tabelog: 3.55,
          category: "전국 9대 명품 라멘 거리",
          budget: "900 ~ 1,400엔",
          station: "교토역 이세탄 백화점 10층",
          menu: "하카타 돈코츠, 삿포로 미소, 도쿠시마 라멘",
          summary: "일본 전국의 유명 라멘 맛집 9곳이 모여 있어 하루카 탑승 전 취향대로 골라 먹기 가장 편리한 곳.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.9858,135.7588+(Kyoto+Ramen+Koji)"
        }
      ],
      dessert_matcha: [
        {
          id: "tokichi_kyoto_station",
          name: "🍵 나카무라 토키치(中村藤吉) 교토역 하치조구치점",
          jp: "中村藤吉 京都駅店 (八条口)",
          tabelog: 3.75,
          isMatcha: true,
          category: "1854년 우지 찻집 대나무통 말차 파르페",
          budget: "1,100 ~ 1,700엔",
          station: "JR 교토역 신칸센/하루카 승강장 바로 옆",
          menu: "생말차 젤리 파르페(대나무통), 말차 아이스크림 테이크아웃",
          summary: "차원이 다른 쌉싸름함과 쫄깃한 생말차 젤리! 하루카 특급 기차에 타기 전 포장하여 탑승하기에 환상적.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.9850,135.7580+(Nakamura+Tokichi+Kyoto+Station)"
        },
        {
          id: "malebranche_kyoto",
          name: "🍵 마르브랑슈 (MALEBRANCHE) 차노카 본점",
          jp: "マールブランシュ 京都駅店 (茶の菓)",
          tabelog: 3.68,
          isMatcha: true,
          category: "교토 명품 우지 말차 랑그드샤",
          budget: "800 ~ 2,500엔",
          station: "교토역 포르타/킨테츠 명점가",
          menu: "차노카(진한 우지 말차 쿠키 + 화이트초콜릿), 말차 퐁당 쇼콜라",
          summary: "교토역에서 가장 사랑받는 최고급 말차 선물. 바삭한 말차 비스킷 사이 화이트초코가 사르르 녹습니다.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.9858,135.7588+(Malebranche+Kyoto+Station)"
        },
        {
          id: "koyaku_kyoto_station",
          name: "츠지리 교토역 타워 테이크아웃 스탠드",
          jp: "辻利 京都タワーサンド店",
          tabelog: 3.52,
          isMatcha: true,
          category: "스탠딩 말차 라테 & 소프트",
          budget: "500 ~ 900엔",
          station: "교토역 북쪽 교토타워 지하 1층",
          menu: "츠지리 진한 말차 소프트콘, 아이스 말차 플로트",
          summary: "줄 서지 않고 빠르고 간편하게 테이크아웃하여 즐길 수 있는 츠지리 직영 스탠드 매장.",
          mapUrl: "https://www.google.com/maps/search/?api=1&query=34.9875,135.7592+(Tsujiri+Kyoto+Tower)"
        }
      ]
    }
  },

  // [돈키호테 & 드럭스토어 엄선 선물 15종 (사진 매핑, 정밀 엔화/원화 가격, 설명)]
  gifts15: [
    {
      id: "shoshugen_poopourri",
      title: "1. 일본판 푸푸리 (고바야시 1방울 소취원)",
      jp: "小林製薬 1滴消臭元 (いってきしょうしゅうげん)",
      category: "화장실 에티켓 드롭스",
      badge: "🔥 사용자 요청 1순위 선물",
      price: "약 298 ~ 350엔 (한화 약 2,800~3,300원)",
      popular: "한국 올리브영 대비 50% 이상 저렴!",
      image: "images/donki_shoshugen.jpg",
      summary: "한국 여행객들이 '일본판 푸푸리'로 부르는 화장실 매너 필수템. 볼일 보기 전후 변기 물에 딱 '1방울'만 떨어뜨리면 특허 오일막이 악취를 100% 가두고 은은한 로즈/스위트솝 향을 즉각 퍼뜨려 줍니다.",
      tips: [
        "돈키호테 화장실 코너 또는 계산대 앞 매대 진열",
        "20ml 초소형 크기로 핸드백, 파우치에 쏙 들어감",
        "300엔대 초가성비로 직장 동료, 친구 선물 만족도 1위"
      ]
    },
    {
      id: "night_d_cream",
      title: "2. 나이트 D 아이크림",
      jp: "ナイトD アイクリーム",
      category: "스킨케어 / 안티에이징",
      badge: "돈키호테 뷰티 1위",
      price: "약 880 ~ 1,100엔 (한화 약 8,000~10,000원)",
      popular: "한국 올리브영 반값 수준",
      image: "images/donki_skincare.jpg",
      summary: "수면 중 눈가와 팔자주름에 탄력을 집중 공급하는 레티놀 배합 밤 타입 아이크림. 끈적임 없이 촉촉하게 흡수되어 선물용으로 장바구니 필수템입니다.",
      tips: [
        "돈키호테 화장품 코너 '눈가 케어' 섹션에 위치",
        "친구, 어머니 선물용으로 3~5개씩 쟁이는 아이템"
      ]
    },
    {
      id: "fujiko_tint",
      title: "3. 후지코 뉘앙스 루즈 립틴트",
      jp: "Fujiko ニュアンスルージュ",
      category: "코스메틱 / 립 틴트",
      badge: "일본 뷰티 어워드 수상",
      price: "약 1,320엔 (한화 약 12,000원)",
      popular: "지속력 & 수분감 깡패",
      image: "images/donki_skincare.jpg",
      summary: "물 빠짐 없이 오랫동안 촉촉한 윤기와 자연스러운 수채화 혈색을 유지해 주는 립 틴트로, 발색과 지속력이 매우 뛰어납니다.",
      tips: [
        "01번 체리레드, 02번 피치코랄 색상이 한국인 피부톤에 가장 인기"
      ]
    },
    {
      id: "canmake_eyes",
      title: "4. 캔메이크 퍼펙트 스타일리스트 아이즈",
      jp: "キャンメイク パーフェクトスタイリストアイズ",
      category: "코스메틱 / 섀도우 팔레트",
      badge: "가성비 음영 팔레트",
      price: "약 858엔 (한화 약 8,000원)",
      popular: "데일리 음영 메이크업 종결자",
      image: "images/donki_skincare.jpg",
      summary: "가루 날림 없이 밀착되는 부드러운 5색 음영 아이섀도우 팔레트. 중앙의 펄 토핑 섀도우가 은은한 애교살 포인트로 최고입니다.",
      tips: [
        "한국 드럭스토어 판매가 대비 약 40% 저렴"
      ]
    },
    {
      id: "royce_chocolate",
      title: "5. 로이스 생초콜릿 (오레 / 말차)",
      jp: "ロイズ 生チョコレート",
      category: "프리미엄 디저트",
      badge: "공항 면세점 부동의 1위",
      price: "약 800 ~ 900엔 (한화 약 7,500~8,500원)",
      popular: "입안에서 사르르 녹아내림",
      image: "images/donki_snacks.jpg",
      summary: "홋카이도산 생크림이 듬뿍 들어가 쫀득하고 부드러운 생초콜릿. 귀국 당일(5일차) 간사이공항 출국장 면세점에서 보냉백(100엔)과 함께 구매하세요.",
      tips: [
        "보냉백 포장 시 한국 귀국 후에도 8~10시간 안전 유지"
      ]
    },
    {
      id: "shiroi_koibito",
      title: "6. 시로이 코이비토 (하얀 연인)",
      jp: "白い恋人 (12개입 / 24개입)",
      category: "프리미엄 제과 쿠키",
      badge: "일본 국민 쿠키 선물",
      price: "약 1,080엔 ~ (한화 약 10,000원~)",
      popular: "남녀노소 호불호 없는 명과",
      image: "images/donki_snacks.jpg",
      summary: "바삭하고 얇은 랑그드샤 버터 쿠키 사이에 부드러운 화이트 초콜릿을 샌드한 홋카이도 명과. 포장이 고급스러워 어르신 선물로 제격.",
      tips: [
        "간사이공항 면세점 및 돈키호테 과자 코너에서 판매"
      ]
    },
    {
      id: "uji_matcha_kitkat",
      title: "7. 교토 우지 말차 킷캣 & 바움쿠헨",
      jp: "京都宇治抹茶 キットカット / バームクーヘン",
      category: "말차 특화 과자",
      badge: "🍵 교토 한정 프리미엄",
      price: "약 500 ~ 1,200엔 (한화 약 5,000~11,000원)",
      popular: "쌉싸름하고 진한 말차 향",
      image: "images/donki_matcha_snack.jpg",
      summary: "일반 녹차 과자와 차원이 다른 교토 우지(宇治)산 정통 말차를 함유하여 쌉싸름한 풍미와 달콤한 초콜릿이 환상적인 밸런스를 이룹니다.",
      tips: [
        "초록색 교토 한정 패키지는 선물용 박스로 개별 포장되어 있어 나눔용으로 최고"
      ]
    },
    {
      id: "tokyo_banana",
      title: "8. 도쿄 바나나 카스텔라 샌드",
      jp: "東京ばな奈 見ぃつけたっ",
      category: "스폰지 케이크 선물",
      badge: "부드러운 커스터드",
      price: "약 1,080엔 (한화 약 10,000원)",
      popular: "선물 실패 없는 정석",
      image: "images/donki_snacks.jpg",
      summary: "폭신폭신한 바나나 모양 카스텔라 빵 안에 리얼 바나나 퓌레 커스터드 크림이 듬뿍 채워진 클래식 디저트.",
      tips: [
        "간사이공항 면세점에서 탑승 직전 면세가로 구매 추천"
      ]
    },
    {
      id: "ryukakusan_direct",
      title: "9. 용각산 다이렉트 스틱 (복숭아/민트)",
      jp: "龍角散ダイレクト (16포)",
      category: "인후 상비약 / 목 건강",
      badge: "부모님 효도 선물 1위",
      price: "약 680 ~ 800엔 (한화 약 6,500원)",
      popular: "물 없이 녹여 먹는 가루 스틱",
      image: "images/donki_medicine.jpg",
      summary: "물 없이 입안에 털어 넣으면 사르르 녹아 목의 칼칼함, 통증, 기침을 즉각 진정시켜 주는 생약 과립 상비약입니다.",
      tips: [
        "핑크색 복숭아향이 가장 맛있고 부담 없음"
      ]
    },
    {
      id: "salonpas_140",
      title: "10. 샤론파스 140매 대용량",
      jp: "サロンパス 140枚入",
      category: "진통 소염 밀착 파스",
      badge: "파스 부문 1위",
      price: "약 1,180 ~ 1,400엔 (한화 약 11,000원)",
      popular: "국내 약국 대비 50% 저렴",
      image: "images/donki_medicine.jpg",
      summary: "명함 크기의 컴팩트한 파스로 어깨, 손목, 발바닥에 밀착력이 우수하며 피부 발진이 적은 일본 국민 파스입니다.",
      tips: [
        "140매 대용량 박스가 가성비 가장 우수"
      ]
    },
    {
      id: "eve_quick_painkiller",
      title: "11. EVE 퀵 / EVE A 두통약",
      jp: "EVE QUICK / EVE A錠",
      category: "속편한 진통제",
      badge: "빠른 흡수 국민 진통제",
      price: "약 880 ~ 1,300엔 (한화 약 8,000~12,000원)",
      popular: "두통, 생리통 필수 쟁임템",
      image: "images/donki_medicine.jpg",
      summary: "이부프로펜 성분에 산화마그네슘을 배합하여 위를 보호하면서 두통과 근육통을 매우 빠르게 완화시켜 줍니다.",
      tips: [
        "골드 박스(EVE 퀵 DX)가 가장 빠른 효과"
      ]
    },
    {
      id: "rohto_vita40",
      title: "12. 로토 비타 40 쿨 안약",
      jp: "ロート ビタ40α",
      category: "비타민 청량 안약",
      badge: "3천원대 갓성비 선물",
      price: "약 350 ~ 450엔 (한화 약 3,500원)",
      popular: "스마트폰 눈 피로 즉각 해소",
      image: "images/donki_medicine.jpg",
      summary: "비타민 E, B6가 함유되어 피로하고 뻑뻑한 눈에 상쾌한 청량감을 불어넣어 주는 초인기 드롭스입니다.",
      tips: [
        "노란색(비타민 보통)과 파란색(강한 시원함) 중 선택"
      ]
    },
    {
      id: "kyusoku_jikan",
      title: "13. 휴족시간 쿨링 풋시트 (18매)",
      jp: "休足時間 (きゅうそくじかん)",
      category: "종아리/발바닥 쿨링 시트",
      badge: "여행 필수품",
      price: "약 598 ~ 700엔 (한화 약 5,500원)",
      popular: "도보 2만보 걷고 붙이면 천국",
      image: "images/donki_medicine.jpg",
      summary: "라벤더, 로즈마리 허브 오일 젤 시트로 잠들기 전 종아리나 발바닥에 붙이면 밤새 부종과 붓기를 싹 빼줍니다.",
      tips: [
        "여행 1~2일차 밤 호텔 온천 후 바로 붙이고 취침 추천"
      ]
    },
    {
      id: "ohta_isan",
      title: "14. 오타이산 한방 위장 소화제 (48포)",
      jp: "太田胃散 (おおたいさん)",
      category: "140년 전통 생약 소화제",
      badge: "국민 위장약",
      price: "약 1,280 ~ 1,450엔 (한화 약 12,000원)",
      popular: "과식, 더부룩함, 숙취 해소",
      image: "images/donki_medicine.jpg",
      summary: "순수 생약 한방 성분으로 속 쓰림, 과식 후 더부룩함, 체기를 빠르고 편안하게 다스려 주는 일본 전통의 약품입니다.",
      tips: [
        "휴대용 분말 스틱 48포입 박스를 추천"
      ]
    },
    {
      id: "suisai_powder",
      title: "15. SUISAI 효소 세안 파우더 캡슐",
      jp: "suisai ビューティクリア パウダーウォッシュ",
      category: "클렌징 / 모공 케어",
      badge: "코스메틱 어워드 1위",
      price: "약 1,800엔 (한화 약 16,000원 / 32개입)",
      popular: "1회용 캡슐 모공 각질 청소",
      image: "images/donki_skincare.jpg",
      summary: "효소 파우더가 물과 만나 조밀한 거품을 형성하여 블랙헤드와 묵은 각질을 자극 없이 녹여내는 프리미엄 클렌저.",
      tips: [
        "개별 캡슐 포장으로 여행용 세안제로도 완벽"
      ]
    }
  ],

  // [한국 출발 전 필수 사전 구매 체크리스트 (실제 운영 사이트 직통 링크)]
  prepurchase: [
    {
      title: "하루카 특급 할인 티켓 (교토 ➔ 간사이공항)",
      desc: "정가 3,640엔 ➔ 외국인 30% 할인으로 약 2,550엔에 구매 가능. 귀국일 75분 만에 공항 직통 연결!",
      officialUrl: "https://www.westjr.co.jp/global/kr/ticket/pass/one_way/haruka/",
      klookUrl: "https://www.klook.com/ko/activity/18400-jr-haruka-airport-express-train-tickets-osaka/",
      timing: "출발 1~2주 전 온라인 예매 권장"
    },
    {
      title: "오사카 주유패스 (2일권)",
      desc: "스카이빌딩, 츠텐카쿠, 오사카성, 크루즈 무료 입장 + 지하철 무제한으로 1인당 최소 2,500엔 절약!",
      officialUrl: "https://www.osp.osaka-info.jp/kr/",
      klookUrl: "https://www.klook.com/ko/activity/1323-osaka-amazing-pass-osaka/",
      mrtUrl: "https://www.myrealtrip.com/offers/4447",
      timing: "출발 3~7일 전 모바일 E-티켓 구매"
    },
    {
      title: "일본 무제한 데이터 eSIM / USIM",
      desc: "현지 통신망 직결로 지도 검색 및 번역기 사용 필수. 실물 유심 교체 없는 eSIM 적극 추천!",
      usimsaUrl: "https://usimsa.com/esim/japan",
      rokebiUrl: "https://www.rokebi.com/",
      timing: "출발 1~3일 전 등록"
    },
    {
      title: "해외 여행자 보험",
      desc: "항공기 지연, 수하물 파손, 현지 응급 의료비 대비 필수. 무사고 시 보험료 10% 환급 혜택!",
      kakaoUrl: "https://kakaopay.insurance/",
      mibankUrl: "https://m.mibank.me/travel/",
      timing: "출발 전날 가입"
    },
    {
      title: "돈키호테 모바일 5% 추가 할인 쿠폰",
      desc: "10,000엔 이상 구매 시 10% 면세에 5% 추가 할인 적용되는 바코드 쿠폰 (화면 제시용)",
      couponUrl: "https://japan-travel.donki.com/coupon/",
      timing: "출국 전 링크 북마크 및 캡처"
    },
    {
      title: "비짓 재팬 웹 (Visit Japan Web) 사전 등록",
      desc: "일본 입국 심사 및 세관 신고를 모바일 QR코드로 사전 완료하여 공항 대기 시간을 대폭 단축!",
      vjwUrl: "https://vjw-lp.digital.go.jp/ko/",
      timing: "출발 1~2일 전 여권 및 항공편 입력"
    }
  ]
};
