"use client";

import Container from "@/components/Container/Container";
import FriendsList from "@/components/FriendsList/FrientsList";
import Title from "@/components/Title/Title";

export default function Friends() {
  return (
    <Container>
      <div>
        <Title text="Our friends" />
        <FriendsList />
      </div>
    </Container>
  );
}
