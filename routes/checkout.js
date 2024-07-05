const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { requireSignin } = require("../middlewares/authMiddleware");
const PendingOrder = require("../models/PendingOrder");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { handleDiscountCreated, handleChargeUpdated } = require("../handlers");

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

  const pending = await new PendingOrder(orderObj)?.save();

  res.cookie("pending", JSON.stringify(pending), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });

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
      success_url: `${process.env.CLIENT_URL}/order-confirmed`,
      cancel_url: `${process.env.CLIENT_URL}/cart?order_cancelled=true`,
      // automatic_tax: {enabled: true},
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

router.post("/stripe_webhooks", async (req, res) => {
  console.log("Received webhook event");
  const event = req.body;

  try {
    switch (event.type) {
      case "customer.discount.created": {
        handleDiscountCreated(event);
        break;
      }

      case "charge.updated": {
        handleChargeUpdated(event);
        break;
      }

      case "checkout.session.completed": {
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          {
            expand: ["line_items"],
          }
        );
        const lineItems = sessionWithLineItems.line_items;
        console.log("🚀 ~ router.post ~ lineItems:", JSON.stringify(lineItems));
      }

      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

router.post("/stripe/cancel", async (req, res) => {
  try {
    const pending = JSON.parse(req?.cookies?.pending);

    const pendingOrder = await PendingOrder.findById(pending?._id);
    if (pendingOrder) {
      await PendingOrder.findByIdAndDelete(pendingOrder._id);
      res.clearCookie("pending");
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Pending order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting pending order" });
  }
  res.json({ success: true });
});

router.post("/stripe/confirmed", async (req, res) => {
  try {
    const pending = JSON.parse(req?.cookies?.pending);

    const pendingOrder = await PendingOrder.findById(pending?._id);
    if (pendingOrder) {
      await PendingOrder.findByIdAndDelete(pendingOrder._id);
      await Cart.findOneAndUpdate(
        { userId: PendingOrder.user },
        { $set: { items: [], total: 0 } }
      );
      res.clearCookie("pending");
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Pending order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error clearing cookie" });
  }
});

module.exports = router;
