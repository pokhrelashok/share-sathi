"use client";
import useInvoke from "@/hooks/useInvoke";
import { Fragment, useEffect, useMemo, useState } from "react";
import SectionLoading from "../_components/SectionLoading";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

type User = {
  dp: string;
  username: string;
  password: string;
  crn: string;
  pin: string;
  name: string;
  id: string | null;
};

function ManageUsers() {
  const {
    data: users,
    loading,
    handle: getUsers,
  } = useInvoke<User[]>("get_users");
  const { handle: updateUser, loading: updating } = useInvoke("update_user");

  const [user, setUser] = useState<User | null>(null);

  const currentUserIndex = useMemo(() => {
    if (!user || !users) return null;
    return users.findIndex((u) => u.username === user.username);
  }, [users, user]);

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleUpdate(data: User) {
    if (currentUserIndex === null) return;
    const updatedData = [...(users || [])];
    if (data.id) updatedData[currentUserIndex] = data;
    else {
      updatedData.unshift({
        ...data,
        id: Math.random().toString(36).slice(2, 7),
      });
    }
    updateUser({ data: JSON.stringify(updatedData) }).then(() => {
      setUser(null);
      getUsers();
      toast(`User ${data.id ? "updated" : "created"}!`);
    });
  }

  function handleDelete(index: number) {
    const updatedData = [...(users || [])];
    updatedData.splice(index, 1);
    updateUser({ data: JSON.stringify(updatedData) }).then(() => {
      setUser(null);
      getUsers();
      toast("User deleted!");
    });
  }

  return (
    <>
      <div className="flex flex-col gap-2 p-3 max-w-md mx-auto">
        <div className="my-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold">Manage Users</h2>
          <button
            disabled={loading}
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={(e) => {
              setUser({
                id: null,
                dp: "",
                username: "",
                password: "",
                crn: "",
                pin: "",
                name: "",
              });
            }}
          >
            Create
          </button>
        </div>
        {loading && <SectionLoading />}
        {users?.map((user, index) => {
          return (
            <div
              key={user.username}
              className=" bg-zinc-200 p-2 rounded-md flex cursor-pointer justify-between"
            >
              <div className="flex gap-2">
                <span className="font-bold">{user.name}</span>
                <span>{user.dp}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setUser(user)}>Update</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </div>
            </div>
          );
        })}
        {!loading && users?.length === 0 && (
          <div className="text-center">No users yet!</div>
        )}
      </div>
      {user !== null && (
        <UpdateUserDialog
          onClose={() => {
            setUser(null);
          }}
          loading={updating}
          user={user}
          handleUpdate={handleUpdate}
          handleDelete={() => {
            if (currentUserIndex !== null) {
              handleDelete(currentUserIndex);
            }
          }}
        />
      )}
    </>
  );
}

function UpdateUserDialog({
  user,
  onClose,
  handleDelete,
  handleUpdate,
  loading,
}: {
  user: User;
  onClose: () => any;
  handleUpdate: (data: User) => any;
  handleDelete: () => any;
  loading: boolean;
}) {
  const [data, setData] = useState<User>(() => ({ ...user }));
  useEffect(() => {
    setData({ ...user });
  }, [user]);
  const isOpen = user !== null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate(data);
          }}
          className="fixed inset-0 overflow-y-auto"
        >
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold leading-6 text-gray-600"
                >
                  {user.id ? "Update" : "Create"} User
                </Dialog.Title>
                <div className="mt-2 grid  grid-cols-2 gap-2">
                  {Object.keys(data).map((key) => {
                    if (data.hasOwnProperty(key)) {
                      if (key === "id") return null;
                      return (
                        <div key={key} className="flex flex-col">
                          <label className="text-sm capitalize text-gray-500 font-semibold">
                            {key}{" "}
                          </label>
                          <input
                            type={
                              key === "username" || key === "pin"
                                ? "number"
                                : "text"
                            }
                            onChange={(e) => {
                              const updated = { ...data };
                              //@ts-ignore
                              updated[key as keyof User] = e.target.value;
                              setData(updated);
                            }}
                            required={true}
                            //@ts-ignore
                            value={data[key as keyof User]}
                            className="outline-none border-2 border-gray-300 focus:border-gray-400 ease-out transition-all mt-[2px] rounded-lg p-1 text-gray-600"
                          />
                        </div>
                      );
                    }
                    return <></>;
                  })}
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  {user.id && (
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={(e) => {
                        handleDelete();
                      }}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    disabled={loading}
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    {user.id ? "Update" : "Create"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </form>
      </Dialog>
    </Transition>
  );
}

export default ManageUsers;
