import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/auth/AuthLayout.tsx", [
    index("routes/root/home.tsx"),
    route("signin","routes/auth/SignIn.tsx"), 
    route("signup", "routes/auth/SignUp.tsx"),
    route("forget-password", "routes/auth/ForgetPassword.tsx"),
    route("reset-password", "routes/auth/ResetPassword.tsx"),
    route("verify-email", "routes/auth/VerifyEmail.tsx"),
  ]),
] satisfies RouteConfig;
