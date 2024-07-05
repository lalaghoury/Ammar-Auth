const PendingOrder = require("../models/PendingOrder");
const Order = require("../models/Order");
const getCardBrandImagesByName = require("../helpers/getCardBrandImagesByName");

const handleDiscountCreated = async (e) => {
  const event = e.data.object;

  const pending = await PendingOrder.findOne({
    customer: event.data.object.customer,
  });

  if (pending) {
    pending.coupon = event.data.object.coupon;
    pending.couponApplied = true;
    await pending.save();
  }
};

const handleChargeUpdated = async (e) => {
  const event = e.data.object;

  const OldOrder = await PendingOrder.findOne({
    customer: event.customer,
  });

  const { payment_method_details, billing_details } = event;

  if (OldOrder && event.status === "succeeded") {
    const newOrderObj = {
      products: OldOrder.products,
      user: OldOrder.user,
      payment: {
        cardType: payment_method_details.card.brand,
        brand: payment_method_details.type,
        last4: payment_method_details.card.last4,
        exp_month: payment_method_details.card.exp_month,
        exp_year: payment_method_details.card.exp_year,
        country: payment_method_details.card.country,
        imageUrl: getCardBrandImagesByName(payment_method_details.card.brand),
      },
      shipping_address: {
        address_line_1: event.shipping.address.line1,
        address_line_2: event.shipping.address.line2,
        city: event.shipping.address.city,
        state: event.shipping.address.state,
        country: event.shipping.address.country,
        pincode: event.shipping.address.postal_code,
        phone: event.shipping.phone,
      },
      billing_address: {
        address_line_1: billing_details.address.line1,
        address_line_2: billing_details.address.line2,
        city: billing_details.address.city,
        state: billing_details.address.state,
        country: billing_details.address.country,
        pincode: billing_details.address.postal_code,
        phone: billing_details.phone,
        email: billing_details.email,
        name: billing_details.name,
      },
      coupon: event.coupon,
      amount: event.amount / 100,
    };

    await new Order(newOrderObj).save();
  }
};

module.exports = { handleDiscountCreated, handleChargeUpdated };
