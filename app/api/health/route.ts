export async function GET() {
  return Response.json({
    service: "blntly-delivery",
    status: "ok",
    version: "1.0.0",
    mode: "prelaunch",
    timestamp: new Date().toISOString(),
  });
}
