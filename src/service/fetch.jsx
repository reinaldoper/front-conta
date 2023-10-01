import fetch from 'cross-fetch';


export const fetchUser = async (options,host) => {
  const url = `https://conta-beta.vercel.app/users${host}`;
  const required = await fetch(url, options);
  const response = await required.json();
  return response;
}
export const fetchTransaction = async (options, host) => {
  const url = `https://conta-beta.vercel.app/transaction${host}`;
  const required = await fetch(url, options);
  const response = await required.json();
  return response;
}