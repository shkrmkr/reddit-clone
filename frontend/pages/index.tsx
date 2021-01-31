import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaCommentAlt, FaShare } from "react-icons/fa";
import { GoBookmark } from "react-icons/go";

import { Post } from "../types";
import { GetServerSideProps } from "next";

dayjs.extend(relativeTime);

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
            <div key={post.id} className="flex mb-4 bg-white rounded">
              <div className="w-10 text-center bg-gray-100 rounded-l">
                <p>V</p>
              </div>

              <div className="w-full p-2">
                <div className="flex items-center">
                  <Link href={`/r/${post.subName}`}>
                    <>
                      <img
                        src="https://gravatar.com/avatar"
                        className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                      />
                      <a className="text-xs font-bold cursor-pointer hover:underline">
                        /r/{post.subName}
                      </a>
                    </>
                  </Link>
                  <p className="text-xs text-gray-500">
                    <span className="mx-1">•</span>Posted by
                    <Link href={`/u/${post.username}`}>
                      <a className="mx-1 hover:underline">/u/{post.username}</a>
                    </Link>
                    <Link href={post.url}>
                      <a className="mx-1 hover:underline">
                        {dayjs(post.cretaedAt).fromNow()}
                      </a>
                    </Link>
                  </p>
                </div>
                <Link href={post.url}>
                  <a className="my-1 text-lg font-medium">{post.title}</a>
                </Link>
                {post.body && <p className="my-1 text-sm">{post.body}</p>}

                <div className="flex">
                  <Link href={post.url}>
                    <a>
                      <div className="flex items-center p-1 mr-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-200 ">
                        <FaCommentAlt className="mr-1 text-gray-400" />
                        <span className="font-bold">20 Comments</span>
                      </div>
                    </a>
                  </Link>

                  <div className="flex items-center p-1 mr-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-200 ">
                    <FaShare className="mr-1 text-gray-400" />
                    <span className="font-bold">Share</span>
                  </div>

                  <div className="flex items-center p-1 mr-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-200 ">
                    <GoBookmark className="mr-1 text-gray-400" />
                    <span className="font-bold">Save</span>
                  </div>
                </div>
              </div>
            </div>
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
