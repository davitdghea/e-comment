const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: "*",
    LOGIN: "login",
    //${path.PRODUCTS}?category=
    PRODUCTS: ":category",
    FAQs: "FAQs",
    BLOGS: "BLOGS",
    OUR_SERVICES: "OUR SERVICES",
    DETAIL_PRODUCT__CATEGORY__PID_TITLE: ":category/:pid/:title",
    Finalregister: "finalregister/:status",
    RESET_PASSWORD: "reset-password/:token",
    DETALL_CART: 'detall_cart',
    CHECKOUT: "checkout",

    // Admin
    ADMIN: 'admin',
    DASHBOARD: "dashboard",
    MANAGE_USER: 'manage_user',
    MANAGE_PRODUCTS: 'manage_products',
    MANAGE_ORDER: 'manage_order',
    CREATE_PRODUCTS: 'create_products',

    // Menber
    MEMBER: 'member',
    PERSONAL: "personal",
    MY_CART: "my_cart",
    WISHLIST: "wish_list",
    HISTORY: "history"
}
export default path