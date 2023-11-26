"use client";
import { useParams, useSearchParams } from "next/navigation";
import Wrapper from "../../_components/Wrapper";
import useInvoke from "@/hooks/useInvoke";
import { useEffect } from "react";
import { Portfolio } from "@/app/_components/Models";

const formatPrice = (x: number) => {
  let str = x.toString();
  var afterPoint = "";
  if (str.indexOf(".") > 0)
    afterPoint = str.substring(str.indexOf("."), str.length);
  x = Math.floor(x);
  str = x.toString();
  var lastThree = str.substring(str.length - 3);
  var otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers != "") lastThree = "," + lastThree;
  return (
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint
  );
};

function UserDetailsPage() {
  const params = useParams();
  const id = params.id;
  const { data, handle } = useInvoke<Portfolio>("get_user_portfolio");
  useEffect(() => {
    handle({ id });
  }, [handle, id]);

  if (!data) return null;

  return (
    <Wrapper className="!py-0" showBack={true} title="User Details">
      <table className="min-w-full bg-white border border-gray-300 z-[1111111]">
        <thead>
          <tr className="sticky top-0 bg-white border-b">
            <th className="py-2 px-4 text-left"> # </th>
            <th className="py-2 px-4 text-left"> Script </th>
            <th className="py-2 px-4 text-left"> Quantity </th>
            <th className="py-2 px-4 text-left"> Previous Value </th>
            <th className="py-2 px-4 text-left"> Latest Value </th>
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
                  Rs {formatPrice(parseFloat(item.valueOfLastTransPrice))}{" "}
                </td>
              </tr>
            );
          })}
          <tr className="font-bold sticky bottom-0 bg-white">
            <td className="py-2 px-4"></td>
            <td className="py-2 px-4"> Total </td>
            <td className="py-2 px-4">
              {data.meroShareMyPortfolio.reduce(
                (a, b) => a + b.currentBalance,
                0
              )}
            </td>
            <td className="py-2 px-4">
              {" "}
              Rs{" "}
              {formatPrice(
                data.meroShareMyPortfolio.reduce(
                  (a, b) => a + parseFloat(b.valueOfPrevClosingPrice),
                  0
                )
              )}{" "}
            </td>
            <td className="py-2 px-4">
              {" "}
              Rs{" "}
              {formatPrice(
                data.meroShareMyPortfolio.reduce(
                  (a, b) => a + parseFloat(b.valueOfLastTransPrice),
                  0
                )
              )}{" "}
            </td>
          </tr>
        </tbody>
      </table>
    </Wrapper>
  );
}

export default UserDetailsPage;