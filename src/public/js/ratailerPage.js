"use strict";
import apiKeys from '/partner/js/apiKey.js';
import loadKakaoMap from '/partner/js/kakaomapLoader.js';
import { apiUrl, baseUrls } from '/partner/js/apiUrl.js';

// map을 전역 변수로 선언
let map;

const storeName = document.querySelector('#storeName'),
      storeAdr = document.querySelector('#storeAdr'),
      storeClass = document.querySelector('#storeClass'),
      storeItem = document.querySelector('#storeItem');
const storeInfoTextBox = document.querySelectorAll(".storeInfoTextBox");
const universityName = document.getElementById("universityName");
const loginBtn = document.getElementById("loginStatusBtn"),
      signUpBtn = document.getElementById("signUpBtn");
const loginNameBox = document.getElementById("loginNameBox");

let userInfo; // 유저정보

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
    signUpBtn.setAttribute("href", `${baseUrls.user}/agreement`);
    signUpBtn.innerText = "회원가입"
  }
  const data = await res.json();
  userInfo = data; 
};

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
      universityName.textContent = res;
    })
    .catch((error) => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}


function setCenter(map,latitude,longitude){            
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

const serviceKey = apiKeys.SERVICE_KEY;
const endPoint = apiKeys.ENDPOINT;

document.addEventListener("DOMContentLoaded", () => {
    loadKakaoMap().then(() => {
      const container = document.getElementById('map');
      if (!container) return console.error('#map 요소가 없습니다.');
  
      map = new kakao.maps.Map(container, {
        center: new kakao.maps.LatLng(37.59169598260442, 127.02220971655647), // 초기 위치
        level: 3
      });
      
      centerChange();
      // bounds_changed 이벤트 등록
      kakao.maps.event.addListener(map, 'bounds_changed', () => {
        const bounds = map.getBounds();
        const swLatlng = bounds.getSouthWest();
        const neLatlng = bounds.getNorthEast();
  
        const minx = swLatlng.La.toString();
        const miny = swLatlng.Ma.toString();
        const maxx = neLatlng.La.toString();
        const maxy = neLatlng.Ma.toString();
  
        const url = `${endPoint}storeListInRectangle?serviceKey=${serviceKey}&pageNo=1&numOfRows=10&minx=${minx}&miny=${miny}&maxx=${maxx}&maxy=${maxy}&type=json`;
  
        const stores = [];
        const positions = [];
  
        fetch(url)
          .then(res => res.json())
          .then(res => {
            for (let i = 0; i < res.body.items.length; i++) {
              const item = res.body.items[i];
              stores.push({
                storeName: item.bizesNm,
                store_location: item.rdnmAdr,
                storeClass: item.indsLclsNm,
                storeItem: item.indsSclsNm,
                ksicNm: item.ksicNm
              });
              positions.push(new kakao.maps.LatLng(item.lat, item.lon));
            }
  
            for (let i = 0; i < positions.length; i++) {
              const marker = new kakao.maps.Marker({
                map: map,
                position: positions[i]
              });
  
              kakao.maps.event.addListener(marker, 'click', () => {
                for (let i = 0; i < storeInfoTextBox.length; i++) {
                  storeInfoTextBox[i].style.display = "block";
                }
                storeName.innerHTML = stores[i].storeName;
                storeAdr.innerHTML = stores[i].store_location;
                storeClass.innerHTML = `${stores[i].storeClass} ${stores[i].storeItem}`;
                storeItem.innerHTML = stores[i].ksicNm;
              });
            }
          })
          .catch(err => {
            console.error("API 요청 실패", err);
          });
      });
    }).catch((err) => {
      console.error("Kakao Map 로드 실패", err);
    });
  });


function retailerLoad(){
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


// 현재 URL의 경로 일부 가져오기 (retailer 뒤의 학교 이름 추출함)
function getDynamicValueFromURL() {
    var path = window.location.pathname;
    var regex = /\/retailer\/([a-zA-Z]+)/; // /partner/ 다음에 있는 영어 문자열을 추출하는 정규식
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
    
    universityName.addEventListener("click",function(){
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

window.addEventListener('load',function(){
    getUniversityName();
    retailerLoad();
    loadloginData();
    updateDynamicLinks();
});