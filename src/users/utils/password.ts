import * as bcrypt from 'bcryptjs';

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hashSync(password, salt);
  return hash;
};

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const isMatch = await bcrypt.compareSync(password, hash);
  return isMatch;
};

export { hashPassword, verifyPassword };
