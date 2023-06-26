import { defineConfig, loadEnv } from "vite";
import dns from "dns";

dns.setDefaultResultOrder("verbatim");

export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    // To access env vars here use process.env.TEST_VAR
    // To access env vars in your application use import.meta.env.VITE_TEST_VAR
    server: {
      host: "192.168.0.156",
      port: 3000,
    },
  });
};
