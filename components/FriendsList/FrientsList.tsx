import { useEffect, useState } from "react";
import FriendsItem from "@/components/FriendsItem/FriendsItem";
import css from "./FriendsList.module.css";
import { Friend } from "@/types/friends";

export default function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    fetch("/api/friends")
      .then((res) => res.json())
      .then((data: Friend[]) => setFriends(data));
  }, []);

  return (
    <ul className={css.list}>
      {friends.map((friend) => (
        <FriendsItem key={friend.title} friend={friend} />
      ))}
    </ul>
  );
}
