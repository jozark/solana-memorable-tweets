import { Tweet } from "../interfaces/tweet";

export const getTweetIdFromUrl = (url: string): string => {
  if (url?.includes("?")) {
    url = url.split("?")[0];
  }

  const id = url.match(/(.*)status\/(.*)/)![2];
  return id ?? "alternative here";
};

export const shortenAddress = (address: string): string => {
  return (
    address.slice(0, 3) +
    "..." +
    address.slice(address.length - 3, address.length)
  );
};

export const hasUserLikedBefore = (
  wallet: string,
  tweetUrl: string,
  tweetList: Tweet[] | null
): boolean => {
  let hasUserLikedBefore = false;

  if (!tweetList) {
    return hasUserLikedBefore;
  }

  tweetList?.forEach((tweet) => {
    if (tweet.tweetLink === tweetUrl) {
      tweet.likes.forEach((like) => {
        if (like.toString() === wallet) {
          hasUserLikedBefore = true;
        }
      });
    }
  });

  return hasUserLikedBefore;
};

export const isDuplicatePost = (
  url: string,
  tweetList: Tweet[] | null
): boolean => {
  let isDuplicate = false;

  if (!tweetList) {
    return false;
  }

  tweetList.forEach((tweet) => {
    if (tweet.tweetLink === url) {
      isDuplicate = true;
    }
  });

  return isDuplicate;
};
