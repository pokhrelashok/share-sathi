"use client";
import useInvoke from "@/hooks/useInvoke";
import { Fragment, useEffect, useMemo, useState } from "react";
import SectionLoading from "../_components/SectionLoading";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import Wrapper from "../_components/Wrapper";
import Button from "../_components/Button";
import { Capital, User } from "../_components/Models";

type UserDetails = {
  details: User;
  banks: Capital[];
};

function ManageUsers() {
  const {
    data: users,
    loading,
    handle: getUsers,
    firstFetchDone,
  } = useInvoke<User[]>("get_users", [], true);

  const { handle: updateUser, loading: updating } = useInvoke("update_user");
  const { data: capitals } = useInvoke<Capital[]>("get_capitals", [], true);
  const { handle: getUserDetails } = useInvoke<UserDetails>("get_user_details");

  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const currentUserIndex = useMemo(() => {
    if (!user || !users) return null;
    return users.findIndex((u) => u.username === user.username);
  }, [users, user]);

  useEffect(() => {
    if (user?.id) {
      validateUser(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleUpdate(data: User) {
    if (!userDetails) {
      validateUser(data);
      return;
    }
    const updatedData = [...(users || [])];
    if (data.id && currentUserIndex !== null)
      updatedData[currentUserIndex] = data;
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

  async function validateUser(data: User) {
    try {
      const userDetails = await getUserDetails({ user: data });
      setUserDetails(userDetails);
      return true;
    } catch (e) {
      if (!userDetails) {
        toast("The credentials are not valid!");
        return false;
      }
    }
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
    <Wrapper
      showBack={true}
      action={
        <Button
          disabled={loading}
          type="button"
          onClick={() => {
            setUser({
              id: "",
              dp: "",
              username: "",
              password: "",
              crn: "",
              pin: "",
              name: "",
              bank: "",
            });
          }}
        >
          Create
        </Button>
      }
      title="Manage Users"
    >
      {loading || (!firstFetchDone && <SectionLoading />)}
      {users?.map((user, index) => {
        return (
          <div
            key={user.username}
            className=" bg-zinc-200 p-2 px-3 rounded-md flex cursor-pointer items-center justify-between"
          >
            <div className="flex gap-2">
              <span className="font-bold">{user.name}</span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setUser(user)}>
                <img height={36} width={36} src="/edit-icon.svg" />
              </button>
              <button onClick={() => handleDelete(index)}>
                <img height={30} width={30} src="/delete-icon.svg" />
              </button>
            </div>
          </div>
        );
      })}
      {!loading && firstFetchDone && users?.length === 0 && (
        <div className="text-center">No users yet!</div>
      )}
      {user !== null && (
        <UpdateUserDialog
          onChange={(key) => {
            if (!(key == "dp" || key == "username" || key == "password"))
              return;
            setUserDetails(null);
          }}
          onClose={() => {
            setUser(null);
          }}
          loading={updating}
          capitals={capitals}
          user={user}
          handleUpdate={handleUpdate}
          userDetails={userDetails}
          handleDelete={() => {
            if (currentUserIndex !== null) {
              handleDelete(currentUserIndex);
            }
          }}
        />
      )}
    </Wrapper>
  );
}

function UpdateUserDialog({
  user,
  onClose,
  handleDelete,
  handleUpdate,
  loading,
  capitals,
  onChange,
  userDetails,
}: {
  userDetails: UserDetails | null;
  capitals: Capital[];
  user: User;
  onClose: () => any;
  handleUpdate: (data: User) => any;
  handleDelete: () => any;
  onChange: (key: keyof User) => any;
  loading: boolean;
}) {
  const [data, setData] = useState<User>(() => ({ ...user }));
  const isValidated = userDetails !== null;
  useEffect(() => {
    setData({ ...user });
  }, [user]);

  const isOpen = user !== null;

  function updateUser(key: keyof User, value: string) {
    const updated = { ...data };
    updated[key] = value;
    setData(updated);
    onChange(key);
  }

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
                      if (key === "id" || key === "bank") return null;
                      return (
                        <div key={key} className="flex flex-col">
                          <label
                            className={`text-sm capitalize text-gray-500 font-semibold`}
                          >
                            {key}
                          </label>
                          {key === "dp" && (
                            <select
                              onChange={(e) =>
                                updateUser(key as keyof User, e.target.value)
                              }
                              required={true}
                              //@ts-ignore
                              value={data[key as keyof User]}
                              className="outline-none border-2 border-gray-300 focus:border-gray-400 ease-out transition-all mt-[2px] rounded-lg p-1 text-gray-600 text-xs"
                            >
                              <option value="" disabled={true}>
                                Select capital
                              </option>
                              {capitals.map((capital) => {
                                return (
                                  <option key={capital.id} value={capital.id}>
                                    {capital.name} ({capital.code})
                                  </option>
                                );
                              })}
                            </select>
                          )}
                          {key !== "dp" && key !== "bank" && (
                            <input
                              type={
                                key === "username" || key === "pin"
                                  ? "number"
                                  : "text"
                              }
                              onChange={(e) =>
                                updateUser(key as keyof User, e.target.value)
                              }
                              required={true}
                              //@ts-ignore
                              value={data[key as keyof User]}
                              className="outline-none border-2 border-gray-300 focus:border-gray-400 ease-out transition-all mt-[2px] rounded-lg p-1 text-gray-600"
                            />
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
                  {isValidated && (
                    <div className="flex flex-col">
                      <label
                        className={`text-sm capitalize text-gray-500 font-semibold`}
                      >
                        Bank
                      </label>
                      <select
                        onChange={(e) => updateUser("bank", e.target.value)}
                        required={true}
                        value={data["bank"]}
                        className="outline-none border-2 border-gray-300 focus:border-gray-400 ease-out transition-all mt-[2px] rounded-lg p-1 text-gray-600 text-xs"
                      >
                        <option value="" disabled={true}>
                          Select Bank
                        </option>
                        {userDetails.banks.map((bank) => {
                          return (
                            <option key={bank.id} value={bank.id}>
                              {bank.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  {user.id && (
                    <Button
                      type="button"
                      color="red"
                      onClick={() => {
                        handleDelete();
                      }}
                    >
                      Delete
                    </Button>
                  )}
                  <Button disabled={loading} loading={loading} type="submit">
                    {!isValidated ? "Validate" : user.id ? "Update" : "Create"}
                  </Button>
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
