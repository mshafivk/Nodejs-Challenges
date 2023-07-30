import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import AuthButtonServer from "./auth-button-server";
import { redirect } from "next/navigation";
import NewTweet from "./new_tweet";
import Tweets from "./tweets";

export const dynamic = "force-dynamic";
export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/login");
  }
  const { data } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(user_id)")
    .order("created_at", { ascending: false });

  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
      userHasLikedTweet: !!tweet.likes.find(
        (like) => like.user_id === session.user.id
      ),
      likes: tweet.likes.length,
    })) ?? [];

  return (
    <div className="w-full max-w-xl mx-au">
      <div className="flex justify-between px-4 py-6 border border-gray-800">
        <h1 className="text-xl font-bold border-t-0">Home</h1>
        <AuthButtonServer />
      </div>
      <NewTweet user={session.user} />
      <Tweets tweets={tweets} />
    </div>
  );
}
