# ShieldSurf – Real‑time Malicious Site Blocker (Chrome Extension)

ShieldSurf is a Chrome extension that protects users from malicious websites in real time, powered by the Google Safe Browsing API.

## 🔹 Key Features
- **Real-time URL Scanning**: Analyzes websites for malware, phishing, and unwanted software before they load.
- **Automatic Blocking & Alerts**: Blocks dangerous sites instantly and notifies users via warning popup.
- **Custom Whitelist**: Add and manage trusted domains.
- **Badge Status Indicator**: Shows safety status (SAFE/BAD) directly on the browser icon.
- **Threat Logging**: Stores blocked URLs locally for tracking.
- **MV3‑Optimized Architecture**: Built with Declarative Net Request (DNR) for better performance and security.

## 🔹 Tech Stack
- Chrome Extension (Manifest V3)
- TypeScript, Vite
- Google Safe Browsing v4 API
- Chrome Extensions API (declarativeNetRequest, webNavigation, storage, notifications)

## 🔹 Competitive Advantages
- Pre-blocking architecture optimized for MV3 to minimize dangerous page flashes.
- Modular design for easy maintenance and scalability.
- TEST_MODE for safe and isolated development testing.

## 🔹 Planned Features
- **File Download Security Check**: Automatically scans downloaded files for threats before they are opened.
- **Suspicious Email Content Scan & Censorship**: Detects and removes harmful elements in suspicious emails, blocking phishing or malware payloads.
- Enhanced Whitelist Management: Users can add, remove, and edit trusted domains.
- Blacklist Support: Users can add specific domains to a permanent block list for proactive threat prevention.

---

This project aims to enhance user safety during web browsing while ensuring top‑tier performance and a smooth user experience.

# ShieldSurf – 실시간 악성 사이트 차단 Chrome 확장 프로그램

ShieldSurf는 Google Safe Browsing API를 기반으로 웹 탐색 중 위험한 사이트를 실시간으로 차단하여 사용자를 보호하는 Chrome 확장 프로그램입니다.

## 🔹 주요 기능
- **실시간 URL 검사**: 페이지 로드 전에 악성 코드, 피싱, 원치 않는 소프트웨어 여부를 즉시 분석
- **자동 차단 & 경고 알림**: 위험 사이트 탐지 시 즉시 차단하고 경고 팝업 제공
- **화이트리스트 관리**: 신뢰 가능한 도메인을 직접 추가·관리 가능
- **배지 상태 표시**: 페이지 안전 상태(SAFE/BAD)를 브라우저 아이콘에서 직관적으로 확인
- **위협 로그 기록**: 차단된 URL을 로컬에 저장하여 추적 가능
- **MV3 최적화 구조**: Declarative Net Request(DNR) 기반으로 성능과 보안을 향상

## 🔹 기술 스택
- Manifest V3 기반 Chrome Extension
- TypeScript, Vite
- Google Safe Browsing v4 API
- Chrome Extensions API (declarativeNetRequest, webNavigation, storage, notifications 등)

## 🔹 차별점
- MV3에 최적화된 **사전 차단 구조**로 위험 페이지 깜빡임 최소화
- 모듈화된 아키텍처로 유지보수·확장이 용이
- TEST_MODE 지원으로 안전한 개발·테스트 환경 제공

## 🔹 향후 고려 기능
- **파일 다운로드 위험성 검사**: 다운로드한 파일을 열기 전에 악성 여부 자동 검사
- **의심 이메일 콘텐츠 스캔 및 위험 요소 제거**: 의심되는 이메일 내용을 스캔해 피싱·악성 코드 가능성 차단
- 화이트리스트 관리 고도화: 사용자가 도메인 추가·삭제·수정 가능
- 블랙리스트 지원: 특정 도메인을 강제 차단 목록에 추가, 위험 사이트 사전 차단

---

본 프로젝트는 사용자 웹 탐색의 안전성을 강화하는 동시에, 성능과 UX를 균형 있게 고려하여 설계되었습니다.

