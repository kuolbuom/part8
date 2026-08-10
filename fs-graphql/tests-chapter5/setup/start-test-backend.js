const { spawn } = require("child_process");
const path = require("path");
const { MongoMemoryServer } = require("mongodb-memory-server");

const start = async () => {
  console.log("Starting MongoMemoryServer...");

  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  console.log("MongoDB URI:", uri);

  const backendDir = path.resolve(__dirname, "../../library-backend");

  console.log("Backend directory:", backendDir);
  console.log("Starting backend on port 4000...");

  const serverProcess = spawn("node", ["index.js"], {
    cwd: backendDir,
    env: {
      ...process.env,
      NODE_ENV: "test",
      MONGODB_URI: uri,
      JWT_SECRET: "test-secret-key",
      PORT: "4000",
    },
    stdio: ["pipe", "pipe", "pipe"],
  });

  serverProcess.stdout.on("data", (data) => {
    console.log(`[BACKEND] ${data.toString()}`);
  });

  serverProcess.stderr.on("data", (data) => {
    console.error(`[BACKEND ERROR] ${data.toString()}`);
  });

  serverProcess.on("error", (error) => {
    console.error("[BACKEND PROCESS ERROR]", error);
  });

  serverProcess.on("exit", (code, signal) => {
    console.error(`[BACKEND EXITED] code=${code}, signal=${signal}`);
  });

  process.on("SIGTERM", async () => {
    serverProcess.kill();
    await mongoServer.stop();
  });

  process.on("SIGINT", async () => {
    serverProcess.kill();
    await mongoServer.stop();
  });
};

start().catch((error) => {
  console.error("[START TEST BACKEND ERROR]", error);
  process.exit(1);
});
