const cardBrandImages = {
  visa: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png",
  mastercard:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoPXuA0BFfgjEKfl2QnL4YN8CIUIDrL6EO0A&s",
  jcb: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBjpvE0FBfXQKB2dX6kZmgj_QqIhAAb31VuA&s",
  discover:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0GK-orUHwcn2GCeV6Gx19x5kP7wtYPz16Pw&s",
  amex: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNwk3UTLDWMD1ztUBVvUcgqgLpD8NOVJPiig&s",
  default:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN1evlHq4awm4ad_JIY1u3ibleMP6QtLI4-g&s",
};

function getCardBrandImagesByName(brand) {
  return cardBrandImages[brand] || cardBrandImages.default;
}

module.exports = getCardBrandImagesByName;
