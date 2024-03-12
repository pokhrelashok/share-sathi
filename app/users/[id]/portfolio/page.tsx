"use client";
import { useParams, useSearchParams } from "next/navigation";
import Wrapper from "../../../_components/Wrapper";
import useInvoke from "@/hooks/useInvoke";
import { useEffect, useMemo } from "react";
import { Portfolio, User, UserDetails } from "@/types";
import { formatPrice } from "@/utils/price";
import SectionLoading from "@/app/_components/SectionLoading";

function UserPortfolioPage() {
  const params = useParams();
  const id = params.id;
  const { data, handle } = useInvoke<Portfolio>("get_user_portfolio");
  const { data: users } = useInvoke<User[]>("get_users", [], true);

  useEffect(() => {
    handle({ id });
  }, [handle, id]);

  const details = useMemo(() => {
    return users.find((u) => u.id == id);
  }, [users, id]);

  const isGain = useMemo(() => {
    if (!data) return false;
    return data.totalValueOfLastTransPrice > data.totalValueOfPrevClosingPrice;
  }, [data]);

  return (
    <Wrapper
      className="!py-0"
      showBack={true}
      title={`${details ? details.name : "User"} Portfolio`}
    >
      {data ? (
        <>
          <div className="flex mb-4 flex-col sm:flex-row gap-2">
            <div className="flex-1 flex flex-col items-center justify-center">
              <h4 className="font-bold text-xl">Total Today</h4>
              <p>Rs {formatPrice(data.totalValueOfLastTransPrice)}</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <h4 className="font-bold text-xl">
                {isGain ? "Profit" : "Loss"} Today
              </h4>
              <p>
                Rs{" "}
                {formatPrice(
                  Math.floor(
                    Math.abs(
                      data.totalValueOfLastTransPrice -
                        data.totalValueOfPrevClosingPrice
                    )
                  )
                )}
              </p>
            </div>
          </div>
          <table className="min-w-full  border border-gray-300 z-[1111111] bg-blue-100">
            <thead>
              <tr className="sticky top-0 bg-yellow-100 border-b">
                <th className="py-2 px-4 text-left"># </th>
                <th className="py-2 px-4 text-left">Script</th>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-left">LTP</th>
                <th className="py-2 px-4 text-left">Total</th>
                <th className="py-2 px-4 text-left">Gain/Loss</th>
              </tr>
            </thead>
            <tbody>
              {data?.meroShareMyPortfolio.map((item, index) => {
                return (
                  <tr
                    key={item.script}
                    className={`border-b ${
                      item.valueOfPrevClosingPrice <= item.valueOfLastTransPrice
                        ? item.valueOfPrevClosingPrice ==
                          item.valueOfLastTransPrice
                          ? "bg-blue-100"
                          : "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    <td className="py-2 px-4"> {index + 1} </td>
                    <td className="py-2 px-4" title={item.scriptDesc}>
                      {" "}
                      {item.script}{" "}
                    </td>
                    <td className="py-2 px-4">{item.currentBalance}</td>
                    <td className="py-2 px-4">
                      Rs{" "}
                      {formatPrice(
                        Math.floor(
                          parseFloat(item.valueAsOfLastTransactionPrice) /
                            item.currentBalance
                        )
                      )}
                    </td>
                    <td className="py-2 px-4">
                      Rs {formatPrice(parseFloat(item.valueOfLastTransPrice))}
                    </td>
                    <td className="py-2 px-4">
                      Rs{" "}
                      {formatPrice(
                        Math.floor(
                          Math.abs(
                            parseFloat(item.valueOfPrevClosingPrice) -
                              parseFloat(item.valueAsOfLastTransactionPrice)
                          )
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr className="font-bold sticky bottom-0 bg-yellow-100">
                <td className="py-2 px-4"></td>
                <td className="py-2 px-4"> Total </td>
                <td className="py-2 px-4"></td>
                <td className="py-2 px-4">
                  {data.meroShareMyPortfolio.reduce(
                    (p, c) => c.currentBalance + p,
                    0
                  )}
                </td>
                <td className="py-2 px-4">
                  Rs {formatPrice(data.totalValueOfPrevClosingPrice)}
                </td>
                <td className="py-2 px-4">
                  Rs {formatPrice(data.totalValueOfLastTransPrice)}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <SectionLoading />
      )}
    </Wrapper>
  );
}

export default UserPortfolioPage;
