"use client";
import Button from "./_components/Button";
import Wrapper from "./_components/Wrapper";
import toast from "react-hot-toast";
import { User } from "../types";
import useInvoke from "@/hooks/useInvoke";

export default function Home() {
  const { data: users } = useInvoke<User[]>("get_users", [], true);
  return (
    <Wrapper title="Welcome To Share Sathi">
      <Button href="/users">Manage Users</Button>
      {users.length > 0 ? (
        <>
          <Button href="/fill">Check Open Shares</Button>
          <Button href="/result">Check Share Result</Button>
        </>
      ) : (
        <>
          <Button onClick={() => toast("Add some users to use this feature!")}>
            Check Open Shares
          </Button>
          <Button onClick={() => toast("Add some users to use this feature!")}>
            Check Share Result
          </Button>
        </>
      )}
    </Wrapper>
  );
}
