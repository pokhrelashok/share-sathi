"use client";
import useInvoke from "@/hooks/useInvoke";
import SectionLoading from "../_components/SectionLoading";
import Wrapper from "../_components/Wrapper";
import Button from "../_components/Button";
import { Company, Prospectus } from "../_components/Models";

export default function OpenShares() {
  const { data: shares, loading: isFetchingShares } = useInvoke<Company[]>(
    "list_open_shares",
    [],
    true
  );
  const {
    data: prospectus,
    handle: getShareDetails,
    loading: isFetchingProspectus,
    error,
  } = useInvoke<Prospectus>("get_company_prospectus");

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
            key={share.companyName}
          >
            {share.companyName}
          </Button>
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
    </Wrapper>
  );
}
