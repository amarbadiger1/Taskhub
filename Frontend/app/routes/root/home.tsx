import type { Route } from "../../+types/root";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { motion } from "framer-motion";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "TaskHub" },
    { name: "description", content: "Welcome to TaskHub — Simplify Your Workflow" },
  ];
}

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Animated background gradient blobs */}
      <motion.div
        className="absolute w-72 h-72 bg-blue-400/30 rounded-full blur-3xl top-10 left-10"
        animate={{ x: [0, 20, -20, 0], y: [0, -10, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-indigo-400/30 rounded-full blur-3xl bottom-10 right-10"
        animate={{ x: [0, -20, 20, 0], y: [0, 10, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Content */}
      <motion.div
        className="z-10 text-center px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Big animated title */}
        <motion.h1
          className="text-6xl sm:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          TaskHub
        </motion.h1>

        <motion.p
          className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Simplify your team’s workflow. Manage projects, track progress, and
          stay productive — all in one place.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <Link to="/signin">
            <Button
              size="lg"
              className="px-8 py-6 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300"
            >
              Login
            </Button>
          </Link>

          <Link to="/signup">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg font-semibold rounded-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-gray-800 transition-all duration-300"
            >
              Sign Up
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Subtle footer */}
      <motion.footer
        className="absolute bottom-4 text-xs text-gray-400 dark:text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        © {new Date().getFullYear()} TaskHub. All rights reserved.
      </motion.footer>
    </div>
  );
}
