import toast from "react-hot-toast";

const cart = {
  get() {
    try {
      const raw = localStorage.getItem("cart");
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Error reading cart from localStorage:", err);
      return [];
    }
  },

  add(newQty, product) {
    const cart = this.get();
    const existingIndex = cart.findIndex(
      (item) => item.productId === product.productId,
    );

    const cartItem = {
      _id: product._id,
      productId: product.productId,
      name: product.name,
      qty: newQty,
      priceCents: product.priceInfo.sellingPriceCents,
      image: product.images[0],
    };

    if (existingIndex >= 0) {
      cart[existingIndex].qty += newQty;
    } else {
      cart.push(cartItem);
    }

    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Added to cart");
    } catch (err) {
      console.error("Error saving cart:", err);
    }
  },

  save(newCart) {
    try {
      localStorage.setItem("cart", JSON.stringify(newCart));
    } catch (err) {
      console.error("Error saving cart:", err);
    }
    return this.get();
  },

  getQty() {
    const cart = this.get();
    return cart.reduce((sum, item) => sum + (item.qty || 0), 0);
  },
};

export default cart;
