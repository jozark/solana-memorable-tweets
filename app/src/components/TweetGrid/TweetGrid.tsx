import React from "react";
import "./TweetGrid.css";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Tweet } from "../../interfaces/tweet";
import { getTweetIdFromUrl } from "../../services/twitter.service";
import { FaThumbsUp } from "react-icons/fa";

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
        <div key={tweet.tweetLink} className="tweet-card">
          <TwitterTweetEmbed
            onLoad={function noRefCheck() {}}
            tweetId={getTweetIdFromUrl(tweet.tweetLink)}
          />
          <div className="upvote-container">
            <div className="counter">
              <FaThumbsUp />
              <span>55</span>
            </div>
            <button className="cta-button upvote-button">Upvote</button>
            <span className="hidden" title="fasresfsa">
              fas...
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
