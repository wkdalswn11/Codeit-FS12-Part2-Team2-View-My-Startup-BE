export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateNameAndEmail = (name, email) => {
  const nameTrim = name?.trim();
  const emailTrim = email?.trim();

  if (!nameTrim || !emailTrim) {
    const error = new Error("이름과 이메일은 필수로 작성해주세요");
    error.status = 400;
    throw error;
  }

  if (!EMAIL_REGEX.test(emailTrim)) {
    const error = new Error("올바른 이메일 형식이 아닙니다");
    error.status = 400;
    throw error;
  }

  return {
    name: nameTrim,
    email: emailTrim,
  };
};
