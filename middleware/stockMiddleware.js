import Product from "../models/Product.js";

export const checkLowStock = async (req, res, next) => {
  if (req.session.user) {
    try {
      const lowStockProducts = await Product.find({
        stock: { $lt: 10 },
      })
        .populate("marca")
        .lean();

      res.locals.lowStockCount = lowStockProducts.length;
      res.locals.lowStockList = lowStockProducts;
      res.locals.hasLowStock = lowStockProducts.length > 0;
    } catch (err) {
      console.error("Error al obtener stock bajo:", err);
    }
  }
  next();
};
