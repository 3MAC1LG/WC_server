interface User {
  id: number;
  provider: string;
  email: string;
}

const user: User = {
  id: 1,
  provider: 'kakao',
  email: 'blan19@naver.com',
};

export default user;
