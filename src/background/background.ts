import { checkUrlSafety } from "../api/safeBrowsing";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CHECK_URL" && message.url) {
    console.log("🔍 URL 검사 요청:", message.url);

    checkUrlSafety(message.url)
      .then((result) => {
        sendResponse(result); // 검사 결과 contentScript로 반환
      })
      .catch((error) => {
        console.error("API 호출 중 오류:", error);
        sendResponse({ safe: null, error });
      });
    
    // return true를 안하면 리스너가 먼저 종료되 비동기 작업으로 진행되는 응답이 무시될수있음.
    return true; // async 응답 허용 (채널을 오픈 유지)
  }
});
