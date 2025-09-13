import express from "express";
import { Product } from "../Schema/Product.js";
import { Transaction } from "../Schema/Transaction.js";

const router = express.Router();

router.post("/reorder", async (req, res) => {
  try {
    const products = await Product.find();
    if (!products || products.length === 0) {
      return res.json({
        success: true,
        suggestion:
          "No products found in your inventory. Please add some products first to get recommendations.",
      });
    }

    const now = new Date();
    const pastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const salesTx = await Transaction.find({
      txType: "SALE",
      txDate: { $gte: pastMonth },
    });

    const avgMonthlySalesMap = {};
    salesTx.forEach((tx) => {
      tx.items.forEach((item) => {
        const pid = item.productId.toString();
        if (!avgMonthlySalesMap[pid]) avgMonthlySalesMap[pid] = 0;
        avgMonthlySalesMap[pid] += item.quantity;
      });
    });

    let recommendations =
      "🤖 AI INVENTORY ANALYSIS & REORDER RECOMMENDATIONS\n\n";
    recommendations +=
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

    const lowStockProducts = products.filter(
      (p) => p.stockQty <= (p.reorderLevel || 10)
    );
    const normalStockProducts = products.filter(
      (p) => p.stockQty > (p.reorderLevel || 10)
    );

    if (lowStockProducts.length > 0) {
      recommendations +=
        "🚨 URGENT: Low Stock Items Requiring Immediate Attention:\n\n";

      lowStockProducts.forEach((product, index) => {
        const monthlySales = avgMonthlySalesMap[product._id.toString()] || 0;
        const reorderLevel = product.reorderLevel || 10;
        const suggestedOrder = Math.max(
          reorderLevel * 2,
          monthlySales * 1.5,
          20
        );

        recommendations += `${index + 1}. 📦 ${product.name}\n`;
        recommendations += `   • Current Stock: ${product.stockQty} ${
          product.unit || "units"
        }\n`;
        recommendations += `   • Reorder Level: ${reorderLevel} ${
          product.unit || "units"
        }\n`;
        recommendations += `   • Monthly Sales: ${monthlySales} ${
          product.unit || "units"
        }\n`;
        recommendations += `   • 💡 Suggested Order: ${Math.round(
          suggestedOrder
        )} ${product.unit || "units"}\n`;
        recommendations += `   • 💰 Estimated Cost: $${(
          suggestedOrder * (product.avgCost || 0)
        ).toFixed(2)}\n`;
        recommendations += `   • ⚠️ Status: ${
          product.stockQty === 0 ? "OUT OF STOCK" : "CRITICALLY LOW"
        }\n\n`;
      });
    }

    if (normalStockProducts.length > 0) {
      recommendations +=
        "✅ WELL-STOCKED ITEMS (No immediate action needed):\n\n";

      normalStockProducts.slice(0, 5).forEach((product, index) => {
        const monthlySales = avgMonthlySalesMap[product._id.toString()] || 0;
        const daysOfStock =
          monthlySales > 0
            ? Math.round((product.stockQty / monthlySales) * 30)
            : 999;

        recommendations += `${index + 1}. ✅ ${product.name}\n`;
        recommendations += `   • Current Stock: ${product.stockQty} ${
          product.unit || "units"
        }\n`;
        recommendations += `   • Days of Stock: ${
          daysOfStock === 999 ? "∞" : daysOfStock
        } days\n`;
        recommendations += `   • Monthly Sales: ${monthlySales} ${
          product.unit || "units"
        }\n\n`;
      });

      if (normalStockProducts.length > 5) {
        recommendations += `... and ${
          normalStockProducts.length - 5
        } more well-stocked items.\n\n`;
      }
    }

    recommendations += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    recommendations += "📊 INVENTORY SUMMARY:\n\n";
    recommendations += `• Total Products Analyzed: ${products.length}\n`;
    recommendations += `• 🚨 Low Stock Alerts: ${lowStockProducts.length}\n`;
    recommendations += `• ✅ Well Stocked Items: ${normalStockProducts.length}\n`;
    recommendations += `• 📅 Analysis Period: Past 30 days\n`;
    recommendations += `• 📈 Total Transactions Analyzed: ${salesTx.length}\n\n`;

    if (lowStockProducts.length > 0) {
      const totalReorderCost = lowStockProducts.reduce((sum, p) => {
        const monthlySales = avgMonthlySalesMap[p._id.toString()] || 0;
        const suggestedOrder = Math.max(
          (p.reorderLevel || 10) * 2,
          monthlySales * 1.5,
          20
        );
        return sum + suggestedOrder * (p.avgCost || 0);
      }, 0);

      recommendations += `💰 Total Estimated Reorder Investment: $${totalReorderCost.toFixed(
        2
      )}\n`;
      recommendations += `🎯 Priority: ${
        lowStockProducts.filter((p) => p.stockQty === 0).length
      } items are completely out of stock\n\n`;
    }

    recommendations += "🧠 AI INSIGHTS:\n";
    recommendations +=
      "• These recommendations are based on current stock levels, reorder points, and recent sales patterns\n";
    recommendations +=
      "• Consider seasonal trends and upcoming promotions when placing orders\n";
    recommendations += "• Monitor fast-moving items more frequently\n";
    recommendations +=
      "• Review reorder levels quarterly to optimize inventory turnover\n\n";

    recommendations += "📋 NEXT STEPS:\n";
    recommendations += "1. Review and approve urgent reorder recommendations\n";
    recommendations +=
      "2. Contact suppliers for price quotes and delivery times\n";
    recommendations +=
      "3. Update reorder levels based on recent sales trends\n";
    recommendations += "4. Set up automated alerts for critical stock levels";

    return res.json({
      success: true,
      suggestion: recommendations,
    });
  } catch (error) {
    console.error("Recommendation API Error:", error);
    return res.json({
      success: true,
      suggestion: `❌ Error generating recommendations: ${error.message}\n\nPlease ensure your database is connected and contains product data. If the problem persists, check your server logs for more details.`,
    });
  }
});

export default router;
