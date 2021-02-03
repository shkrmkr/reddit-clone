import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import PostCard from "../../components/PostCard";

export default function Sub() {
  const router = useRouter();

  const subName = router.query.sub;

  const { data: sub, error } = useSWR(subName ? `/subs/${subName}` : null);

  let subContent;

  if (error) {
    subContent = (
      <p className="text-lg text-center">
        Sub {subName} not found.{" "}
        <Link href="/">
          <a className="block text-blue-500">Go Back to Home</a>
        </Link>
      </p>
    );
  } else if (!sub) {
    subContent = <p className="text-lg text-center">Loading...</p>;
  } else if (sub.posts.length === 0) {
    subContent = <p className="text-lg text-center">No posts on this sub :(</p>;
  } else {
    subContent = sub.posts.map((post) => (
      <PostCard key={post.identifier} post={post} />
    ));
  }

  return (
    <div className="container flex pt-5">
      <div className="w-160">{subContent}</div>
    </div>
  );
}
