"use client";

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 5000,
        style: {
          background: "#363636",
          color: "#fff",
        },
        success: {
          duration: 3000,
          style: {
            background: "#4aed88",
            color: "#fff",
          },
        },
        error: {
          duration: 4000,
          style: {
            background: "#ff4b4b",
            color: "#fff",
          },
        },
      }}
    />
  );
};
