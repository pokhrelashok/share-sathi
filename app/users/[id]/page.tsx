"use client";
import { useParams, useSearchParams } from "next/navigation";
import Wrapper from "../../_components/Wrapper";
import useInvoke from "@/hooks/useInvoke";
import { useEffect, useMemo } from "react";
import { Portfolio, User, UserDetails } from "@/types";
import { formatPrice } from "@/utils/price";
import SectionLoading from "@/app/_components/SectionLoading";

function UserDetailsPage() {
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

  return (
    <Wrapper
      className="!py-0"
      showBack={true}
      title={`${details ? details.name : "User"} Portfolio`}
    >
      {data ? (
        <table className="min-w-full bg-white border border-gray-300 z-[1111111]">
          <thead>
            <tr className="sticky top-0 bg-white border-b">
              <th className="py-2 px-4 text-left"># </th>
              <th className="py-2 px-4 text-left">Script</th>
              <th className="py-2 px-4 text-left">Quantity</th>
              <th className="py-2 px-4 text-left">Previous Value</th>
              <th className="py-2 px-4 text-left">Latest Value</th>
            </tr>
          </thead>
          <tbody>
            {data?.meroShareMyPortfolio.map((item, index) => {
              return (
                <tr key={item.script} className="border-b">
                  <td className="py-2 px-4"> {index + 1} </td>
                  <td className="py-2 px-4"> {item.script} </td>
                  <td className="py-2 px-4">{item.currentBalance}</td>
                  <td className="py-2 px-4">
                    {" "}
                    Rs {formatPrice(
                      parseFloat(item.valueOfPrevClosingPrice)
                    )}{" "}
                  </td>
                  <td className="py-2 px-4">
                    {" "}
                    Rs {formatPrice(
                      parseFloat(item.valueOfLastTransPrice)
                    )}{" "}
                  </td>
                </tr>
              );
            })}
            <tr className="font-bold sticky bottom-0 bg-white">
              <td className="py-2 px-4"></td>
              <td className="py-2 px-4"> Total </td>
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
      ) : (
        <SectionLoading />
      )}
    </Wrapper>
  );
}

export default UserDetailsPage;
