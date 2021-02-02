import Link from "next/link";
import { FaCommentAlt, FaShare } from "react-icons/fa";
import { GoBookmark, GoArrowUp, GoArrowDown } from "react-icons/go";
import cn from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Post } from "../types";
import ActionButton from "./ActionButton";
import axios from "axios";

dayjs.extend(relativeTime);

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const handleVote = async (value: number) => {
    try {
      const res = await axios.post("/votes/post", {
        identifier: post.identifier,
        slug: post.slug,
        value,
      });

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex mb-4 bg-white rounded">
      <div className="w-10 py-3 text-center bg-gray-100 rounded-l">
        <div
          onClick={() => handleVote(1)}
          className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
        >
          <GoArrowUp
            className={cn("text-xl", { "text-red-500": post.userVote === 1 })}
          />
        </div>

        <p className="text-xs font-bold">{post.voteScore}</p>

        <div
          onClick={() => handleVote(-1)}
          className="flex justify-center w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
        >
          <GoArrowDown
            className={cn("text-xl", { "text-blue-600": post.userVote === -1 })}
          />
        </div>
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
              <ActionButton>
                <FaCommentAlt className="mr-1 text-gray-400" />
                <span className="font-bold">{post.commentCount} Comments</span>
              </ActionButton>
            </a>
          </Link>

          <ActionButton>
            <FaShare className="mr-1 text-gray-400" />
            <span className="font-bold">Share</span>
          </ActionButton>

          <ActionButton>
            <GoBookmark className="mr-1 text-gray-400" />
            <span className="font-bold">Save</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
