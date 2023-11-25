export default function Home() {
  return (
    <div className="flex flex-col gap-2 p-3 max-w-md mx-auto">
      <h2 className="text-3xl font-bold my-5 text-center">
        What do you want to do?
      </h2>
      <a
        href="/users"
        className="flex p-3 justify-center items-center bg-blue-500 rounded-lg text-white"
      >
        Manage Users
      </a>
      <a
        href="/open-share"
        className="flex p-3 justify-center items-center bg-blue-500 rounded-lg text-white"
      >
        Check Open Shares
      </a>
      <a
        href="/check-result"
        className="flex p-3 justify-center items-center bg-blue-500 rounded-lg text-white"
      >
        Check Share Result
      </a>
    </div>
  );
}
