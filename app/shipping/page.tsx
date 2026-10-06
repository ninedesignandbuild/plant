import Legal, { legalMetadata } from "@/components/Legal";

export const metadata = legalMetadata("shipping");
export default function Page() { return <Legal doc="shipping" />; }
