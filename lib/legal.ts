import { RETURN_WINDOW } from "./content";
import { inr } from "./utils";

export type Doc = { title: string; description: string; sections: [string, string[]][] };
// Drafts: have them reviewed against how the business actually operates before launch.
export const legal = (s: { standardFee: number; expressFee: number; freeAbove: number }): Record<string, Doc> => ({
  shipping: {
    title: "Shipping", description: "How NYNI Nursery delivers your plants.",
    sections: [
      ["Where we deliver", ["We deliver across Hyderabad and nearby areas. You can also pick up your order from our nursery."]],
      ["Delivery options and charges", [`Standard delivery costs ${inr(s.standardFee)}, and is free when your order is ${inr(s.freeAbove)} or more after discounts.`, `Express delivery costs ${inr(s.expressFee)}.`, "Pickup from the nursery is free."]],
      ["Packing and tracking", ["Plants are packed to travel safely. Please unpack on delivery and place your plant in indirect light.", "Once your order ships, tracking details appear under My orders."]],
      ["Delays or problems", ["If a delivery is late or something looks wrong, contact us and we will sort it out."]],
    ],
  },
  returns: {
    title: "Returns & Cancellations", description: "Our policy on damaged plants, returns and order cancellations.",
    sections: [
      ["Living plants", [`Plants are living things, so we do not accept returns for change of mind. If your plant arrives damaged, unhealthy or not as ordered, contact us within ${RETURN_WINDOW} of delivery with photos and we will replace it or refund you.`]],
      ["Cancelling an order", ["You can cancel from My orders until your order ships. Orders paid online and cancelled in time are refunded to the original payment method by our team."]],
      ["Planters and care products", ["If an item arrives broken or wrong, contact us with photos and we will make it right."]],
    ],
  },
  privacy: {
    title: "Privacy Policy", description: "What NYNI Nursery collects and how we use it.",
    sections: [
      ["What we collect", ["Your name, email, phone number, delivery address, order history and any messages you send us. Your password is stored only as a secure hash."]],
      ["How we use it", ["To process and deliver orders, answer your questions and run your account. If you subscribe, we also send plant tips, new arrivals and offers, and you can unsubscribe at any time."]],
      ["Payments", ["Online payments are handled by Razorpay. We never see or store your card, UPI or bank details."]],
      ["Cookies and storage", ["We use a sign-in cookie, and your browser's local storage keeps your cart."]],
      ["Sharing", ["We do not sell your data. We share it only with providers needed to run the store, such as payment, hosting and delivery services."]],
      ["Your choices", ["Contact us to correct or delete your information."]],
    ],
  },
  terms: {
    title: "Terms & Conditions", description: "The terms for using NYNI Nursery and placing orders.",
    sections: [
      ["Using this website", ["By using this site and placing orders you agree to these terms. Please give accurate details when you register or order."]],
      ["Orders and prices", ["Prices are in Indian rupees. An order is confirmed once payment succeeds or a cash on delivery order is accepted. We may cancel an order if an item is unavailable, and will refund anything you paid."]],
      ["Plants and photos", ["Plants are natural, so size, shape and leaf colour can differ slightly from photos."]],
      ["Returns and cancellations", ["See our Returns & Cancellations page."]],
      ["Governing law", ["These terms are governed by the laws of India."]],
    ],
  },
});
