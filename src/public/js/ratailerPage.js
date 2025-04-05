var stores = [];
var positions = [];
var Uniname = [];

const storeName = document.querySelector('#storeName'),
      storeAdr = document.querySelector('#storeAdr'),
      storeClass = document.querySelector('#storeClass'),
      storeItem = document.querySelector('#storeItem');
const storeInfoTextBox = document.querySelectorAll(".storeInfoTextBox");
const universityName = document.getElementById("universityName");

// 고정 지도 코드
// ===========================================================================================
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(37.59169598260442, 127.02220971655647),
      level: 3
    };
    const map = new kakao.maps.Map(container, options);
  });
// ===========================================================================================

// university_url 값을 받아오는 함수
function getUniversityUrl() {
    const url = new URL(window.location.href);
    const universityUrl = url.pathname.split('/').pop();
    return universityUrl;
}

function setCenter(map,latitude,longitude){            
    // 이동할 위도 경도 위치를 생성합니다 
    var moveLatLon = new kakao.maps.LatLng(latitude,longitude);
                    
    // 지도 중심을 이동 시킵니다
    map.setCenter(moveLatLon);
}


// 지도가 이동, 확대, 축소로 인해 지도영역이 변경되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'bounds_changed', function() {             
                
    // 지도 영역정보를 얻어옵니다 
    var bounds = map.getBounds();
    
    // 영역정보의 남서쪽 정보를 얻어옵니다 
    // swLatlng.La = 서쪽 경도좌표값 = minx
    // swLatlng.Ma = 남쪽 경도좌표값 = miny
    var swLatlng = bounds.getSouthWest();
    var minx = swLatlng.La.toString(),
        miny = swLatlng.Ma.toString();

    // 영역정보의 북동쪽 정보를 얻어옵니다 
    // neLatlng.La = 동쪽 경도좌표값 = maxx
    // neLatlng.Ma = 북쪽 경도좌표값 = maxy
    var neLatlng = bounds.getNorthEast();
    var maxx = neLatlng.La.toString(),
        maxy = neLatlng.Ma.toString();

    var url = endPoint + 'storeListInRectangle' + '?serviceKey=' + serviceKey + '&pageNo=1' + '&numOfRows=10' + 
            '&minx=' + minx + '&miny=' + miny + '&maxx=' + maxx + '&maxy=' + maxy + '&type=json';
    fetch(url)
    .then((res) => res.json())
    .then(res => {
        for(let i = 0; i < res.body.items.length; i++){
            const obj = {
                storeName: res.body.items[i].bizesNm,
                store_location: res.body.items[i].rdnmAdr,
                storeClass: res.body.items[i].indsLclsNm,
                storeItem: res.body.items[i].indsSclsNm,
                ksicNm: res.body.items[i].ksicNm
            };
            stores.push(obj);
            positions.push(new kakao.maps.LatLng(res.body.items[i].lat,res.body.items[i].lon));
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });
    for (let i = 0; i < positions.length; i ++) {
        // 마커를 생성합니다
        let marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i] // 마커의 위치
        });
        // 마커 click, mouseover, mouseout 시에 이벤트 발생
        kakao.maps.event.addListener(marker, 'click', function(){
            for(let i = 0; i < storeInfoTextBox.length; i++){
                storeInfoTextBox[i].style.display = "block";
            }
            storeName.innerHTML = stores[i].storeName;
            storeAdr.innerHTML = stores[i].store_location;
            storeClass.innerHTML = stores[i].storeClass + " " + stores[i].storeItem;
            storeItem.innerHTML = stores[i].ksicNm;
        });
    }
});

// 분류 목록 별로 버튼 이벤트

var storeAll = [],
    positionAll = [];
var storeFood = [],
    positionFood = [];
var storeCafe = [],
    positionCafe = [];

const storeKind_all = document.querySelector('#storeKind_all'),
      storeKind_food = document.querySelector('#storeKind_food'),
      storeKind_cafe = document.querySelector('#storeKind_cafe');

// 기본 로드 함수와 동일
function kindAllEvent(){
    kakao.maps.event.addListener(map, 'bounds_changed', function() {             
                
        // 지도 영역정보를 얻어옵니다 
        var bounds = map.getBounds();
        
        // 영역정보의 남서쪽 정보를 얻어옵니다 
        // swLatlng.La = 서쪽 경도좌표값 = minx
        // swLatlng.Ma = 남쪽 경도좌표값 = miny
        var swLatlng = bounds.getSouthWest();
        var minx = swLatlng.La.toString(),
            miny = swLatlng.Ma.toString();
    
        // 영역정보의 북동쪽 정보를 얻어옵니다 
        // neLatlng.La = 동쪽 경도좌표값 = maxx
        // neLatlng.Ma = 북쪽 경도좌표값 = maxy
        var neLatlng = bounds.getNorthEast();
        var maxx = neLatlng.La.toString(),
            maxy = neLatlng.Ma.toString();
    
        var url = endPoint + 'storeListInRectangle' + '?serviceKey=' + serviceKey + '&pageNo=1' + '&numOfRows=10' + 
                '&minx=' + minx + '&miny=' + miny + '&maxx=' + maxx + '&maxy=' + maxy + '&type=json';
        fetch(url)
        .then((res) => res.json())
        .then(res => {
            for(let i = 0; i < res.body.items.length; i++){
                const obj = {
                    storeName: res.body.items[i].bizesNm,
                    store_location: res.body.items[i].rdnmAdr,
                    storeClass: res.body.items[i].indsLclsNm,
                    storeItem: res.body.items[i].indsSclsNm,
                    ksicNm: res.body.items[i].ksicNm
                };
                storeAll.push(obj);
                positionAll.push(new kakao.maps.LatLng(res.body.items[i].lat,res.body.items[i].lon));
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });
        for (let i = 0; i < positionAll.length; i ++) {
            // 마커를 생성합니다
            let marker = new kakao.maps.Marker({
                map: map, // 마커를 표시할 지도
                position: positionAll[i] // 마커의 위치
            });
            // 마커 click, mouseover, mouseout 시에 이벤트 발생
            kakao.maps.event.addListener(marker, 'click', function(){
                for(let i = 0; i < storeInfoTextBox.length; i++){
                    storeInfoTextBox[i].style.display = "block";
                }
                storeName.innerHTML = storeAll[i].storeName;
                storeAdr.innerHTML = storeAll[i].store_location;
                storeClass.innerHTML = storeAll[i].storeClass + " " + storeAll[i].storeItem;
                storeItem.innerHTML = storeAll[i].ksicNm;
            });
        }
    });
}

// storeKind_all.addEventListener('click', kindAllEvent);

function kindFoodEvent(){
    kakao.maps.event.addListener(map, 'bounds_changed', function() {             
                
        // 지도 영역정보를 얻어옵니다 
        var bounds = map.getBounds();
        
        // 영역정보의 남서쪽 정보를 얻어옵니다 
        // swLatlng.La = 서쪽 경도좌표값 = minx
        // swLatlng.Ma = 남쪽 경도좌표값 = miny
        var swLatlng = bounds.getSouthWest();
        var minx = swLatlng.La.toString(),
            miny = swLatlng.Ma.toString();
    
        // 영역정보의 북동쪽 정보를 얻어옵니다 
        // neLatlng.La = 동쪽 경도좌표값 = maxx
        // neLatlng.Ma = 북쪽 경도좌표값 = maxy
        var neLatlng = bounds.getNorthEast();
        var maxx = neLatlng.La.toString(),
            maxy = neLatlng.Ma.toString();
    
        var url = endPoint + 'storeListInRectangle' + '?serviceKey=' + serviceKey + '&pageNo=1' + '&numOfRows=10' + 
                '&minx=' + minx + '&miny=' + miny + '&maxx=' + maxx + '&maxy=' + maxy + '&type=json';
        fetch(url)
        .then((res) => res.json())
        .then(res => {
            for(let i = 0; i < res.body.items.length; i++){
                if((res.body.items[i].indsLclsCd == 'I2') && (res.body.items[i].indsMclsCd != 'I212')){
                    const obj = {
                        storeName: res.body.items[i].bizesNm,
                        store_location: res.body.items[i].rdnmAdr,
                        storeClass: res.body.items[i].indsLclsNm,
                        storeItem: res.body.items[i].indsSclsNm,
                        ksicNm: res.body.items[i].ksicNm
                    };
                    storeFood.push(obj);
                    positionFood.push(new kakao.maps.LatLng(res.body.items[i].lat,res.body.items[i].lon));
                }
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });
        for (let i = 0; i < positionFood.length; i ++) {
            // 마커를 생성합니다
            let marker = new kakao.maps.Marker({
                map: map, // 마커를 표시할 지도
                position: positionFood[i] // 마커의 위치
            });
            // 마커 click, mouseover, mouseout 시에 이벤트 발생
            kakao.maps.event.addListener(marker, 'click', function(){
                for(let i = 0; i < storeInfoTextBox.length; i++){
                    storeInfoTextBox[i].style.display = "block";
                }
                storeName.innerHTML = storeFood[i].storeName;
                storeAdr.innerHTML = storeFood[i].store_location;
                storeClass.innerHTML = storeFood[i].storeClass + " " + storeFood[i].storeItem;
                storeItem.innerHTML = storeFood[i].ksicNm;
            });
        }
    });
}

// storeKind_food.addEventListener('click', kindFoodEvent);

function kindCafeEvent(){
    kakao.maps.event.addListener(map, 'bounds_changed', function() {             
                
        // 지도 영역정보를 얻어옵니다 
        var bounds = map.getBounds();
        
        // 영역정보의 남서쪽 정보를 얻어옵니다 
        // swLatlng.La = 서쪽 경도좌표값 = minx
        // swLatlng.Ma = 남쪽 경도좌표값 = miny
        var swLatlng = bounds.getSouthWest();
        var minx = swLatlng.La.toString(),
            miny = swLatlng.Ma.toString();
    
        // 영역정보의 북동쪽 정보를 얻어옵니다 
        // neLatlng.La = 동쪽 경도좌표값 = maxx
        // neLatlng.Ma = 북쪽 경도좌표값 = maxy
        var neLatlng = bounds.getNorthEast();
        var maxx = neLatlng.La.toString(),
            maxy = neLatlng.Ma.toString();
    
        var url = endPoint + 'storeListInRectangle' + '?serviceKey=' + serviceKey + '&pageNo=1' + '&numOfRows=10' + 
                '&minx=' + minx + '&miny=' + miny + '&maxx=' + maxx + '&maxy=' + maxy + '&type=json';
        fetch(url)
        .then((res) => res.json())
        .then(res => {
            for(let i = 0; i < res.body.items.length; i++){
                if(res.body.items[i].indsMclsCd != 'I212'){
                    const obj = {
                        storeName: res.body.items[i].bizesNm,
                        store_location: res.body.items[i].rdnmAdr,
                        storeClass: res.body.items[i].indsLclsNm,
                        storeItem: res.body.items[i].indsSclsNm,
                        ksicNm: res.body.items[i].ksicNm
                    };
                    storeCafe.push(obj);
                    positionCafe.push(new kakao.maps.LatLng(res.body.items[i].lat,res.body.items[i].lon));
                }
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });
        for (let i = 0; i < positionCafe.length; i ++) {
            // 마커를 생성합니다
            let marker = new kakao.maps.Marker({
                map: map, // 마커를 표시할 지도
                position: positionCafe[i] // 마커의 위치
            });
            // 마커 click, mouseover, mouseout 시에 이벤트 발생
            kakao.maps.event.addListener(marker, 'click', function(){
                for(let i = 0; i < storeInfoTextBox.length; i++){
                    storeInfoTextBox[i].style.display = "block";
                }
                storeName.innerHTML = storeCafe[i].storeName;
                storeAdr.innerHTML = storeCafe[i].store_location;
                storeClass.innerHTML = storeCafe[i].storeClass + " " + storeCafe[i].storeItem;
                storeItem.innerHTML = storeCafe[i].ksicNm;
            });
        }
    });
}

// storeKind_cafe.addEventListener('click', kindCafeEvent);

// 검색 기능
const retailerMapSerch = document.querySelector('#retailerMapSerch'),
      searchBtn = document.querySelector('#serchBtn');

function search(){
    const universityUrl = getUniversityUrl();
    const req = {
        university_url:universityUrl
    };
    fetch(`${apiUrl}/getUniversityLocation`)
    .then((res) => res.json())
    .then(res => {

    })
    .catch(error => {
        console.log('Error:', error);
    });
    var cx, cy;
    var url = endPoint + 'storeZoneInRadius' + '?serviceKey=' + serviceKey + '&radius=' + '2000' + '&cx=' + cx + '&cy=' + cy + '&type=json';
}

// searchBtn.addEventListener('click', search);

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

window.addEventListener('load',function(){
    getUniversityName();
    updateDynamicLinks();
    loadloginData();
    retailerLoad();
});


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

    // linkId에 따라 동적 값을 할당하는 로직을 구현합니다.
    if (linkId === "retailer") {
        dynamicValue = "retailer/" + userschool;
      } else if (linkId === "partner") {
        dynamicValue = "partner/" + userschool;
      } else if (linkId === "more_news") {
        dynamicValue = "showPostListAll/" + userschool;
      } else if (linkId === "news") {
        dynamicValue = "showPostListAll/" + userschool;
      } else if(linkId==="council"){
        dynamicValue = "council/" + userschool;
      }

    return `${apiUrl}/` + dynamicValue;
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

