import { checkUrlSafety } from './safeBrowsing';

describe('checkUrlSafety', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('위험 URL → safe=false 반환', async () => {
    global.fetch = jest.fn(async () =>
      ({
        json: async () => ({
          matches: [
            { threatType: 'MALWARE', platformType: 'ANY_PLATFORM' }
          ]
        })
      } as any)
    );

    const result = await checkUrlSafety('http://fake-malware.test');
    expect(result.safe).toBe(false);
  });

it('안전한 URL → safe=true 반환', async () => {
    (globalThis as any).fetch = jest.fn(async () =>
      ({
        json: async () => ({ matches: [] }) // 빈 배열 → 안전
      } as any)
    );

    const result = await checkUrlSafety('http://example.com');
    expect(result.safe).toBe(true);
  });



  it('API 오류 → safe=null 반환', async () => {
    (globalThis as any).fetch = jest.fn(async () => {
      throw new Error('Network error');
    });

    const result = await checkUrlSafety('http://timeout.test');
    expect(result.safe).toBeNull();
    expect(result.error).toBeTruthy();
  });

});