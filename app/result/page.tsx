"use client";
import useInvoke from "@/hooks/useInvoke";
import Wrapper from "../_components/Wrapper";
import {
  CompanyApplication,
  IpoAppliedResult,
  IpoResult,
  User,
} from "../../types";
import SectionLoading from "../_components/SectionLoading";
import Button from "../_components/Button";
import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import LoadingSpinner from "../_components/LoadingSpinner";
import Retry from "../_components/Retry";

function ResultPage() {
  const {
    data: shares,
    loading,
    error,
    handle: getShares,
  } = useInvoke<CompanyApplication[]>("get_application_report", [], true);
  const { data: users } = useInvoke<User[]>("get_users", [], true);
  const [selectedShare, setSelectedShare] = useState<null | CompanyApplication>(
    null
  );

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
          onClose={() => {
            setSelectedShare(null);
          }}
          users={users}
        />
      )}
      {error && <Retry message={error} onRetry={getShares} />}
    </Wrapper>
  );
}

function ViewResultDialog({
  share,
  onClose,
  users,
}: {
  users: User[];
  share: CompanyApplication;
  onClose: () => any;
}) {
  const [result, setResult] = useState<Record<string, string>>({});
  const { handle: getResult, loading } = useInvoke<string>(
    "get_share_results",
    []
  );
  const [applyUnits, setApplyUnits] = useState(10);
  const [reapplyingFor, setReapplyingFor] = useState<User | null>(null);
  const { handle: reapply, loading: isApplying } =
    useInvoke<IpoAppliedResult>("apply_share");

  useEffect(() => {
    if (!share || users.length === 0) return;
    setResult({});
    users.forEach((user) => {
      getResult({ script: share.scrip, user })
        .then((result) => {
          setResult((old) => ({ ...old, [user.id as string]: result }));
        })
        .catch((e: string) => {
          setResult((old) => ({ ...old, [user.id as string]: e }));
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [share]);

  useEffect(() => {
    if (reapplyingFor && reapplyingFor.id) {
      reapply({
        id: share.companyShareId,
        user: reapplyingFor,
        units: applyUnits,
        isReapply: true,
      }).then(() => {
        setResult((old) => ({
          ...old,
          [reapplyingFor.id as string]: "Reapplied",
        }));
        setReapplyingFor(null);
      });
    }
  }, [applyUnits, reapply, reapplyingFor, result, share.companyShareId]);

  const getUserResultComponent = useCallback(
    (user: User) => {
      const id = user.id || -1;
      if (!(id in result)) {
        return <LoadingSpinner className="h-3 w-3" />;
      }
      if (result[id] === "Rejected") {
        return (
          <div className="flex items-center justify-between gap-2">
            <input
              type="number"
              min={10}
              max={100}
              required={true}
              value={applyUnits}
              className="w-[80px] p-2 rounded-md h-[48px]"
              onChange={(e) => setApplyUnits(parseInt(e.target.value))}
            />
            <Button
              loading={isApplying && reapplyingFor?.id === user.id}
              onClick={() => {
                setReapplyingFor(user);
              }}
            >
              Reapply
            </Button>
          </div>
        );
      }
      return result[id];
    },
    [result, isApplying, reapplyingFor?.id, applyUnits]
  );

  function getStatusClass(id: string) {
    const status = result[id];
    if (["Alloted", "Verified"].includes(status)) {
      return "bg-green-100 hover:bg-green-200";
    } else if (["Unverified", "Not Applied"].includes(status))
      return "bg-orange-100 hover:bg-orange-200";
    else if (["Rejected", "Not Alloted", "Not Filled"].includes(status)) {
      return "bg-red-100 hover:bg-red-200";
    } else {
      return "";
    }
  }

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
                    if (!user || !user.id) return <></>;
                    return (
                      <Button
                        key={user.id}
                        className={`flex justify-between cursor-default ${getStatusClass(
                          user.id
                        )}`}
                      >
                        <div>{user.name}</div>
                        <div>{getUserResultComponent(user)}</div>
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
