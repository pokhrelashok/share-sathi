export default function Home() {
  return (
    <div className="flex flex-col gap-2 p-3 max-w-md mx-auto">
      <h2 className="text-3xl font-bold my-5 text-center">
        Welcome To Share Sathi
      </h2>
      <a
        href="/users"
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Manage Users
      </a>
      <a
        href="/open-share"
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Check Open Shares
      </a>
      <a
        href="/check-result"
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Check Share Result
      </a>
    </div>
  );
}
