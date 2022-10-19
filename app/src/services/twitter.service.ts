export const getTweetIdFromUrl = (url: string): string => {
  if (url?.includes("?")) {
    url = url.split("?")[0];
  }

  const id = url.match(/(.*)status\/(.*)/)![2];
  return id ?? "alternative here";
};
