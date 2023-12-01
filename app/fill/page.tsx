"use client";
import useInvoke from "@/hooks/useInvoke";
import SectionLoading from "../_components/SectionLoading";
import Wrapper from "../_components/Wrapper";
import Button from "../_components/Button";
import { Company, IpoAppliedResult, Prospectus, User } from "../../types";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import LoadingSpinner from "../_components/LoadingSpinner";
import { formatPrice } from "@/utils/price";
import ConfirmDialog from "../_components/ConfirmDialog";
import toast from "react-hot-toast";
import Retry from "../_components/Retry";

export default function OpenShares() {
  const {
    data: shares,
    loading: isFetchingShares,
    handle: getShares,
    error,
  } = useInvoke<Company[]>("list_open_shares", [], true);
  const [sharesApplied, setSharesApplied] = useState<number[]>([]);
  const [applyStarted, setApplyStarted] = useState<boolean>(false);
  const { data: users } = useInvoke<User[]>("get_users", [], true);
  const [report, setReport] = useState<Record<string, string>>({});
  const {
    data: selectedShare,
    handle: getShareDetails,
    loading: isFetchingProspectus,
  } = useInvoke<Prospectus>("get_company_prospectus");
  const { handle: apply, loading: isApplying } =
    useInvoke<IpoAppliedResult>("apply_share");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [applyUnits, setApplyUnits] = useState(0);

  useEffect(() => {
    if (selectedShare && selectedShare.minUnit)
      setApplyUnits(selectedShare.minUnit);
  }, [selectedShare]);

  async function applyShare(company: Prospectus) {
    setShowConfirmDialog(false);
    setApplyStarted(true);
    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      await apply({
        id: company.companyShareId,
        user: user,
        units: applyUnits,
      })
        .then((result) => {
          setReport((old) => ({ ...old, [user.id as string]: result.status }));
        })
        .catch((e: string) => {
          setReport((old) => ({ ...old, [user.id as string]: e }));
        });
    }
    setSharesApplied((old) => [...old, selectedShare.companyShareId]);
  }
  useEffect(() => {
    setApplyStarted(false);
    setReport({});
  }, [selectedShare]);

  const isAppliedForAllUsers = useMemo(() => {
    return Object.keys(report).length === users.length;
  }, [report, users]);

  return (
    <Wrapper showBack={true} title="Open Shares">
      {isFetchingShares && <SectionLoading />}
      {shares?.map((share) => {
        return (
          <Button
            onClick={() => {
              if (share.companyShareId !== selectedShare?.companyShareId)
                getShareDetails({ id: share.companyShareId }).catch(
                  (e: string) => {
                    toast(e);
                  }
                );
            }}
            className={`${
              share.companyShareId == selectedShare?.companyShareId
                ? "bg-blue-200"
                : ""
            }`}
            key={share.companyName}
          >
            {share.companyName}
          </Button>
        );
      })}
      <div className="relative">
        {selectedShare && !error && (
          <div className="mt-4 relative bg-gray-100 rounded-lg p-2 flex flex-col justify-center items-center">
            <h2 className="font-bold text-center">
              {selectedShare.companyName}
            </h2>
            <div>
              Minimum Unit:{" "}
              <span className="font-bold">{selectedShare.minUnit}</span>
            </div>
            <div>
              Price Per Unit:{" "}
              <span className="font-bold">Rs {selectedShare.sharePerUnit}</span>
            </div>
            <div>
              Share Type:{" "}
              <span className="font-bold">{selectedShare.shareTypeName}</span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowConfirmDialog(true);
              }}
              className="flex flex-col sm:flex-row gap-2 items-center w-full mt-4"
            >
              <input
                type="number"
                min={selectedShare.minUnit}
                max={100}
                required={true}
                value={applyUnits}
                className="w-full sm:w-[120px] p-2 rounded-md h-[48px]"
                onChange={(e) => setApplyUnits(parseInt(e.target.value))}
              />
              <Button
                loading={isApplying}
                disabled={
                  isApplying ||
                  sharesApplied.includes(selectedShare.companyShareId)
                }
                type="submit"
                className={`w-full flex-1 gap-2 h-[48px] ${
                  sharesApplied.includes(selectedShare.companyShareId) ===
                    true && "bg-green-100 hover:bg-green-200"
                } ${
                  !applyUnits || applyUnits < selectedShare.minUnit
                    ? "bg-red-100"
                    : ""
                }`}
              >
                {sharesApplied.includes(selectedShare.companyShareId)
                  ? "Applied"
                  : isApplying
                  ? "Applying"
                  : `Apply ${applyUnits || 0} Units`}
              </Button>
            </form>
          </div>
        )}
        {isFetchingProspectus && <SectionLoading />}
      </div>
      {applyStarted && (
        <FillProgressDialog
          report={report}
          users={users}
          share={selectedShare}
          onClose={() => {
            if (isAppliedForAllUsers) {
              setApplyStarted(false);
            }
          }}
        ></FillProgressDialog>
      )}
      {showConfirmDialog && (
        <ConfirmDialog
          onCancel={() => setShowConfirmDialog(false)}
          onConfirm={() => applyShare(selectedShare)}
          title="Confirm your action"
          subtitle={
            <div className="text-left">
              Are you share you want to apply <strong>{applyUnits}</strong>{" "}
              units of share for <strong>{selectedShare.companyName}</strong> at
              Rs <strong>{formatPrice(selectedShare.sharePerUnit)}</strong> per
              unit? (Rs{" "}
              <strong>
                {formatPrice(selectedShare.sharePerUnit * applyUnits)}
              </strong>
              )
            </div>
          }
        />
      )}
      {error && <Retry message={error} onRetry={getShares} />}
    </Wrapper>
  );
}

function FillProgressDialog({
  users,
  share,
  onClose,
  report,
}: {
  share: Prospectus;
  users: User[];
  onClose: () => any;
  report: Record<string, string>;
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
                  className="text-lg font-bold leading-6 text-gray-600 flex flex-col mb-4"
                >
                  <div>{share.companyName}</div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-2 text-blue-400">
                      {share.minUnit} at Rs {formatPrice(share.sharePerUnit)}
                    </div>
                    <div className="text-green-400">
                      {Object.keys(report).length}/{users.length}
                    </div>
                  </div>
                </Dialog.Title>
                <div className="flex flex-col gap-1 overflow-y-auto max-h-[80vh]">
                  {users.map((user) => {
                    return (
                      <Button key={user.id} className="flex justify-between">
                        <div>{user.name}</div>
                        <div>
                          {report[user.id || "-1"] || (
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
        </div>
      </Dialog>
    </Transition>
  );
}
