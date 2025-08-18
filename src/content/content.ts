import { WarningMessage, WhiteListMessage } from "src/types";

chrome.runtime.onMessage.addListener(
  (message: WarningMessage | any, sender, sendResponse) => {
    if (message.action === "showWarning") {
      const proceed = window.confirm(
        `⚠ ${message.domain} 은(는) 위험할 수 있습니다.\n이동하시겠습니까?`
      );

      if (proceed) {
        const trust = window.confirm(
          `${message.domain}을(를) 신뢰 목록에 추가할까요?`
        );
        if (trust) {
          const addMsg: WhiteListMessage = {
            action: "addToWhiteList",
            domain: message.domain,
          };
          chrome.runtime.sendMessage(addMsg);
        }
        // 사용자가 이동 허용 시 실제 네비게이션 실행
        window.location.href = `https://${message.domain}`;
      } else {
          chrome.runtime.sendMessage({ action: "cancelNavigation", domain: message.domain });
        }
    }
  }
);
