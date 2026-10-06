import Legal, { legalMetadata } from "@/components/Legal";

export const metadata = legalMetadata("terms");
export default function Page() { return <Legal doc="terms" />; }
