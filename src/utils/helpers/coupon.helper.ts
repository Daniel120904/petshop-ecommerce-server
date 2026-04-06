import couponRepository from "../../modules/coupon/coupon.repository";

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateRandomCode(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function generateCouponCode(): Promise<string> {
  let length = 5;
  let attempts = 0;

  while (true) {
    const code = generateRandomCode(length);
    const exists = await couponRepository.findUnique(
        {
            code: code
        }
    );

    if (!exists) {
      return code;
    }

    attempts++;

    if (attempts >= 5) {
      length++;
      attempts = 0;
    }
  }
}