"use client";
import useInvoke from "@/hooks/useInvoke";
import Wrapper from "../_components/Wrapper";
import { CompanyApplication, IpoResult } from "../_components/Models";
import SectionLoading from "../_components/SectionLoading";
import Button from "../_components/Button";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

function ResultPage() {
  const { data: shares, loading } = useInvoke<CompanyApplication[]>(
    "get_application_report",
    [],
    true
  );
  const [selectedShare, setSelectedShare] = useState<null | CompanyApplication>(
    null
  );
  const { data: result, handle: getResult } = useInvoke<IpoResult[]>(
    "get_share_results",
    []
  );
  useEffect(() => {
    console.log(selectedShare);
    if (selectedShare)
      getResult({ id: selectedShare.applicantFormId.toString() });
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
          onClose={() => {
            setSelectedShare(null);
          }}
          result={result}
        />
      )}
    </Wrapper>
  );
}

function ViewResultDialog({
  share,
  result,
  onClose,
}: {
  share: CompanyApplication;
  onClose: () => any;
  result: IpoResult[];
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
                  className="text-lg font-bold leading-6 text-gray-600"
                >
                  Result for {share.companyName}
                </Dialog.Title>
                <div className="flex flex-col overflow-scroll">
                  {result.map((res, ind) => {
                    return (
                      <Button className="justify-between" key={ind}>
                        <div>{res.name}</div>
                        <div>{res.status}</div>
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
