// 현재 페이지 URL 가져오기
const currentUrl = window.location.href;

// 백그라운드로 검사 요청 보내기
chrome.runtime.sendMessage(
  { type: "CHECK_URL", url: currentUrl },
  (response) => {
    if (!response) return;

    if (response.safe === false) {
      // DOM에 경고 배너 삽입
      const warningBanner = document.createElement("div");
      warningBanner.innerText = "⚠️ 이 사이트는 안전하지 않을 수 있습니다";
      warningBanner.style.position = "fixed";
      warningBanner.style.top = "0";
      warningBanner.style.left = "0";
      warningBanner.style.width = "100%";
      warningBanner.style.backgroundColor = "red";
      warningBanner.style.color = "white";
      warningBanner.style.fontSize = "16px";
      warningBanner.style.fontWeight = "bold";
      warningBanner.style.textAlign = "center";
      warningBanner.style.padding = "10px";
      warningBanner.style.zIndex = "9999";
      document.body.prepend(warningBanner);
    } else if (response.safe === true) {
      console.log("✅ 안전한 사이트");
    } else {
      console.warn("⚠️ URL 안전성 확인 불가", response.error);
    }
  }
);
