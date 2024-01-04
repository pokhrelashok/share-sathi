"use client";
import { useParams, useSearchParams } from "next/navigation";
import Wrapper from "../../../_components/Wrapper";
import useInvoke from "@/hooks/useInvoke";
import { useEffect, useMemo } from "react";
import { Portfolio, TransactionView, User, UserDetails } from "@/types";
import { formatPrice } from "@/utils/price";
import SectionLoading from "@/app/_components/SectionLoading";

function UserTransactionsPage() {
  const params = useParams();
  const id = params.id;
  const { data, handle } = useInvoke<TransactionView>("get_user_transactions");
  const { data: users } = useInvoke<User[]>("get_users", [], true);
  useEffect(() => {
    handle({ id });
  }, [handle, id]);

  const details = useMemo(() => {
    return users.find((u) => u.id == id);
  }, [users, id]);

  return (
    <Wrapper
      className="!py-0"
      showBack={true}
      title={`${details ? details.name : "User"} Transactions`}
    >
      {data ? (
        <table className="min-w-full border border-gray-300 z-[1111111]">
          <thead>
            <tr className="sticky top-0 bg-yellow-100 border-b">
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Script</th>
              <th className="py-2 px-4 text-left">Quantity</th>
              <th className="py-2 px-4 text-left">Current Balance</th>
            </tr>
          </thead>
          <tbody>
            {data?.transactionView.map((item, index) => {
              return (
                <tr
                  key={item.script}
                  className={`border-b ${
                    item.debitQty == "-" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <td className="py-2 px-4"> {index + 1} </td>
                  <td className="py-2 px-4">
                    {item.transactionDate.split("T")[0]}{" "}
                  </td>
                  <td className="py-2 px-4" title={item.scriptDesc}>
                    {" "}
                    {item.script}{" "}
                  </td>
                  <td className="py-2 px-4">
                    {item.creditQty != "-" ? item.creditQty : item.debitQty}
                  </td>
                  <td className="py-2 px-4">{item.balAfterTrans}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <SectionLoading />
      )}
    </Wrapper>
  );
}

export default UserTransactionsPage;
