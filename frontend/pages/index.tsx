import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";

import { Post } from "../types";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/posts");
        setPosts(res.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className="pt-12">
      <Head>
        <title>reddit: the front page of the internet</title>
      </Head>

      <div className="container flex pt-4">
        <div className="w-160">
          {posts.map((post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const res = await axios.get("/posts");
    return { props: { posts: res.data } };
  } catch (err) {
    return { props: { error: "Something went wrong" } };
  }
};
