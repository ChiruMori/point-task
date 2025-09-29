export const dict = {
  login: '/api/user/login',
  getUser: '/api/user/get',
}

export const req = async (
  url: string,
  token: string,
  options: RequestInit = {}
) => {
  const headers = {
    'Content-Type': 'application/json',
    'x-auth-token': token,
    ...options.headers,
  }
  return (await fetch(url, { ...options, headers })).json()
}
