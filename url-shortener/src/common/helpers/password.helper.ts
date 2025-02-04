import * as bcrypt from 'bcrypt';

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  const isMatch: boolean = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
}
