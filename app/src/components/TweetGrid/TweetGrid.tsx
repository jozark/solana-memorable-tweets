import React from "react";
import "./TweetGrid.css";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Tweet } from "../../interfaces/tweet";
import {
  getTweetIdFromUrl,
  shortenAddress,
} from "../../services/twitter.service";
import { FaCreditCard, FaMoneyBill, FaThumbsUp } from "react-icons/fa";

type TweetGridProps = {
  list: Tweet[] | null;
  handleClick: (s: string) => void;
};

export default function TweetGrid({
  list,
  handleClick,
}: TweetGridProps): JSX.Element {
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
            <button
              className="cta-button upvote-button counter"
              onClick={() => handleClick(tweet.tweetLink)}
            >
              <FaThumbsUp />
              <span>{tweet.likes.length}</span>
            </button>
            <div className="submitted-container">
              <span>submitted by: </span>
              <div className="submitted-wallet">
                <FaCreditCard />
                <span title={tweet.userAddress.toString()}>
                  {shortenAddress(tweet.userAddress.toString())}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
