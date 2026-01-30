import { Friend } from "@/types/friends";
import css from "./Friends.module.css";
import Image from "next/image";
import Link from "next/link";
import { truncate } from "@/utils/truncate";

interface FriendsItemProp {
  friend: Friend;
}
export default function FriendsItem({ friend }: FriendsItemProp) {
  const address = friend.address
    ? truncate(friend.address, 20)
    : "website only";

  const email = friend.email ? truncate(friend.email, 22) : "phone only";

  const phone = friend.phone ? truncate(friend.phone, 20) : "email only";

  const schedule =
    friend.workDays && friend.workDays.some((day) => day.isOpen)
      ? Array.from(
          new Set(
            friend.workDays
              .filter((day) => day.isOpen)
              .map((day) => `${day.from} - ${day.to}`),
          ),
        ).join(", ")
      : "Day and night";

  return (
    <li className={css.items}>
      <p className={css.workTime}>{schedule}</p>

      <div className={css.logoWrap}>
        <Image
          src={friend.imageUrl}
          alt={`Logo to ${friend.title}`}
          width={80}
          height={80}
          className={css.logo}
          loading="lazy"
        />
      </div>
      <div className={css.content}>
        <h3 className={css.title}>{friend.title}</h3>
        <ul className={css.contacts}>
          <li className={css.item}>
            <span className={css.subtitle}> Email: </span>
            {friend.email ? (
              <Link href={`mailto:${friend.email}`}>{email}</Link>
            ) : (
              <span>{email}</span>
            )}
          </li>

          <li className={css.item}>
            <span className={css.subtitle}> Address: </span>
            {friend.address ? (
              <Link
                href={
                  friend.addressUrl ||
                  `https://maps.google.com/?q=${friend.address}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {address}
              </Link>
            ) : (
              <span>{address}</span>
            )}
          </li>

          <li className={css.item}>
            <span className={css.subtitle}> Phone: </span>
            {friend.phone ? (
              <Link href={`tel:${friend.phone}`}>{phone}</Link>
            ) : (
              <span>{phone}</span>
            )}
          </li>
        </ul>
      </div>
    </li>
  );
}
