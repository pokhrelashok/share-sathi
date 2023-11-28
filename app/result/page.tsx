"use client";
import useInvoke from "@/hooks/useInvoke";
import Wrapper from "../_components/Wrapper";
import { CompanyApplication, IpoResult, User } from "../../types";
import SectionLoading from "../_components/SectionLoading";
import Button from "../_components/Button";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import LoadingSpinner from "../_components/LoadingSpinner";

function ResultPage() {
  const { data: shares, loading } = useInvoke<CompanyApplication[]>(
    "get_application_report",
    [],
    true
  );
  const { data: users } = useInvoke<User[]>("get_users", [], true);
  const [selectedShare, setSelectedShare] = useState<null | CompanyApplication>(
    null
  );
  const [report, setReport] = useState<Record<string, string>>({});
  const { handle: getResult, loading: isFetchingShares } = useInvoke<string>(
    "get_share_results",
    []
  );

  useEffect(() => {
    if (!selectedShare || users.length === 0) return;
    setReport({});
    users.forEach((user) => {
      getResult({ script: selectedShare.scrip, user })
        .then((result) => {
          setReport((old) => ({ ...old, [user.id as string]: result }));
        })
        .catch((e: string) => {
          setReport((old) => ({ ...old, [user.id as string]: e }));
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShare]);

  return (
    <Wrapper showBack={true} title="Share Results">
      {loading && <SectionLoading />}
      {shares?.map((share) => {
        return (
          <Button
            onClick={() => {
              setSelectedShare(share);
            }}
            key={share.companyName}
          >
            {share.companyName}
          </Button>
        );
      })}
      {selectedShare !== null && (
        <ViewResultDialog
          share={selectedShare}
          loading={isFetchingShares}
          onClose={() => {
            setSelectedShare(null);
          }}
          users={users}
          result={report}
        />
      )}
    </Wrapper>
  );
}

function ViewResultDialog({
  share,
  result,
  onClose,
  loading,
  users,
}: {
  users: User[];
  share: CompanyApplication;
  onClose: () => any;
  loading: boolean;
  result: Record<string, string>;
}) {
  return (
    <Transition appear show={true} as={Fragment}>
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
          <div className="flex items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg text-gray-600 transform rounded-2xl overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold leading-6 text-gray-600 mb-4"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between w-full">
                      <div>{share.companyName}</div>
                      <img
                        onClick={onClose}
                        src="/x-icon.svg"
                        className="cursor-pointer"
                        height={30}
                        width={30}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">{share.subGroup}</div>
                      {!loading && (
                        <div className="text-green-500 shrink-0 text-sm">
                          Alloted{" "}
                          {
                            Object.values(result).filter((r) => r === "Alloted")
                              .length
                          }
                          /{users.length}
                        </div>
                      )}
                    </div>
                  </div>
                </Dialog.Title>
                <div className="flex flex-col gap-1 overflow-y-auto max-h-[80vh]">
                  {users.map((user) => {
                    return (
                      <Button
                        key={user.id}
                        className={`flex justify-between ${
                          result[user.id || "-1"] === "Alloted"
                            ? "bg-green-100 hover:bg-green-200"
                            : ""
                        }`}
                      >
                        <div>{user.name}</div>
                        <div>
                          {result[user.id || "-1"] || (
                            <LoadingSpinner className="h-3 w-3" />
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>{" "}
      </Dialog>
    </Transition>
  );
}

export default ResultPage;
