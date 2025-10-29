import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  // Public routes (não precisam de autenticação)
  layout("layouts/public.layout.tsx", [
    route("login", "routes/auth/login.tsx"),
    route("register", "routes/auth/register.tsx"),
  ]),

  // Protected routes (requerem autenticação)
  layout("layouts/protected.layout.tsx", [
    index("routes/home.tsx"),
    route("product/:id", "routes/products/detail.tsx"),
    route("my-products", "routes/products/my-products.tsx"),
    route("purchases", "routes/purchases.tsx"),
    route("sales", "routes/sales.tsx"),
    route("favorites", "routes/favorites.tsx"),
    route("profile", "routes/profile.tsx"),
  ]),
] satisfies RouteConfig;
