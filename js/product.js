const $loading = $('.loading');
const $breadcrumb = $('.breadcrumb');

const url = 'https://starbucks-data-nine.vercel.app/menus/';
const params = new URLSearchParams(location.search);
const productUri = params.get('uri');
console.log(productUri);

const regex = /\/(.*)\/(.*)\/(.*)\/.*\/(\d*)\//;
const [, categoryId, subcategoryId, typeId, productNumber] = productUri.match(regex);

$.get(url, data => {
    const subcategory = data.find(c => c.id == categoryId).children.find(s => s.id == subcategoryId);
    const product = subcategory.children.find(t => t.id == typeId).products.find(p => (p.productNumber = productNumber));
    $breadcrumb.append(`
        <li class="breadcrumb-item"><a href="menu.htm?subcategory=${subcategoryId}">${subcategory.name}</a></li>
        <li class="breadcrumb-item active">${product.name}</li>
    `);
    $loading.hide();
    renderDetails(product);
});

function renderDetails(product) {
    console.log(product);
    $('#hero').html(`
        <img src="${product.imageURL}" alt="Product" />
        <h1 class="fw-bold">${product.name}</h1>
    `);
}
