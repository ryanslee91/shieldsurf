import { DangerLog } from "../types";

export function logThreat(url: string) {
  // 1) 웹(HTTP/HTTPS) URL만 허용
  if (!/^https?:\/\//.test(url)) {
    console.warn("비웹 URL 무시:", url);
    return;
  }

  // 2) 필터링된 URL만 로깅
  const newLog: DangerLog = {
    time: new Date().toISOString(),
    url,
  };

  chrome.storage.local.get({ dangerLogs: [] }, (data) => {
    const updated = [...data.dangerLogs, newLog];
    chrome.storage.local.set({ dangerLogs: updated }, () => {
      console.log("💾 로그 저장됨:", newLog);
    });
  });
}

