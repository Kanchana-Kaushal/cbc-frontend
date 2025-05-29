import toast from "react-hot-toast";

const cart = {
  add(newQty, product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingProdIndex;

    const cartAddDetails = {
      _id: product._id,
      productId: product.productId,
      name: product.name,
      qty: newQty,
      priceCents: product.priceInfo.sellingPriceCents,
      image: product.images[0],
    };

    cart.forEach((element, index) => {
      if (element.productId === product.productId) {
        existingProdIndex = index;
      }
    });

    if (existingProdIndex >= 0) {
      cart[existingProdIndex].qty += newQty;
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Added to cart");

      return;
    }

    cart = [...cart, cartAddDetails];
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
  },

  getQty() {
    const cart = JSON.parse(localStorage.getItem("cart"));
    let qty = 0;

    cart.forEach((item) => {
      qty += item.qty;
    });

    return qty;
  },
};
export default cart;
