import baseFetch from "./_base";

export const getMe = async () => {
  const response = await baseFetch.get("/auth/me");
  return response.data;
};
