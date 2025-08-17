import { SafeBrowsingRequest, SafeBrowsingResponse, ThreatMatch } from "../types";
import { API_KEY, TEST_MODE } from "./config";

export async function checkUrlSafety(
  urlToCheck: string,
): Promise<{ safe: boolean | null; details?: ThreatMatch[]; error?: unknown; reason?: string; }> {
  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

  if (TEST_MODE) {
    console.log('TEST MODE');
    return { safe: false, reason: 'Mock threat for testing' }
  }

  const requestBody: SafeBrowsingRequest = {
    client: {
      clientId: "shieldSurf",
      clientVersion: "1.0",
    },
    threatInfo: {
      threatTypes: [
        "MALWARE",
        "SOCIAL_ENGINEERING",
        "UNWANTED_SOFTWARE",
        "POTENTIALLY_HARMFUL_APPLICATION",
      ],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url: urlToCheck }],
    },
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: { "Content-Type": "application/json" },
    });

    const data: SafeBrowsingResponse = await response.json();

    if (data && data.matches) {
      console.warn("⚠️ 위험한 URL", data.matches);
      return { safe: false, details: data.matches };
    } else {
      console.log("✅ 안전한 URL");
      return { safe: true };
    }
  } catch (error) {
    console.error("API 요청 중 오류:", error);
    return { safe: null, error };
  }
}
