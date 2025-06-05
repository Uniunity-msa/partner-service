"use strict";
import loadKakaoMap from '/partner/js/kakaomapLoader.js';
import { apiUrl, baseUrls } from '/partner/js/apiUrl.js';

// 지도 전역변수 선언
let map;

//로그인(로그아웃), 회원가입(마이페이지)버튼
const loginStatusBtn = document.getElementById("loginStatusBtn");
const signUpBtn = document.getElementById("signUpBtn");
const navBar = document.getElementById("navbar");

let userInfo; // 유저정보
const userApiUrl = baseUrls.auth;

// 로그아웃 처리 함수
const handleLogout = async () => {
  try {
    const res = await fetch(`${baseUrls.auth}/logout`, {
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
  const res = await fetch(`${baseUrls.auth}/me`, {
    credentials: "include", // 쿠키 포함
  });
  if (res.ok == true){
    loginStatusBtn.innerText = "로그아웃"
    loginStatusBtn.removeAttribute("href"); // 기본 링크 제거
    loginStatusBtn.addEventListener("click", (e) => {
      e.preventDefault(); // 링크 동작 막기
      handleLogout();     // 로그아웃 요청
    });
    signUpBtn.setAttribute("href", `${baseUrls.postReaction}/mypage`);
    signUpBtn.innerText = "마이페이지"
  } else {
    loginStatusBtn.setAttribute("href", `${baseUrls.auth}/login`);
    loginStatusBtn.innerText = "로그인"
    signUpBtn.setAttribute("href", `${baseUrls.user}/signup/agreement`);
    signUpBtn.innerText = "회원가입"
  }
  const data = await res.json();
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
    map = new kakao.maps.Map(container, options);
  } catch (error) {
    console.error("Kakao 지도 로딩 실패:", error);
  }
});
// ===========================================================================================

// university_url 값을 받아오는 함수
function getUniversityUrl() {
  const url = new URL(window.location.href);
  const universityUrl = url.pathname.split('/').pop();
  return universityUrl;
}

// ********* HTML에 표시될 가게 정보 ********* //
const storeName = document.querySelector('#storeName'),
  storeAdr = document.querySelector('#storeAdr'),
  partnerContent = document.querySelector('#partnerContent'),
  eventDate = document.querySelector('#eventDate');
const storeInfoTextBox = document.querySelectorAll(".storeInfoTextBox"),
  searchBtn = document.querySelector('#serchBtn'),
  partnerMapSerch = document.querySelector("#partnerMapSerch");
const universityName = document.getElementById("universityName");
let center;
let stores = [];
let positions = [];


function setCenter(map, latitude, longitude) {
  // 이동할 위도 경도 위치를 생성합니다
  var moveLatLon = new kakao.maps.LatLng(latitude, longitude);

  // 지도 중심을 이동 시킵니다
  map.setCenter(moveLatLon);
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
      universityName.textContent = res;
    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

function partnerLoad() {
  const universityUrl = getUniversityUrl();
  const req = {
    university_url: universityUrl,
  };
  fetch(`${apiUrl}/getPartner`, {
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
      center = []; // center 배열 초기화
      center.push(res[0]);
      setCenter(map, parseFloat(center[0].latitudeUni), parseFloat(center[0].longitudeUni));
      // 새로운 객체 생성
      for (let i = 1; i < res.length; i++) {
        const startDate = new Date(res[i].start_period);
        const endDate = new Date(res[i].end_period);
        const now = new Date();
        // 제휴 종료일자가 오늘보다 이후인 경우에만 표시
        if (endDate >= now) {
            const obj = {
            storeID: res[i].partner_id,
            storeName: res[i].partner_name,
            store_location: res[i].address,
            university_id: res[i].university_id,
            content: res[i].content,
            // 날짜를 YYYY-MM-DD 형식으로 포맷
            startDate: startDate.toISOString().slice(0, 10),
            endDate: endDate.toISOString().slice(0, 10),
          };
          stores.push(obj);
          positions.push(new kakao.maps.LatLng(parseFloat(res[i].latitude), parseFloat(res[i].longitude)));
        }
      };
      for (let i = 0; i < positions.length; i++) {
        // 마커를 생성합니다
        let marker = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: positions[i] // 마커의 위치
        });
        // 목록에 동적으로 추가
        const li = document.createElement("li");
        li.setAttribute('id', stores[i].storeName);
        const textNode = document.createTextNode(stores[i].storeName);
        li.appendChild(textNode);
        document.getElementById('storeList').appendChild(li);
        // 마커 click, mouseover, mouseout 시에 이벤트 발생
        kakao.maps.event.addListener(marker, 'click', function () {
          for (let j = 0; j < storeInfoTextBox.length; j++) {
            storeInfoTextBox[j].style.display = "block";
          }
          storeName.innerHTML = stores[i].storeName;
          storeAdr.innerHTML = stores[i].store_location;
          partnerContent.innerHTML = stores[i].content;
          eventDate.innerHTML = stores[i].startDate + " ~ " + stores[i].endDate;
        });
        li.addEventListener('click', function () {
          for (let j = 0; j < storeInfoTextBox.length; j++) {
            storeInfoTextBox[j].style.display = "block";
          }
          storeName.innerHTML = stores[i].storeName;
          storeAdr.innerHTML = stores[i].store_location;
          partnerContent.innerHTML = stores[i].content;
          eventDate.innerHTML = stores[i].startDate + " ~ " + stores[i].endDate;
        })
      }
    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}

// 현재 URL의 경로 일부 가져오기 (partner 뒤의 학교 이름 추출함)
function getDynamicValueFromURL() {
  var path = window.location.pathname;
  var regex = /\/partner\/([a-zA-Z]+)/; // /partner/ 다음에 있는 영어 문자열을 추출하는 정규식
  var matches = path.match(regex);
  if (matches && matches.length > 1) {
    return matches[1];
  } else {
    return null;
  }
}

// 새로운 url 만들기
function generateDynamicURL(linkId, userschool) {
  var dynamicValue;
  var url;

  // linkId에 따라 동적 값을 할당하는 로직을 구현합니다.
  if (linkId === "retailer") {
    dynamicValue = userschool;
    url = baseUrls.retailer;
  } else if (linkId === "partner") {
    dynamicValue = userschool;
    url = apiUrl;
  } else if (linkId === "more_news") {
    dynamicValue = "all/" + userschool;
    url = baseUrls.post;
  } else if (linkId === "news") {
    dynamicValue = "all/" + userschool;
    url = baseUrls.post;
  } else if (linkId === "council") {
    dynamicValue = userschool;
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
  partnerLoad();
  loadloginData();
  updateDynamicLinks();
});