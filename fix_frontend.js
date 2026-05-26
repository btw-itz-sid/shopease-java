const fs = require('fs');
const files = [
  'frontend/src/pages/Checkout.jsx',
  'frontend/src/pages/Cart.jsx',
  'frontend/src/pages/Home.jsx',
  'frontend/src/pages/ProductList.jsx',
  'frontend/src/pages/ProductDetail.jsx'
];
files.forEach(f => {
  const p = 'c:/Users/HP/OneDrive/Desktop/shopease-starter/shopease/' + f;
  if(fs.existsSync(p)) {
    let code = fs.readFileSync(p, 'utf8');
    const bs = String.fromCharCode(92);
    code = code.split(bs + '`').join('`');
    code = code.split(bs + '$').join('$');
    fs.writeFileSync(p, code);
    console.log('Fixed ' + f);
  } else {
    console.log('Missing ' + p);
  }
});
