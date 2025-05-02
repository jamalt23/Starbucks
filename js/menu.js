const $loading = $('.loading');
const $breadcrumb = $('#menu-breadcrumb').hide();
const $categories = $('#menu-categories');
const $menu = $('#menu');

const url = 'https://starbucks-data-nine.vercel.app/menus/';
const params = new URLSearchParams(location.search);
const isFirstPage = !params.has('subcategoryId');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

$.get(url, data => {
    $loading.hide();
    console.log(data);
    renderCategories(data);
    if (params.has('subcategoryId')) {
        const id = params.get('subcategoryId');
        data.forEach(category => {
            const subcategory = category.children.find(s => s.id == id);
            if (subcategory) {
                renderMenu(subcategory);
                return;
            }
        });
    }
});

function renderCategories(categories) {
    $categories.empty();
    $menu.html('<h3 class="fw-bold mb-5">Menu</h3>');
    categories.forEach(category => {
        $categories.append(`<h5 class="fw-semibold">${category.name}</h5>`);
        const $ul = $('<ul class="pb-4">');
        if (isFirstPage) $menu.append(`<h4 class="fw-bold border-bottom pb-3">${category.name}</h4>`);
        const $row = $('<div class="row g-4 pb-4 mt-4 mb-3">');
        category.children.forEach(subcategory => {
            $ul.append(`
                <li class="fw-normal my-3">
                    <a href="?subcategory=${subcategory.id}">
                        ${subcategory.name}
                    </a>
                </li>
            `);
            if (isFirstPage) {
                $row.append(`
                    <div class="subcategory col-md-6">
                        <a class="d-flex align-items-center gap-3" href="?subcategoryId=${subcategory.id}">
                            <img class="rounded-circle" src="${subcategory.categoryImageURL}" />
                            <span class="fs-5">${subcategory.name}</span>
                        </a>
                    </div>
                `);
            }
        });
        $categories.append($ul);
        if (isFirstPage) $menu.append($row);
    });
}

function renderMenu(subcategory) {
    $breadcrumb.append(`
        <li class="breadcrumb-item">${subcategory.name}</li>
    `).show();
    console.log(subcategory);
    subcategory.children.forEach(type => {
        $menu.append(`<h4 class="border-bottom pb-3">${type.name}</h4>`);
        const $row = $('<div class="row gy-4 pb-4 mt-4 mb-3">');
        type.products.forEach(product => {
            const uri = encodeURIComponent(type.uri) + encodeURIComponent(product.uri);
            $row.append(`
                <div class="product col-6 col-md-3">
                    <a class="d-flex flex-column align-items-center text-center gap-3" href="product.htm?uri=${uri}">
                        <img class="rounded-circle" src="${product.imageURL}" />
                        <span class="fs-5">${product.name}</span>
                    </a>
                </div>
            `);
        });
        $menu.append($row);
    });
}
