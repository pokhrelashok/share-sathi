"use client";
import useInvoke from "@/hooks/useInvoke";
import SectionLoading from "../_components/SectionLoading";
import { useEffect } from "react";

export type Company = {
  companyName: string;
  companyShareId: number;
  issueCloseDate: string;
  issueOpenDate: string;
  scrip: string;
  shareGroupName: string;
  shareTypeName: string;
  statusName: string;
  subGroup: string;
};

export type Prospectus = {
  clientName: string;
  companyCode: string;
  companyName: string;
  companyShareId: number;
  maxIssueCloseDate: string;
  maxIssueCloseDateStr: string;
  maxUnit: number;
  minIssueOpenDate: string;
  minIssueOpenDateStr: string;
  minUnit: number;
  scrip: string;
  shareGroupName: string;
  sharePerUnit: number;
  shareTypeName: string;
  shareValue: number;
};

export default function OpenShares() {
  const {
    data: shares,
    handle: getShares,
    loading: isFetchingShares,
  } = useInvoke<Company[]>("list_open_shares");
  const {
    data: prospectus,
    handle: getShareDetails,
    loading: isFetchingProspectus,
    error,
  } = useInvoke<Prospectus>("get_company_prospectus");

  useEffect(() => {
    getShares();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-2 p-3 max-w-md mx-auto">
      <h2 className="text-3xl font-bold my-5 text-center">Open Shares</h2>
      {isFetchingShares && <SectionLoading />}
      {shares?.map((share) => {
        return (
          <div
            onClick={() => {
              if (share.companyShareId !== prospectus?.companyShareId)
                getShareDetails({ id: share.companyShareId });
            }}
            key={share.companyName}
            className="flex p-2 bg-slate-200 cursor-pointer rounded-lg justify-center items-center"
          >
            {share.companyName}
          </div>
        );
      })}
      <div className="relative">
        {prospectus && !error && (
          <div className="mt-4 relative bg-blue-200 rounded-lg p-2 flex flex-col justify-center items-center">
            <h2 className="font-bold text-center">{prospectus.companyName}</h2>
            <div>
              Minimum Unit:{" "}
              <span className="font-bold">{prospectus.minUnit}</span>
            </div>
            <div>
              Price Per Unit:{" "}
              <span className="font-bold">Rs {prospectus.sharePerUnit}</span>
            </div>
            <div>
              Share Type:{" "}
              <span className="font-bold">{prospectus.shareTypeName}</span>
            </div>
            <button className="w-full bg-green-100 hover:bg-green-200 py-2 rounded-lg flex justify-center items-center mt-3">
              Apply Now
            </button>
          </div>
        )}
        {!isFetchingProspectus && error && <div>{JSON.stringify(error)}</div>}
        {isFetchingProspectus && <SectionLoading />}
      </div>
    </div>
  );
}
