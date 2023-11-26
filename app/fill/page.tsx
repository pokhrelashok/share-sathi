"use client";
import useInvoke from "@/hooks/useInvoke";
import SectionLoading from "../_components/SectionLoading";
import Wrapper from "../_components/Wrapper";
import Button from "../_components/Button";
import { Company, Prospectus } from "../_components/Models";
import { useEffect, useState } from "react";

export default function OpenShares() {
  const { data: shares, loading: isFetchingShares } = useInvoke<Company[]>(
    "list_open_shares",
    [],
    true
  );
  const [sharesApplied, setSharesApplied] = useState<number[]>([]);
  const [success, setSuccess] = useState<null | boolean>(null);

  const {
    data: prospectus,
    handle: getShareDetails,
    loading: isFetchingProspectus,
    error,
  } = useInvoke<Prospectus>("get_company_prospectus");
  const { handle: apply, loading: isApplying } =
    useInvoke<Prospectus>("apply_share");

  function applyShare(company: Prospectus) {
    apply({ id: company.companyShareId, units: company.minUnit })
      .then(() => {
        setSuccess(true);
        const applied = [...sharesApplied, company.companyShareId];
        setSharesApplied(applied);
      })
      .catch(() => setSuccess(false));
  }
  useEffect(() => {
    if (prospectus && sharesApplied.includes(prospectus.companyShareId)) {
      setSuccess(true);
    }
  }, [prospectus]);

  return (
    <Wrapper showBack={true} title="Open Shares">
      {isFetchingShares && <SectionLoading />}
      {shares?.map((share) => {
        return (
          <Button
            onClick={() => {
              if (share.companyShareId !== prospectus?.companyShareId)
                getShareDetails({ id: share.companyShareId });
            }}
            className={`${
              share.companyShareId == prospectus?.companyShareId
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
        {prospectus && !error && (
          <div className="mt-4 relative bg-gray-100 rounded-lg p-2 flex flex-col justify-center items-center">
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
            <Button
              loading={isApplying}
              disabled={isApplying || success === true}
              onClick={() => applyShare(prospectus)}
              className={`mt-4 w-full gap-2 ${
                success === true && "bg-green-100 hover:bg-green-200"
              } ${success === false && "bg-pink-100 hover:bg-pink-200"}`}
            >
              {success === null
                ? isApplying
                  ? "Applying"
                  : "Apply"
                : success
                ? "Applied"
                : "Failed! Retry"}
            </Button>
          </div>
        )}
        {isFetchingProspectus && <SectionLoading />}
      </div>
    </Wrapper>
  );
}
