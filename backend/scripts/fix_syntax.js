const fs = require('fs');
const path = require('path');
const bs = String.fromCharCode(92); // literal backslash
const fixFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.split(bs + '`').join('`');
    content = content.split(bs + '$').join('$');
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${path.basename(filePath)}`);
  }
};

const backendModels = [
  'cart.model.js', 'category.model.js', 'order.model.js', 'product.model.js', 'review.model.js'
].map(f => path.join(__dirname, '../src/models', f));

const frontendPages = [
  'Cart.jsx', 'Checkout.jsx', 'Home.jsx', 'ProductDetail.jsx', 'ProductList.jsx'
].map(f => path.join(__dirname, '../../frontend/src/pages', f));

[...backendModels, ...frontendPages].forEach(fixFile);
