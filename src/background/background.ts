import { logThreat } from "@utils/logger";
import { checkUrlSafety } from "../api/safeBrowsing";

// ====== 상수 ======
const COLORS = {
  SAFE: "#2ecc71",
  BAD: "#e74c3c",
  GRAY: "gray",
  DARK_GRAY: "darkgray"
};

let whiteList: string[] = [];
let pendingRedirects: Record<number, { url: string; ruleId: number }> = {};

// ====== 초기 로드 ======
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("whiteList", (data) => {
    whiteList = data.whiteList || [];
  });
});

// ====== 공통 유틸 ======
function setBadge(tabId: number, text: string, color: string) {
  chrome.action.setBadgeText({ text, tabId });
  chrome.action.setBadgeBackgroundColor({ color, tabId });
}

function addToWhiteList(domain: string) {
  if (!whiteList.includes(domain)) {
    whiteList.push(domain);
    chrome.storage.local.set({ whiteList });
  }
}

async function addBlockRule(domain: string): Promise<number> {
  const ruleId = Math.floor(Date.now() % 1000000);
  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [{
      id: ruleId,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: `||${domain}`,
        resourceTypes: ["main_frame"]
      }
    }],
    removeRuleIds: []
  });
  return ruleId;
}

async function removeBlockRule(ruleId: number) {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [ruleId]
  });
}

function notifyUser(tabId: number, domain: string) {
  const notificationId = `block-${tabId}`;
  chrome.notifications.create(notificationId, {
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: "⚠ 위험한 사이트 차단됨",
    message: `${domain} 접속이 차단되었습니다.\n계속하시겠습니까?`,
    buttons: [
      { title: "계속하기" },
      { title: "취소" }
    ],
    requireInteraction: true
  });
}

// ====== 페이지 이동 감지 및 검사 ======
chrome.webNavigation.onBeforeNavigate.addListener(async ({ tabId, url, frameId }) => {
  if (frameId !== 0 || !/^https?:\/\//.test(url)) return;

  const domain = new URL(url).hostname;

  if (whiteList.includes(domain)) {
    setBadge(tabId, "SAFE", COLORS.SAFE);
    return;
  }

  setBadge(tabId, "...", COLORS.GRAY);

  try {
    const result = await checkUrlSafety(url);

    if (result.safe === true) {
      setBadge(tabId, "SAFE", COLORS.SAFE);
    } else if (result.safe === false) {
      setBadge(tabId, "BAD", COLORS.BAD);

      // 1. 차단 규칙 등록
      const ruleId = await addBlockRule(domain);
      pendingRedirects[tabId] = { url, ruleId };

      // 2. 경고 알림
      notifyUser(tabId, domain);

      // 3. 로그 저장
      logThreat(url);

      // 4. 안전한 페이지로 이동
      chrome.tabs.update(tabId, { url: "chrome://newtab" });
    } else {
      setBadge(tabId, "???", COLORS.GRAY);
    }
  } catch (err) {
    console.error("검사 오류:", err);
    setBadge(tabId, "ERR", COLORS.DARK_GRAY);
  }
});

// ====== 알림 버튼 클릭 처리 ======
chrome.notifications.onButtonClicked.addListener(async (notifId, btnIdx) => {
  const tabId = parseInt(notifId.replace("block-", ""));
  const redirectData = pendingRedirects[tabId];
  if (!redirectData) return;

  const { url, ruleId } = redirectData;
  const domain = new URL(url).hostname;

  if (btnIdx === 0) {
    // 계속하기 → 차단 해제 + 화이트리스트 등록 + 원래 URL로 이동
    await removeBlockRule(ruleId);
    addToWhiteList(domain);
    chrome.tabs.update(tabId, { url });
  } else {
    // 취소 → 이전 페이지 또는 새 탭
    chrome.tabs.goBack(tabId, () => {
      if (chrome.runtime.lastError) {
        chrome.tabs.update(tabId, { url: "chrome://newtab" });
      }
    });
  }

  delete pendingRedirects[tabId];
  chrome.notifications.clear(notifId);
});

chrome.declarativeNetRequest.getDynamicRules((rules) => {
  const ids = rules.map(r => r.id);
  if (ids.length) {
    chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ids });
  }
});

// ====== 메시지 처리 ======
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CHECK_URL" && message.url) {
    if (!/^https?:\/\//.test(message.url)) {
      sendResponse({ safe: null, error: "Non-web URL" });
      return;
    }

    if (message.action === "addToWhiteList" && message.domain) {
      addToWhiteList(message.domain);
    }

    checkUrlSafety(message.url)
      .then((result) => sendResponse(result))
      .catch((err) => sendResponse({ safe: null, error: err }));

    return true; // async response
  }
});

//clear whitelist
// when not used, comment  it
// function clearWhiteList() {
//   whiteList = [];
//   chrome.storage.local.set({ whiteList: [] });
//   console.log("Whitelist cleared.")
// }

// clearWhiteList();

// clearing blocked websites
// when not used, comment  it

// chrome.declarativeNetRequest.getDynamicRules((rules) => {
//   const ids = rules.map(r => r.id);
//   if (ids.length) {
//     chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ids });
//   }
// });



