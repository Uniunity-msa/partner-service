"use strict";
import loadKakaoMap from '/js/kakaomapLoader.js';
import { apiUrl } from '/js/apiUrl.js';

let userInfo; // 유저정보
const userApiUrl = "http://34.47.84.123:3004";

// 작성자 회원 정보 불러오기
const loadloginData = async () => {
  const res = await fetch(`${userApiUrl}/auth/me`, {
    credentials: "include", // 쿠키 포함
  });
  
  console.log("🔍 응답 상태:", res.status); // 200, 401 등
  console.log("🔍 응답 OK 여부:", res.ok);

  if (!res.ok) {
    alert("로그인이 필요합니다.");
    return;
  }
  const data = await res.json();
  console.log("✅ 받아온 유저 정보:", data); // 실제 유저 정보 로그
  userInfo = data; 
};

// 기본 좌표 저징 지도 코드
// ===========================================================================================
document.addEventListener("DOMContentLoaded", async () => {
    try {
      await loadKakaoMap(); // kakao SDK 로드 및 초기화
      const container = document.getElementById('map');
      const options = {
        center: new kakao.maps.LatLng(37.59169598260442, 127.02220971655647), // 서울 중심
        level: 3
      };
      const map = new kakao.maps.Map(container, options);
    } catch (error) {
      console.error("Kakao 지도 로딩 실패:", error);
    }
  });
// ===========================================================================================

const storeUploadBtn = document.querySelector('#uploadBtn'),
      BtnAddr = document.querySelector('#serchBtnAddr'),
      BtnContent = document.querySelector('#serchBtnContent');
const storeName = document.querySelector('#storeName'),
      store_location = document.querySelector('#store_location'),
      content = document.querySelector('#content'),
      startDate = document.querySelector('#startDate'),
      endDate = document.querySelector('#endDate');
var getlatitude, getlongitude;
const universityName = document.getElementById("universityName");

// university_url 값을 받아오는 함수
function getUniversityUrl() {
  const url = new URL(window.location.href);
  const universityUrl = url.pathname.split('/').pop();
  return universityUrl;
}

function getUniversityName() {
  const universityUrl = getUniversityUrl();
  const req = {
    university_url: universityUrl
  };
  fetch(`${apiUrl}/getUniversityName`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(res => {
      console.log(res);
      // Uniname.push(res);
      console.log(res);
      universityName.textContent = res;
    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

function setCenter(map,latitude,longitude) {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = new kakao.maps.LatLng(latitude,longitude);

    // 지도 중심을 이동 시킵니다
    map.setCenter(moveLatLon);
}

// 학교별로 중심좌표 이동시키기
function centerChange(){
    const universityUrl = getUniversityUrl();
    const req = {
        university_url:universityUrl
    };

    fetch(`${apiUrl}/getUniversityLocation`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    }).then((res) => res.json())
    .then(res => {
        console.log(res);
        setCenter(map,parseFloat(res.latitude),parseFloat(res.longitude));
    })
}

document.addEventListener('DOMContentLoaded', () => {
    loadKakaoMap()
      .then(() => {
        const container = document.getElementById('map');
        const options = {
          center: new kakao.maps.LatLng(37.59169598260442, 127.02220971655647), // 초기 중심 좌표
          level: 3
        };
        map = new kakao.maps.Map(container, options);
        // 지도 중심값 변경하기
        centerChange();
        const geocoder = new kakao.maps.services.Geocoder();
  
        BtnAddr.addEventListener('click', function () {
          const address = store_location.value;
  
          geocoder.addressSearch(address, function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
              const lat = parseFloat(result[0].y);
              const lng = parseFloat(result[0].x);
              const coords = new kakao.maps.LatLng(lat, lng);
  
              // 기존 마커가 있으면 제거
              if (marker) marker.setMap(null);
  
              // 새 마커 생성 및 지도에 표시
              marker = new kakao.maps.Marker({
                map: map,
                position: coords
              });
  
              // 지도 중심 이동
              map.setCenter(coords);
            } else {
              console.error('주소 검색 실패:', status);
            }
          });
        });
      })
      .catch((err) => {
        console.error('Kakao Map 로드 실패', err);
      });
  });


function updateStore(){
    const universityUrl = getUniversityUrl();
    const req = {
        partner_name: partner_name.value,
        address: store_location.value,
        latitude: getlatitude,
        longitude: getlongitude,
        content: content.value,
        start_period: start_period.value,
        end_period: end_period.value,
        university_url: universityUrl
    };

    fetch(`${apiUrl}/uploadPartner`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
    .then((res) => res.json())
    .then(res => {
        console.log(res);
    })
}

window.addEventListener('load', function () {
  getUniversityName();
  loadloginData();
});

window.addEventListener('DOMContentLoaded', centerChange); // 이건 '제휴 가게 등록하기' 버튼 클릭 시 함수 실행으로 추후에 변경하기
storeUploadBtn.addEventListener('click',updateStore);