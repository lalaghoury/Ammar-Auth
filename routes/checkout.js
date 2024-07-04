const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { requireSignin } = require("../middlewares/authMiddleware");
const PendingOrder = require("../models/PendingOrder");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const rawJsonParser = require("../middlewares/custom-raw-parser");

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

  try {
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

    const pending = await new PendingOrder(orderObj)?.save();

    res.cookie("pending", JSON.stringify(pending), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

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
      success_url: `${process.env.CLIENT_URL}/order-confirmed`,
      cancel_url: `${process.env.CLIENT_URL}/cart?order_cancelled=true`,
    });

    res.send({
      sessionId: session?.id,
      success: true,
      message: "Stripe session created successfully!",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: "Something went wrong, please try again",
        error,
      });
  }
});

router.post("/stripe_webhooks", rawJsonParser, async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

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
              exp_year: event.data.object.payment_method_details.card.exp_year,
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
});

router.post("/stripe/cancel", async (req, res) => {
  const pending = JSON.parse(req?.cookies?.pending);

  const pendingOrder = await PendingOrder.findById(pending?._id);
  if (pendingOrder) {
    await PendingOrder.findByIdAndDelete(pendingOrder._id);
    res.clearCookie("pending");
  }
  res.json({ success: true });
});

router.post("/stripe/confirmed", async (req, res) => {
  res.clearCookie("pending");
  res.json({ success: true });
});

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
