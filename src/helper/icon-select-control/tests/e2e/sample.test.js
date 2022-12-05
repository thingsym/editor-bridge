describe('Google', () => {
  beforeAll(async () => {
    await page.goto('https://www.google.com/');
  });

  it('should be titled "Google"', async () => {
    await expect(page.title()).resolves.toMatch('Google');
  });
});
