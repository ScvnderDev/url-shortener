import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
export async function generateToken(
  userId: string,
  response: Response,
): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = { sub: userId };
  const accessToken = await this.jwtService.signAsync(payload); // return access token
  const refreshToken = uuidv4();
  await this.storeRefreshToken(userId, refreshToken); // store refresh token in db

  // Set cookie if response has a .cookie method

  response.cookie('accessToken', accessToken, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    httpOnly: true,
    sameSite: 'strict',
    secure: false,
  });
  response.cookie('refreshToken', refreshToken, {
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    httpOnly: true,
    sameSite: 'strict',
    secure: false,
  });

  return { accessToken, refreshToken };
}
