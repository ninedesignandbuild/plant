import Legal, { legalMetadata } from "@/components/Legal";

export const metadata = legalMetadata("privacy");
export default function Page() { return <Legal doc="privacy" />; }
