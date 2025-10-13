// Disable TLS verification for localhost HTTPS in development only.
// This runs in the Node.js (server) environment before route handlers and app pages.

export async function register() {
  if (process.env.NODE_ENV !== "development") return;

  // In development, relax TLS verification to allow self-signed localhost certs.
  // This impacts Node's HTTPS requests (including fetch) in the current process.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}


