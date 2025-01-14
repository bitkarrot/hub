import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDown,
  ChevronUp,
  CopyIcon,
} from "lucide-react";
import React from "react";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "src/components/ui/credenza";
import { toast } from "src/components/ui/use-toast";
import { copyToClipboard } from "src/lib/clipboard";
import { cn } from "src/lib/utils";
import { Transaction } from "src/types";

dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  tx: Transaction;
};

function TransactionItem({ tx }: Props) {
  const [showDetails, setShowDetails] = React.useState(false);
  const type = tx.type;
  const Icon = tx.type == "outgoing" ? ArrowUpIcon : ArrowDownIcon;

  const copy = (text: string) => {
    copyToClipboard(text);
    toast({ title: "Copied to clipboard." });
  };

  return (
    <Credenza
      onOpenChange={(open) => {
        if (!open) {
          setShowDetails(false);
        }
      }}
    >
      <CredenzaTrigger
        asChild
        className="p-3 mb-4 hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer rounded-md slashed-zero transaction sensitive ph-no-capture"
      >
        <div className="flex gap-3">
          <div className="flex items-center">
            <div
              className={cn(
                "flex justify-center items-center rounded-full w-10 h-10 md:w-14 md:h-14",
                type === "outgoing"
                  ? "bg-orange-100 dark:bg-orange-950"
                  : "bg-green-100 dark:bg-emerald-950"
              )}
            >
              <Icon
                strokeWidth={3}
                className={cn(
                  "w-6 h-6 md:w-8 md:h-8",
                  type === "outgoing"
                    ? "text-orange-400 dark:text-amber-600 stroke-orange-400 dark:stroke-amber-600"
                    : "text-green-500 dark:text-emerald-500 stroke-green-400 dark:stroke-emerald-500"
                )}
              />
            </div>
          </div>
          <div className="overflow-hidden mr-3">
            <div className="flex items-center gap-2 truncate dark:text-white">
              <p className="text-lg md:text-xl font-semibold">
                {type == "incoming" ? "Received" : "Sent"}
              </p>
              <p className="text-sm md:text-base truncate text-muted-foreground">
                {dayjs(tx.settled_at * 1000).fromNow()}
              </p>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              {tx.description || "Lightning invoice"}
            </p>
          </div>
          <div className="flex ml-auto text-right space-x-3 shrink-0 dark:text-white">
            <div className="flex items-center gap-2 text-xl">
              <p
                className={cn(
                  "font-semibold",
                  type == "incoming" && "text-green-600 dark:color-green-400"
                )}
              >
                {type == "outgoing" ? "-" : "+"}
                {new Intl.NumberFormat(undefined, {}).format(
                  Math.floor(tx.amount / 1000)
                )}{" "}
              </p>
              <p className="text-muted-foreground">
                {Math.floor(tx.amount / 1000) == 1 ? "sat" : "sats"}
              </p>

              {/* {!!tx.totalAmountFiat && (
                <p className="text-xs text-gray-400 dark:text-neutral-600">
                  ~{tx.totalAmountFiat}
                </p>
              )} */}
            </div>
          </div>
        </div>
      </CredenzaTrigger>
      <CredenzaContent className="slashed-zero">
        <CredenzaHeader>
          <CredenzaTitle>
            {`${type == "outgoing" ? "Sent" : "Received"} Bitcoin`}
          </CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <div className="flex items-center mt-6">
            <div
              className={cn(
                "flex justify-center items-center rounded-full w-10 h-10 md:w-14 md:h-14",
                type === "outgoing"
                  ? "bg-orange-100 dark:bg-orange-950"
                  : "bg-green-100 dark:bg-emerald-950"
              )}
            >
              <Icon
                strokeWidth={3}
                className={cn(
                  "w-6 h-6 md:w-8 md:h-8",
                  type === "outgoing"
                    ? "text-orange-400 dark:text-amber-600 stroke-orange-400 dark:stroke-amber-600"
                    : "text-green-500 dark:text-emerald-500 stroke-green-400 dark:stroke-emerald-500"
                )}
              />
            </div>
            <div className="ml-4">
              <p className="text-xl md:text-2xl font-semibold">
                {new Intl.NumberFormat(undefined, {}).format(
                  Math.floor(tx.amount / 1000)
                )}{" "}
                {Math.floor(tx.amount / 1000) == 1 ? "sat" : "sats"}
              </p>
              {/* <p className="text-sm md:text-base text-gray-500">
                Fiat Amount
              </p> */}
            </div>
          </div>
          <div className="mt-8">
            <p className="dark:text-white">Date & Time</p>
            <p className="text-muted-foreground">
              {dayjs(tx.settled_at * 1000)
                .tz(dayjs.tz.guess())
                .format("D MMMM YYYY, HH:mm")}
            </p>
          </div>
          {type == "outgoing" && (
            <div className="mt-6">
              <p className="dark:text-white">Fee</p>
              <p className="text-muted-foreground">
                {new Intl.NumberFormat(undefined, {}).format(
                  Math.floor(tx.fees_paid / 1000)
                )}{" "}
                {Math.floor(tx.fees_paid / 1000) == 1 ? "sat" : "sats"}
              </p>
            </div>
          )}
          {tx.description && (
            <div className="mt-6">
              <p className="dark:text-white">Description</p>
              <p className="text-muted-foreground">{tx.description}</p>
            </div>
          )}
        </CredenzaBody>
        <CredenzaFooter className="!justify-start mt-4 !flex-col">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowDetails(!showDetails)}
          >
            Details
            {showDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          {showDetails && (
            <>
              <div className="mt-6 !ml-0">
                <p className="dark:text-white">Preimage</p>
                <div className="flex items-center gap-4">
                  <p className="text-muted-foreground break-all">
                    {tx.preimage}
                  </p>
                  <CopyIcon
                    className="cursor-pointer text-muted-foreground w-6 h-6"
                    onClick={() => {
                      copy(tx.preimage);
                    }}
                  />
                </div>
              </div>
              <div className="mt-6 !ml-0">
                <p className="dark:text-white">Hash</p>
                <div className="flex items-center gap-4">
                  <p className="text-muted-foreground break-all">
                    {tx.payment_hash}
                  </p>
                  <CopyIcon
                    className="cursor-pointer text-muted-foreground w-6 h-6"
                    onClick={() => {
                      copy(tx.payment_hash);
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}

export default TransactionItem;
