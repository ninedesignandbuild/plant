import crypto from "node:crypto";

export async function createRazorpayOrder(amountInr: number, receipt: string) {
  const { RAZORPAY_KEY_ID: id, RAZORPAY_KEY_SECRET: secret } = process.env;
  if (!id || !secret) throw new Error("Razorpay keys are not configured");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}` },
    body: JSON.stringify({ amount: Math.round(amountInr * 100), currency: "INR", receipt }),
  });
  if (!res.ok) throw new Error("Could not start payment");
  return (await res.json()) as { id: string };
}

export function verifySignature(orderId: string, paymentId: string, signature: string) {
  const expected = Buffer.from(crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "").update(`${orderId}|${paymentId}`).digest("hex"));
  const given = Buffer.from(signature);
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}
