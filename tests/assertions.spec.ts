import { test, expect } from '@playwright/test';
test('Standard assertions', async ({ }) => {
  await expect(11, "difference for column A").toEqual(12)
  await expect(22, "difference for column B").toEqual(23)
  await expect(33, "difference for column C").toEqual(34)
});

test('Soft assertions', async ({  }) => {
    await expect.soft(11,"difference for column A").toEqual(12)
    await expect.soft(22, "difference for column B").toEqual(23)
    await expect.soft(33, "difference for column C").toEqual(34)
});