"use client";
import useInvoke from "@/hooks/useInvoke";
import { Fragment, useEffect, useMemo, useState } from "react";
import SectionLoading from "../_components/SectionLoading";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import Wrapper from "../_components/Wrapper";
import Button from "../_components/Button";
import { Capital, User, UserDetails } from "../../types";
import LoadingSpinner from "../_components/LoadingSpinner";

const HIDDEN_FIELDS = ["id", "name", "bank", "dpcode"];

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
  const [showCheckupModal, setShowCheckupModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const currentUserIndex = useMemo(() => {
    if (!user || !users) return null;
    return users.findIndex((u) => u.username === user.username);
  }, [users, user]);

  useEffect(() => {
    if (user?.id) {
      validateUser(user, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleUpdate(data: User) {
    if (!userDetails) {
      validateUser(data, false);
      return;
    }
    const updatedUser = {
      ...data,
      dpcode: capitals.find((c) => c.id == data.dp)?.code || "",
    };
    const updatedUsers = [...(users || [])];
    if (data.id && currentUserIndex !== null)
      updatedUsers[currentUserIndex] = updatedUser;
    else {
      updatedUsers.unshift({
        ...updatedUser,
        id: Math.random().toString(36).slice(2, 7),
        name: userDetails.details.name,
      });
    }
    updateUser({ data: JSON.stringify(updatedUsers) }).then(() => {
      setUser(null);
      getUsers();
      toast(`User ${data.id ? "updated" : "created"}!`);
    });
  }

  async function validateUser(data: User, silent = true) {
    if (!user?.id && users.find((u) => u.username == data?.username)) {
      if (!silent) toast("User already exists!");
      return false;
    }
    try {
      const userDetails = await getUserDetails({ user: data });
      setUserDetails(userDetails);
      return true;
    } catch (e) {
      toast(e as string);
      return false;
    }
  }

  async function handleDelete(index: number) {
    const updatedData = [...(users || [])];
    updatedData.splice(index, 1);
    updateUser({ data: JSON.stringify(updatedData) }).then(() => {
      setUser(null);
      toast("User deleted!");
      getUsers();
    });
  }

  return (
    <Wrapper
      showBack={true}
      action={
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCheckupModal(true)}
            tooltip="Check for issues in users like dmat expired, password expired"
            className="bg-pink-100 flex-1 sm:flex-auto hover:bg-pink-200"
          >
            Checkup Users
          </Button>
          <Button
            disabled={loading}
            type="button"
            className="flex-1 sm:flex-auto"
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
                dpcode: "",
              });
            }}
          >
            Create
          </Button>
        </div>
      }
      title="Manage Users"
    >
      {loading || (!firstFetchDone && <SectionLoading />)}
      {users?.map((user, index) => {
        return (
          <Button
            key={user.username}
            className="flex-col sm:flex-row justify-between"
          >
            <div className="font-semibold">{user.name}</div>
            <div className="flex gap-2 items-center">
              <a href={`/users/${user.id}/transactions`}>
                <img
                  title="View User Transactions"
                  height={26}
                  width={26}
                  src="/transaction-icon.svg"
                />
              </a>
              <a href={`/users/${user.id}/portfolio`}>
                <img
                  title="View User Portfolio"
                  height={26}
                  width={26}
                  src="/eye-icon.svg"
                />
              </a>
              <button onClick={() => setUser(user)}>
                <img
                  title="Edit User"
                  height={30}
                  width={30}
                  src="/edit-icon.svg"
                />
              </button>
              <button
                onClick={() => {
                  handleDelete(index);
                }}
              >
                <img
                  title="Delete User"
                  height={26}
                  width={26}
                  src="/delete-icon.svg"
                />
              </button>
            </div>
          </Button>
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
      {showCheckupModal && (
        <CheckupDialog
          users={users}
          onClose={() => setShowCheckupModal(false)}
          isOpen={true}
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
                  className="text-lg font-bold leading-6 text-gray-600 justify-between flex items-center mb-4"
                >
                  <div>{user.id ? "Update" : "Create"} User</div>
                  <img
                    onClick={onClose}
                    src="/x-icon.svg"
                    className="cursor-pointer"
                    height={30}
                    width={30}
                  />
                </Dialog.Title>
                <div className="grid  grid-cols-2 gap-2">
                  {Object.keys(data).map((key) => {
                    if (data.hasOwnProperty(key)) {
                      if (HIDDEN_FIELDS.includes(key)) return null;
                      return (
                        <div key={key} className="flex flex-col">
                          <label
                            className={`text-sm capitalize text-gray-500 font-semibold`}
                          >
                            {key}
                          </label>
                          {key === "dp" && (
                            <select
                              onChange={(e) => {
                                updateUser("dp", e.target.value);
                              }}
                              required={true}
                              //@ts-ignore
                              value={data["dp"]}
                              className="outline-none border-2 border-gray-300 focus:border-gray-400 ease-out transition-all mt-[2px] rounded-lg p-1 text-gray-600 text-xs"
                            >
                              <option value="" disabled={true}>
                                Select capital
                              </option>
                              {capitals
                                .sort((a, b) =>
                                  parseInt(a.code) > parseInt(b.code) ? 1 : -1
                                )
                                .map((capital) => {
                                  return (
                                    <option key={capital.id} value={capital.id}>
                                      {capital.name} ({capital.code})
                                    </option>
                                  );
                                })}
                            </select>
                          )}
                          {key !== "dp" && (
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
                      className="bg-red-100 hover:bg-red-200"
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

function CheckupDialog({
  users,
  onClose,
  isOpen,
}: {
  users: User[];
  isOpen: boolean;
  onClose: () => any;
}) {
  const [result, setResult] = useState<Record<string, string>>({});
  const { handle: getUserDetails } = useInvoke<UserDetails>("get_user_details");

  useEffect(() => {
    users.forEach((user) => {
      getUserDetails({ user: user })
        .then((result) => {
          setResult((old) => ({
            ...old,
            [user.id as string]: "No issues found",
          }));
        })
        .catch((e: string) => {
          setResult((old) => ({ ...old, [user.id as string]: e }));
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        <div className="fixed inset-0 overflow-y-auto">
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
                  className="text-lg font-bold leading-6 text-gray-600 justify-between flex items-center mb-4"
                >
                  <div>Checking Users for issues</div>
                  <div className="text-green-500 shrink-0 text-sm">
                    {
                      Object.values(result).filter(
                        (r) => r === "No issues found"
                      ).length
                    }
                    /{users.length}
                  </div>
                </Dialog.Title>
                <div className="flex flex-col gap-1 overflow-y-auto max-h-[80vh]">
                  {users.map((user) => {
                    if (!user || !user.id) return <></>;
                    return (
                      <Button
                        key={user.id}
                        className={`flex justify-between ${
                          user.id in result
                            ? result[user.id] === "No issues found"
                              ? "bg-green-100 hover:bg-green-200"
                              : "bg-red-100 hover:bg-red-200"
                            : ""
                        }`}
                      >
                        <div>{user.name}</div>
                        <div>
                          {result[user.id] || (
                            <LoadingSpinner className="h-3 w-3" />
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
                {/* <div className="mt-4 flex justify-end gap-2">
                </div> */}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ManageUsers;
