import React from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Tweet } from "../../interfaces/tweet";
import { getTweetIdFromUrl } from "../../services/twitter.service";

type TweetGridProps = {
  list: Tweet[] | null;
};

export default function TweetGrid({ list }: TweetGridProps): JSX.Element {
  if (!list) {
    return <></>;
  }
  return (
    <div className="tweet-grid">
      {list?.map((tweet) => (
        <div key={tweet.tweetLink}>
          <TwitterTweetEmbed
            onLoad={function noRefCheck() {}}
            tweetId={getTweetIdFromUrl(tweet.tweetLink)}
          />
        </div>
      ))}
    </div>
  );
}
