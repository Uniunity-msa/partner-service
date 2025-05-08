"use strict";
import loadKakaoMap from '/js/kakaomapLoader.js';
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

// university_url 값을 받아오는 함수
function getUniversityUrl() {
    // 현재 페이지의 URL에서 경로(pathname) 부분을 추출
    const path = window.location.pathname;
  
    // 경로에서 universityUrl 값을 추출
    const pathParts = path.split('/');
    const universityUrl = pathParts[pathParts.length - 1];
    return universityUrl;
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
        setCenter(map,parseFloat(res.latitude),parseFloat(res.longitude));
    })
}

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

document.addEventListener('DOMContentLoaded', () => {
    loadKakaoMap()
      .then(() => {
        const container = document.getElementById('map');
        const options = {
          center: new kakao.maps.LatLng(37.59169598260442, 127.02220971655647), // 초기 중심 좌표
          level: 3
        };
        map = new kakao.maps.Map(container, options);
  
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

window.addEventListener('DOMContentLoaded', centerChange); // 이건 '제휴 가게 등록하기' 버튼 클릭 시 함수 실행으로 추후에 변경하기
storeUploadBtn.addEventListener('click',updateStore);