import { logThreat } from "@utils/logger";
import { checkUrlSafety } from "../api/safeBrowsing";

// 공통 배지 스타일 설정 함수
function setBadge(tabId: number, text: string, color: string) {
  chrome.action.setBadgeText({ text, tabId });
  chrome.action.setBadgeBackgroundColor({ color, tabId });
}

chrome.action.onClicked.addListener(() => {
  console.log("toolbar icon clicked");
  chrome.runtime.openOptionsPage();
});


// 페이지 로드 완료 시 자동 검사
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
     const url = tab.url;
    // HTTP/HTTPS URL만 검사
   if (!url.startsWith("http://") && !url.startsWith("https://")) {
      console.warn("비웹 URL 스킵:", url);
      return;
    }

    console.log("🔍 URL 자동 검사:", tab.url);

    // 검사 중 표시
    setBadge(tabId, "...", "gray");

    checkUrlSafety(tab.url)
      .then((result) => {
        console.log('API response: ', result);
        if (result.safe === true) {
          setBadge(tabId, "SAFE", "#2ecc71"); // 초록
        } else if (result.safe === false) {
          setBadge(tabId, "BAD", "#e74c3c"); // 빨강
          chrome.notifications.create({
            type: "basic",
            iconUrl: "icons/icon128.png",
            title: "⚠ 위험한 사이트 탐지",
            message: `현재 페이지: ${tab.url}`,
          });
          logThreat(tab.url!);
        } else {
          setBadge(tabId, "???", "gray");
        }
      })
      .catch((error) => {
        console.error("API 호출 오류:", error);
        setBadge(tabId, "ERR", "darkgray");
      });
  }
});

// 다른 스크립트에서 직접 검사 요청 시
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CHECK_URL" && message.url) {
    if (!message.url.startsWith("http://") && !message.url.startsWith("https://")) {
      console.warn("비웹 URL 스킵(메시지):", message.url);
      sendResponse({ safe: null, error: "Non-web URL" });
      return;
    }
    
    console.log("🔍 URL 검사 요청:", message.url);

    checkUrlSafety(message.url)
      .then((result) => {
        sendResponse(result);
      })
      .catch((error) => {
        console.error("API 호출 중 오류:", error);
        sendResponse({ safe: null, error });
      });

    return true; // async 응답 허용
  }
});
