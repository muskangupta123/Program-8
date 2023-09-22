const productList = document.getElementById('productList');
const form = document.getElementById('searchForm');
const searchContent = document.getElementById('searchContent');
const alertMessage = document.getElementById('alertMessage');
const category = document.getElementById('category');

function productCard(data, divType) {
  console.log('product');
  data.map(
    (product) =>
      (divType.innerHTML += `
      <div class="col-2 card mx-2 my-2" style="width: 12rem;">
      <img class="card-img-top" src=${product.thumbnail} alt="Card image cap">
      <div class="card-body">
        <p class="card-text">${product.title}</p>
        <p class="card-text">$${product.price}</p>
        <p class="card-text">rating : ${product.rating}</p>
        <p class="card-text">${product.category}</p>  
      </div>
    </div>
      `)
  );
}

async function makeRequest() {
  //to fetcg products
  const res = await fetch('https://dummyjson.com/products');
  const data = await res.json();
  productCard(data.products, productList);
  console.log(data);

  //to fetch categories
  const response = await fetch('https://dummyjson.com/products/categories');
  const categories = await response.json();
  console.log('cat', categories);
  categories.map(
    (product) =>
      (category.innerHTML += `
    <option value=${product}>${product}</option>
    `)
  );
}

async function getCategory(selectCategory) {
  const url = selectCategory
    ? `https://dummyjson.com/products/category/${selectCategory}`
    : `https://dummyjson.com/products/categories`;
  const res = await fetch(url);
  const data = await res.json();
  console.log('category function', data.products);

  return data.products;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  searchContent.innerHTML = '';
  alertMessage.setAttribute('hidden', true);
  const searchText = e.target.searchText.value;
  const checkPrice = e.target.checkPrice.checked;
  const selectCategory = e.target.selectCategory.value;
  console.log(selectCategory);
  if (searchText) {
    console.log('hello');
    const res = await fetch(
      `https://dummyjson.com/products/search?q=${searchText}`
    );
    const data = await res.json();
    if (data.products.length === 0) {
      alertMessage.removeAttribute('hidden');
      alertMessage.innerHTML = 'no matching results';
      return;
    }
    if (checkPrice) {
      data.products.sort((a, b) => {
        return a.price - b.price;
      });
    }
    console.log(data.products);
    console.log('selectCategory', selectCategory);
    if (selectCategory != '') {
      console.log('entry');
      const data = await getCategory(selectCategory);
      data.sort((a, b) => {
        return a.price - b.price;
      });
      console.log('sorted', data);
      productCard(data, searchContent);
    }
    productCard(data.products, searchContent);
  } else {
    alertMessage.removeAttribute('hidden');
    alertMessage.innerHTML = 'Please enter Search field';
  }
});

window.onload = (event) => {
  makeRequest();
};