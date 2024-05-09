const express = require("express");
const router = express.Router();
const braintree = require("braintree");
require("dotenv").config();
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const { requireSignin } = require("../middlewares/authMiddleware");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

router.get("/token", (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log({ error: "Something went wrong, please try again later." });
  }
});

router.post("/payment", requireSignin, async (req, res) => {
  try {
    const { amount, nonce, products, shipping_address, billing_address } =
      req.body;

    if (
      !amount ||
      !nonce ||
      !products ||
      !shipping_address ||
      !billing_address
    ) {
      res
        .status(500)
        .send({ message: "Something went wrong, please try again later." });
      return;
    }

    gateway.transaction.sale(
      {
        amount,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async function (err, result) {
        if (err) {
          console.error(err);
          res
            .status(500)
            .send({ message: "Something went wrong, please try again later." });
        } else {
          const orderObj = {
            products,
            payment: result.transaction.creditCard,
            shipping_address:
              shipping_address === "billing"
                ? billing_address
                : shipping_address,
            billing_address,
            amount,
            user: req.user.userId,
          };

          try {
            await new Order(orderObj).save();
          } catch (error) {
            console.error("Error creating order:", error);
            res.status(500).send({
              message: "Something went wrong, please try again later.",
            });
          }

          const cart = await Cart.findOneAndUpdate(
            { userId: req.user.userId },
            {
              $set: {
                items: [],
                total: 0,
                couponApplied: false,
                couponCode: null,
                savings: 0,
                price: 0,
              },
            },
            { new: true }
          );
          res.send({
            result,
            success: true,
            cart,
            message: "Payment Successfull",
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Something went wrong, please try again later." });
  }
});

module.exports = router;
