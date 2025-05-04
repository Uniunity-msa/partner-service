import apiKeys from './apiKey.js';

const loadKakaoMap = () => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) return resolve(); // 중복 방지

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKeys.KAKAO_API_KEY}&autoload=false`;
    script.onload = () => {
      kakao.maps.load(() => resolve());
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export default loadKakaoMap;