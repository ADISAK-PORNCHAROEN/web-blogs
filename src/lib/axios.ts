import axios from "axios";

const axiosInstance = axios.create({
  baseURL: typeof window !== "undefined" ? "" : process.env.NEXTAUTH_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

if (typeof window !== "undefined") {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        // Dynamically import signOut from next-auth/react to avoid bundling it on the server
        const { signOut } = await import("next-auth/react");
        await signOut({ callbackUrl: "/admin/login?error=SessionExpired" });
      }
      return Promise.reject(error);
    }
  );
}

export default axiosInstance;
