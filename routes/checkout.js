const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { requireSignin } = require("../middlewares/authMiddleware");
const PendingOrder = require("../models/PendingOrder");
const bodyParser = require("body-parser");
const stripe = require("stripe")('sk_test_51OH0AiFpp281IlLHIvwwHb8y0ECoQmfKIR7U9hxxrJuK45nrLPdw8MfXbfE1WS9ORfoKeVBpHotDMYNCXfGNq8WB00hfsZpiuC');

// router.get("/token", (req, res) => {
//   try {
//     const gateway = new braintree.BraintreeGateway({
//       environment: braintree.Environment.Sandbox,
//       merchantId: process.env.BRAINTREE_MERCHANT_ID,
//       publicKey: process.env.BRAINTREE_PUBLIC_KEY,
//       privateKey: process.env.BRAINTREE_PRIVATE_KEY,
//     });
//     gateway.clientToken.generate({}, function (err, response) {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         res.send(response);
//       }
//     });
//   } catch (error) {
//     console.log({ error: "Something went wrong, please try again later." });
//   }
// });

// Braintree Payment code snippet
// router.post("/payment", requireSignin, async (req, res) => {
//   try {
//     const { amount, nonce, products, shipping_address, billing_address } =
//       req.body;

//     if (
//       !amount ||
//       !nonce ||
//       !products ||
//       !shipping_address ||
//       !billing_address
//     ) {
//       res
//         .status(500)
//         .send({ message: "Something went wrong, please try again later." });
//       return;
//     }

//     gateway.transaction.sale(
//       {
//         amount,
//         paymentMethodNonce: nonce,
//         options: {
//           submitForSettlement: true,
//         },
//       },
//       async function (err, result) {
//         if (err) {
//           console.error(err);
//           res
//             .status(500)
//             .send({ message: "Something went wrong, please try again later." });
//         } else {
//           const orderObj = {
//             products,
//             payment: result.transaction.creditCard,
//             shipping_address:
//               shipping_address === "billing"
//                 ? billing_address
//                 : shipping_address,
//             billing_address,
//             amount,
//             user: req.user.userId,
//           };

//           try {
//             await new Order(orderObj).save();
//           } catch (error) {
//             console.error("Error creating order:", error);
//             res.status(500).send({
//               message: "Something went wrong, please try again later.",
//             });
//           }

//           const cart = await Cart.findOneAndUpdate(
//             { userId: req.user.userId },
//             {
//               $set: {
//                 items: [],
//                 total: 0,
//                 couponApplied: false,
//                 coupon: null,
//                 savings: 0,
//                 price: 0,
//               },
//             },
//             { new: true }
//           );
//           res.send({
//             result,
//             success: true,
//             cart,
//             message: "Payment Successfull",
//           });
//         }
//       }
//     );
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .send({ message: "Something went wrong, please try again later." });
//   }
// });

router.post("/stripe", requireSignin, async (req, res) => {
  const { products, amount } = req.body;

  const line_items = products?.map((product) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product?.name,
          images: [product?.thumbnail],
        },
        unit_amount: Math.round(product?.price * 100),
      },
      quantity: product?.quantity,
    };
  });

  const customer = await stripe.customers.create({
    email: req?.user?.email,
    metadata: {
      user_id: req?.user?._id?.toString(),
    },
    name: req?.user?.name,
    phone: req?.user?.phone,
  });

  const orderObj = {
    products,
    customer: customer.id,
    user: req.user._id,
    amount,
  };

  await new PendingOrder(orderObj)?.save();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      customer: customer.id,
      allow_promotion_codes: true,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "PK", "IN", "AU", "NZ", "SG"],
      },
      custom_text: {
        shipping_address: {
          message:
            "Please note that we can't guarantee 2-day delivery for PO boxes at this time.",
        },
        submit: {
          message: "We'll email you instructions on how to get started.",
        },
        after_submit: {
          message:
            "Learn more about **your purchase** on our [product page](https://www.stripe.com/).",
        },
      },
      success_url: "http://localhost:5173/order-confirmed",
      cancel_url: "http://localhost:5173/cart",
    });

    res.send({
      sessionId: session?.id,
      success: true,
      message: "Stripe session created successfully!",
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Something went wrong, please try again", error });
    console.log(error?.message);
  }
});

// Use the raw body to verify webhook signature
router.post(
  "/stripe_webhooks",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    // const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;
    const endpointSecret = 'whsec_644aa9a78d70eb176a146d654c5e5c33f5246d9442b546b22602467b4f7a2c70';

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "customer.discount.created": {
        const pending = await PendingOrder.findOne({
          customer: event.data.object.customer,
        });

        if (pending) {
          pending.coupon = event.data.object.coupon;
          pending.couponApplied = true;
          await pending.save();
        }
        break;
      }

      case "charge.updated": {
        const OldOrder = await PendingOrder.findOne({
          customer: event.data.object.customer,
        });

        if (OldOrder) {
          if (event.data.object.status === "succeeded") {
            const newOrderObj = {
              products: OldOrder.products,
              user: OldOrder.user,
              payment: {
                cardType: event.data.object.payment_method_details.card.brand,
                brand: event.data.object.payment_method_details.type,
                last4: event.data.object.payment_method_details.card.last4,
                exp_month:
                  event.data.object.payment_method_details.card.exp_month,
                exp_year:
                  event.data.object.payment_method_details.card.exp_year,
                country: event.data.object.payment_method_details.card.country,
                imageUrl: getCardBrandImageUrl(
                  event.data.object.payment_method_details.card.brand
                ),
              },
              shipping_address: {
                address_line_1: event.data.object.shipping.address.line1,
                address_line_2: event.data.object.shipping.address.line2,
                city: event.data.object.shipping.address.city,
                state: event.data.object.shipping.address.state,
                country: event.data.object.shipping.address.country,
                pincode: event.data.object.shipping.address.postal_code,
                phone: event.data.object.shipping.phone,
              },
              billing_address: {
                address_line_1: event.data.object.billing_details.address.line1,
                address_line_2: event.data.object.billing_details.address.line2,
                city: event.data.object.billing_details.address.city,
                state: event.data.object.billing_details.address.state,
                country: event.data.object.billing_details.address.country,
                pincode: event.data.object.billing_details.address.postal_code,
                phone: event.data.object.billing_details.phone,
                email: event.data.object.billing_details.email,
                name: event.data.object.billing_details.name,
              },
              coupon: event.data.object.coupon,
              amount: event.data.object.amount / 100,
            };

            await new Order(newOrderObj).save();
            await PendingOrder.findByIdAndDelete(OldOrder._id);
            await Cart.findOneAndUpdate(
              { userId: OldOrder.user },
              { $set: { items: [], total: 0 } }
            );
          }
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    res.json({ received: true });
  }
);

// Helper function to get the card brand image URL
function getCardBrandImageUrl(brand) {
  switch (brand) {
    case "visa":
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png";
    case "mastercard":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoPXuA0BFfgjEKfl2QnL4YN8CIUIDrL6EO0A&s";
    case "jcb":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBjpvE0FBfXQKB2dX6kZmgj_QqIhAAb31VuA&s";
    case "discover":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0GK-orUHwcn2GCeV6Gx19x5kP7wtYPz16Pw&s";
    case "amex":
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNwk3UTLDWMD1ztUBVvUcgqgLpD8NOVJPiig&s";
    default:
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN1evlHq4awm4ad_JIY1u3ibleMP6QtLI4-g&s";
  }
}

module.exports = router;
