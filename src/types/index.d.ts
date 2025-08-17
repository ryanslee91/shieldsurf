export interface ThreatEntry {
  url: string;
}

export interface ThreatInfo {
  threatTypes: string[];
  platformTypes: string[];
  threatEntryTypes: string[];
  threatEntries: ThreatEntry[];
}

export interface ClientInfo {
  clientId: string;
  clientVersion: string;
}

export interface SafeBrowsingRequest {
  client: ClientInfo;
  threatInfo: ThreatInfo;
}

export interface ThreatMatch {
  threatType: string;
  platformType: string;
  threat: { url: string };
  cacheDuration: string;
}

export interface SafeBrowsingResponse {
  matches?: ThreatMatch[];
}
