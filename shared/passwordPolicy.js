export const PASSWORD_POLICY_MESSAGE = 'Mật khẩu mới cần ít nhất 12 ký tự và tối đa 72 byte (ký tự tiếng Việt có thể chiếm nhiều byte).';

export const isValidNewPassword = (password) => typeof password === 'string'
  && [...password].length >= 12
  && [...password].reduce((bytes, character) => {
    const code = character.codePointAt(0);
    return bytes + (code <= 0x7f ? 1 : code <= 0x7ff ? 2 : code <= 0xffff ? 3 : 4);
  }, 0) <= 72
  && password !== 'supabase_oauth_no_password';
