import Button from "./_components/Button";
import Wrapper from "./_components/Wrapper";

export default function Home() {
  return (
    <Wrapper title="Welcome To Share Sathi">
      <Button href="/users">Manage Users</Button>
      <Button href="/fill">Check Open Shares</Button>
      <Button href="/result">Check Share Result</Button>
    </Wrapper>
  );
}
