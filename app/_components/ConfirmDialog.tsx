import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";
import Button from "./Button";

export default function ConfirmDialog({
  title,
  subtitle,
  onCancel,
  onConfirm,
}: {
  onCancel: () => any;
  onConfirm: () => any;
  subtitle: string | ReactNode;
  title: string | ReactNode;
}) {
  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onCancel}>
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
                  {title}
                </Dialog.Title>
                <div className="flex text-md">{subtitle}</div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    className="bg-orange-100 hover:bg-orange-200"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-100 hover:bg-green-200"
                    onClick={onConfirm}
                  >
                    Confirm
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
