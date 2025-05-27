"use strict";
import loadKakaoMap from '/js/kakaomapLoader.js';
import { apiUrl } from '/js/apiUrl.js';
import { baseUrls } from './apiUrl.js';

let userInfo; // 유저정보
const userApiUrl = baseUrls.user;

// 로그아웃 처리 함수
const handleLogout = async () => {
  try {
    const res = await fetch(`${userApiUrl}/auth/logout`, {
      method: "POST",
      credentials: "include"
    });

    if (res.ok) {
      // 로그아웃 성공 시 페이지 새로고침
      window.location.reload(); // 또는 window.location.href = "/";
    } else {
      const data = await res.json();
      alert(data.message || "로그아웃에 실패했습니다.");
    }
  } catch (err) {
    console.error("로그아웃 요청 중 오류 발생:", err);
    alert("서버 오류로 로그아웃에 실패했습니다.");
  }
};

// 작성자 회원 정보 불러오기
const loadloginData = async () => {
  const res = await fetch(`${userApiUrl}/auth/me`, {
    credentials: "include", // 쿠키 포함
  });
  if (res.ok == true){
    console.log("로그인 된 상태");
    loginStatusBtn.innerText = "로그아웃"
    loginStatusBtn.removeAttribute("href"); // 기본 링크 제거
    loginStatusBtn.addEventListener("click", (e) => {
      e.preventDefault(); // 링크 동작 막기
      handleLogout();     // 로그아웃 요청
    });
    signUpBtn.setAttribute("href", `${userApiUrl}/mypage`);
    signUpBtn.innerText = "마이페이지"
  } else {
    console.log("로그아웃 된 상태");
    loginStatusBtn.setAttribute("href", `${userApiUrl}/login`);
    loginStatusBtn.innerText = "로그인"
    signUpBtn.setAttribute("href", `${userApiUrl}/signup/agreement`);
    signUpBtn.innerText = "회원가입"
  }
  const data = await res.json();
  userInfo = data; 
};

const storeUploadBtn = document.querySelector('#uploadBtn'),
      BtnAddr = document.querySelector('#searchBtnAddr'),
      BtnContent = document.querySelector('#serchBtnContent');
const storeName = document.querySelector('#storeName'),
      store_location = document.querySelector('#store_location'),
      content = document.querySelector('#content'),
      startDate = document.querySelector('#startDate'),
      endDate = document.querySelector('#endDate');
var getlatitude, getlongitude;
const universityName = document.getElementById("universityName");

// map을 전역 변수로 선언
let map;
let marker;

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
        setCenter(map, parseFloat(res.latitude), parseFloat(res.longitude));
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
        centerChange();
        const geocoder = new kakao.maps.services.Geocoder();
        BtnAddr.addEventListener('click', function () {
          const address = store_location.value;
  
          geocoder.addressSearch(address, function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
              const lat = parseFloat(result[0].y);
              const lng = parseFloat(result[0].x);
              const coords = new kakao.maps.LatLng(lat, lng);
              getlatitude = result[0].y;
              getlongitude = result[0].x;
  
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
    console.log(req);
    fetch(`${apiUrl}/uploadPartner`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
    })
    .then((res) => res.json())
    .then((res) => {
        // 성공적으로 처리되었는지 확인 (예: success: true 여부)
        if (res && res.success !== false) {
            // 페이지 이동
            window.location.href = `${apiUrl}/partner/${universityUrl}`;
        } else {
            console.error('업로드 실패:', res.msg || '알 수 없는 오류');
            alert("업로드에 실패했습니다.");
        }
    })
    .catch((err) => {
        console.error('updateStore 실패', err);
        alert("업로드에 실패했습니다.");
    });
}
storeUploadBtn.addEventListener('click',updateStore);

// 새로운 url 만들기
function generateDynamicURL(linkId, userschool) {
  var dynamicValue;
  var url;

  // linkId에 따라 동적 값을 할당하는 로직을 구현합니다.
  if (linkId === "retailer") {
    dynamicValue = "retailer/" + userschool;
    url = apiUrl;
  } else if (linkId === "partner") {
    dynamicValue = "partner/" + userschool;
    url = apiUrl;
  } else if (linkId === "more_news") {
    dynamicValue = "showPostListAll/" + userschool;
    url = baseUrls.post;
  } else if (linkId === "news") {
    dynamicValue = "showPostListAll/" + userschool;
    url = baseUrls.post;
  } else if (linkId === "council") {
    dynamicValue = "council/" + userschool;
    url = baseUrls.council;
  }

  return `${url}/` + dynamicValue;
}


// 새로운 url로 업데이트
async function updateDynamicLinks() {
  var userschool = getDynamicValueFromURL();
  if (!userschool) {
    console.log("영어 문자열이 URL에서 추출되지 않았습니다.");
    return;
  }
  var link1 = document.getElementById("main_retailer");
  var link2 = document.getElementById("partner");
  var link3 = document.getElementById("news");

  universityName.addEventListener("click", function () {
    var link = generateDynamicURL("council", userschool);
    window.location.href = link;
  })
  link1.addEventListener("click", function () {
    // 버튼을 클릭하면 이동할 링크 주소를 설정하세요.
    var link = generateDynamicURL("retailer", userschool);
    window.location.href = link;
  });

  link2.addEventListener("click", function () {
    // 버튼을 클릭하면 이동할 링크 주소를 설정하세요.
    var link = generateDynamicURL("partner", userschool);
    window.location.href = link;
  });

  link3.addEventListener("click", function () {
    // 버튼을 클릭하면 이동할 링크 주소를 설정하세요.
    var link = generateDynamicURL("news", userschool);
    window.location.href = link;
  });

}


window.addEventListener('load', function () {
  getUniversityName();
  loadloginData();
  loadloginData();
  updateDynamicLinks();
});
