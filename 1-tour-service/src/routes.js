const authRoutes  = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const tourRoutes = require('./routes/tour.route');
const categoryRoutes = require('./routes/category.route');
const locationRoutes = require('./routes/location.route');
const transportRoutes = require('./routes/transport.route');
const discountRoutes = require('./routes/discount.route');
const cartRoutes = require('./routes/cart.route');
const checkoutRoutes = require('./routes/checkout.route');
const bookingRoutes = require('./routes/booking.route');
const paymentRoutes = require('./routes/payment.route');
const searchRoutes = require('./routes/search.route');
const uploadRoutes = require('./routes/upload.route');
const hotelRoutes = require('./routes/hotel.route');
const reviewRoutes = require('./routes/review.route');

const BASE_AUTH_URL = '/api/v1/auth';
const BASE_USER_URL = '/api/v1/users';
const BASE_TOUR_URL = '/api/v1/tours';
const BASE_CATEGORY_URL = '/api/v1/categories';
const BASE_LOCATION_URL = '/api/v1/locations';
const BASE_TRANSPORT_URL = '/api/v1/transportations';
const BASE_DISCOUNT_URL = '/api/v1/discounts';
const BASE_CART_URL = '/api/v1/carts';
const BASE_CHECKOUT_URL = '/api/v1/checkout';
const BASE_BOOKING_URL = '/api/v1/booking';
const BASE_PAYMENT_URL = '/api/v1/payment';
const BASE_SEARCH_URL = '/api/v1/search';
const BASE_UPLOAD_URL = '/api/v1/upload';
const BASE_HOTEL_URL = '/api/v1/hotels';
const BASE_REVIEW_URL = '/api/v1/reviews';

const appRoutes = (app) => {
    app.use(BASE_USER_URL, userRoutes.routes());
    app.use(BASE_AUTH_URL, authRoutes.routes());
    app.use(BASE_TOUR_URL, tourRoutes.routes());
    app.use(BASE_CATEGORY_URL, categoryRoutes.routes());
    app.use(BASE_LOCATION_URL, locationRoutes.routes());
    app.use(BASE_TRANSPORT_URL, transportRoutes.routes());
    app.use(BASE_DISCOUNT_URL, discountRoutes.routes());
    app.use(BASE_CART_URL, cartRoutes.routes());
    app.use(BASE_CHECKOUT_URL, checkoutRoutes.routes());
    app.use(BASE_BOOKING_URL, bookingRoutes.routes());
    app.use(BASE_PAYMENT_URL, paymentRoutes.routes());
    app.use(BASE_SEARCH_URL, searchRoutes.routes());
    app.use(BASE_UPLOAD_URL, uploadRoutes.routes());
    app.use(BASE_HOTEL_URL, hotelRoutes.routes());
    app.use(BASE_REVIEW_URL, reviewRoutes.routes());
}

module.exports = appRoutes;