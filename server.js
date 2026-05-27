import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route to inspect integration configuration status
app.get("/api/integration-status", (req, res) => {
  res.json({
    supabaseConfigured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    supabaseUrl: process.env.SUPABASE_URL || "",
    supabaseTableName: process.env.SUPABASE_TABLE_NAME || "bookings",
    n8nConfigured: !(!process.env.N8N_WEBHOOK_URL),
    n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || "",
  });
});

// Secure backend proxy for Supabase bookings
app.get("/api/supabase/bookings", async (req, res) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const tableName = process.env.SUPABASE_TABLE_NAME || "bookings";

  if (!supabaseUrl || !supabaseKey) {
    return res.status(404).json({
      error: "Supabase integration not configured in backend environment variables.",
      configured: false
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Try querying ordered; fallback to unordered if missing column or error
    let queryResult = await supabase
      .from(tableName)
      .select("*")
      .order("created_at", { ascending: false });

    if (queryResult.error) {
      console.warn("Ordered backend query failed, attempting simple select:", queryResult.error);
      queryResult = await supabase.from(tableName).select("*");
    }

    if (queryResult.error) {
      throw new Error(queryResult.error.message);
    }

    return res.json({
      success: true,
      data: queryResult.data || []
    });
  } catch (err) {
    console.error("Backend Supabase Fetch Error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to fetch from backend Supabase."
    });
  }
});

// Secure backend proxy for n8n Webhook triggering
app.post("/api/n8n/trigger", async (req, res) => {
  const n8nUrl = process.env.N8N_WEBHOOK_URL;
  const payload = req.body;

  const responseLogs = [];
  const timestamp = new Date().toISOString().substring(11, 19);
  
  responseLogs.push(`[${timestamp}] 🔌 Initiating backend integration pipeline link...`);

  if (!n8nUrl) {
    // Graceful backend simulator fallback so the application works fine even before user adds custom secrets
    responseLogs.push(`[${timestamp}] ℹ️ No backend N8N_WEBHOOK_URL configured.`);
    responseLogs.push(`[${timestamp}] 🧪 Activating ChatFlux backend pipeline simulator mode (Sandbox)...`);
    
    // Auto-parse message details purely in backend to mimic advanced AI brain extractor node
    const messageContent = payload.message_content || "";
    let parsedName = "Extracted Client";
    const nameMatch = messageContent.match(/(?:for|named|is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
    if (nameMatch && nameMatch[1]) {
      parsedName = nameMatch[1];
    } else {
      const dbMatch = messageContent.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)/);
      if (dbMatch && dbMatch[1] && !messageContent.startsWith(dbMatch[1])) {
        parsedName = dbMatch[1];
      }
    }

    let parsedPhone = payload.sender_phone || "+39 333 456 7891";
    let parsedDate = new Date().toISOString().split('T')[0];
    if (messageContent.toLowerCase().includes("tomorrow")) {
      const tmr = new Date();
      tmr.setDate(tmr.getDate() + 1);
      parsedDate = tmr.toISOString().split('T')[0];
    }

    let parsedTime = "10:15 AM";
    const timeMatch = messageContent.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))/i);
    if (timeMatch && timeMatch[1]) {
      parsedTime = timeMatch[1].toUpperCase();
    }

    const mockData = {
      id: "n8n-" + Math.floor(Math.random() * 90000 + 10000),
      name: parsedName,
      phone: parsedPhone,
      time: `${parsedDate} ${parsedTime}`.trim(),
      status: "Pending",
      platform: payload.incoming_platform || "whatsapp",
      notes: `✨ Securely Processed via Backend Simulator: "${messageContent}"`,
      customer_name: parsedName,
      customer_phone: parsedPhone,
      booking_date: parsedDate,
      booking_time: parsedTime,
      booking_status: "Pending"
    };

    responseLogs.push(`[${new Date().toISOString().substring(11, 19)}] 📡 Backend Step 1: Simulated LLM agent core extracted details successfully.`);
    responseLogs.push(`[${new Date().toISOString().substring(11, 19)}] ✨ data: { name: "${parsedName}", phone: "${parsedPhone}", appointment: "${parsedDate} ${parsedTime}" }`);
    responseLogs.push(`[${new Date().toISOString().substring(11, 19)}] 💾 Backend Step 2: Created local sandbox booking record.`);

    return res.json({
      success: true,
      isSimulated: true,
      logs: responseLogs,
      data: mockData
    });
  }

  // Real POST to n8n Webhook executed securely in server backend to bypass all CORS / Client restrictions
  try {
    responseLogs.push(`[${timestamp}] 📡 Server posting parameters safely to n8n webhook: ${n8nUrl}`);
    responseLogs.push(`[${timestamp}] 📁 Formatted secure JSON payload generated.`);

    const response = await fetch(n8nUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const textResponse = await response.text();
    responseLogs.push(`[${new Date().toISOString().substring(11, 19)}] 📥 Received HTTP ${response.status} from live backend n8n server node.`);
    responseLogs.push(`[${new Date().toISOString().substring(11, 19)}] 💬 Server Response Body: ${textResponse.substring(0, 150)}`);

    // Parse extracted booking client node if returned
    let finalBooking = null;
    try {
      const parsedBody = JSON.parse(textResponse);
      if (parsedBody && (parsedBody.name || parsedBody.customer_name)) {
        const nameVal = parsedBody.name || parsedBody.customer_name;
        const phoneVal = parsedBody.phone || parsedBody.customer_phone || payload.sender_phone;
        const dateVal = parsedBody.date || parsedBody.booking_date || new Date().toISOString().split('T')[0];
        const timeVal = parsedBody.time || parsedBody.booking_time || "11:00 AM";

        finalBooking = {
          id: parsedBody.id || "n8n-live-" + Math.floor(Math.random() * 10000),
          name: nameVal,
          phone: phoneVal,
          time: `${dateVal} ${timeVal}`.trim(),
          status: parsedBody.status || "Pending",
          platform: payload.incoming_platform || "whatsapp",
          notes: parsedBody.notes || `✨ Dynamic lead received real-time from backend n8n workflow.`,
          customer_name: nameVal,
          customer_phone: phoneVal,
          booking_date: dateVal,
          booking_time: timeVal,
          booking_status: parsedBody.status || "Pending"
        };
      }
    } catch (e) {
      console.warn("Could not parse n8n response body as JSON:", e);
    }

    // Default response mapping if n8n returned success but didn't output structured booking record
    if (!finalBooking && response.ok) {
      const messageContent = payload.message_content || "";
      const parsedName = "Automated Lead";
      const parsedPhone = payload.sender_phone || "+39 333 456 7891";
      const parsedDate = new Date().toISOString().split('T')[0];
      const parsedTime = "11:00 AM";

      finalBooking = {
        id: "n8n-live-" + Math.floor(Math.random() * 10000),
        name: parsedName,
        phone: parsedPhone,
        time: `${parsedDate} ${parsedTime}`.trim(),
        status: "Pending",
        platform: payload.incoming_platform || "whatsapp",
        notes: `✨ Backend webhook triggered. Sent query: "${messageContent.substring(0, 40)}..."`,
        customer_name: parsedName,
        customer_phone: parsedPhone,
        booking_date: parsedDate,
        booking_time: parsedTime,
        booking_status: "Pending"
      };
    }

    responseLogs.push(`[${new Date().toISOString().substring(11, 19)}] ✅ Backend workflow complete!`);

    return res.json({
      success: response.ok,
      logs: responseLogs,
      data: finalBooking
    });
  } catch (err) {
    console.error("Backend n8n Trigger Error:", err);
    responseLogs.push(`[${new Date().toISOString().substring(11, 19)}] ⚠️ Network Error contacting live n8n node: ${err.message}`);
    return res.status(500).json({
      success: false,
      logs: responseLogs,
      error: err.message || "Failed to trigger live backend n8n workflow."
    });
  }
});

// Configure Vite middleware in development or static asset serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode (Vite Middleware)...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode (Static Serving)...");
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
