"use client";
import Likes from "./likes";

import { experimental_useOptimistic as useOptimistic, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
  const [optimisticTweets, addOptimisticTweets] = useOptimistic<
    TweetWithAuthor[],
    TweetWithAuthor
  >(tweets, (currentOptimisticTweets, newTweet) => {
    const newOptimisticTweets = [...currentOptimisticTweets];
    const id = newOptimisticTweets.findIndex(
      (tweet) => tweet.id === newTweet.id
    );
    newOptimisticTweets[id] = newTweet;
    return newOptimisticTweets;
  });

  const supabase = createClientComponentClient();
  const router = useRouter();
  useEffect(() => {
    const channel = supabase
      .channel("realtime tweets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tweets",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return (
    <>
      {optimisticTweets.map((tweet) => (
        <div
          key={tweet.id}
          className="border border-gray-800 border-t-0 px-4 py-8 flex"
        >
          <div className="w-12 h-12">
            <Image
              className="rounded-full"
              src={tweet.author.avatar_url}
              width={48}
              height={48}
              alt="tweet user avatar image"
            ></Image>
          </div>
          <div className="ml-4">
            <p>
              <span className="font-bold"> {tweet.author?.name}</span>{" "}
              <span className="text-sm text-gray-400">
                {tweet.author?.username}
              </span>
            </p>
            <p>{tweet.title}</p>
            <Likes tweet={tweet} addOptimisticTweets={addOptimisticTweets} />
          </div>
        </div>
      ))}
    </>
  );
}
