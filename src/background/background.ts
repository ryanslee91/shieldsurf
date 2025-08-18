import { logThreat } from "@utils/logger";
import { checkUrlSafety } from "../api/safeBrowsing";

let whiteList: string[] = [];

function setBadge(tabId: number, text: string, color: string) {
  chrome.action.setBadgeText({ text, tabId });
  chrome.action.setBadgeBackgroundColor({ color, tabId });
}

// 안전하게 메시지를 보내는 함수
function safeSendMessage(tabId: number, message: any) {
  chrome.tabs.sendMessage(tabId, message, (res) => {
    if (chrome.runtime.lastError) {
      console.warn(`⚠ 메시지 전송 실패(tabId: ${tabId}):`, chrome.runtime.lastError.message);
      return;
    }
    console.log("content 응답:", res);
  });
}

// content script 동적 주입 후 메시지 전송
function injectAndSend(tabId: number, message: any) {
  chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] }, () => {
    if (chrome.runtime.lastError) {
      console.warn("content script 주입 실패:", chrome.runtime.lastError.message);
      return;
    }
    safeSendMessage(tabId, message);
  });
}

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

// 페이지 로드 완료 시 검사
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    if (!/^https?:\/\//.test(tab.url)) {
      console.warn("비웹 URL 스킵:", tab.url);
      return;
    }

    const domain = new URL(tab.url).hostname;

    if (whiteList.includes(domain)) {
      setBadge(tabId, "SAFE", "#2ecc71");
      return;
    }

    console.log("🔍 URL 자동 검사:", tab.url);
    setBadge(tabId, "...", "gray");

    checkUrlSafety(tab.url)
      .then((result) => {
        if (result.safe === true) {
          setBadge(tabId, "SAFE", "#2ecc71");
        } else if (result.safe === false) {
          setBadge(tabId, "BAD", "#e74c3c");

          // 주입 후 경고 메시지 전송
          injectAndSend(tabId, { action: "showWarning", domain });

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

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "cancelNavigation" && sender.tab?.id) {
    console.log("사용자가 이동 취소:", message.domain);
    chrome.tabs.goBack(sender.tab.id, () => {
      if (chrome.runtime.lastError) {
        console.warn("이전 페이지 이동 실패:", chrome.runtime.lastError.message);
      }
    });
  }
});

// 다른 스크립트에서 직접 검사 요청 시
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CHECK_URL" && message.url) {
    if (!/^https?:\/\//.test(message.url)) {
      console.warn("비웹 URL 스킵(메시지):", message.url);
      sendResponse({ safe: null, error: "Non-web URL" });
      return;
    }

    if (message.action === "addToWhiteList") {
      if (!whiteList.includes(message.domain)) {
        whiteList.push(message.domain);
        chrome.storage.local.set({ whiteList });
      }
    }

    checkUrlSafety(message.url)
      .then((result) => sendResponse(result))
      .catch((error) => {
        console.error("API 호출 중 오류:", error);
        sendResponse({ safe: null, error });
      });

    return true; // 비동기 응답
  }
});