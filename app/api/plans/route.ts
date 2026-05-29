import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { error, data } = await supabase
      .from("plans")
      .select("*")
      .order("price")

    if (error) throw new Error(error.message);

    const plans = data.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      priceId: p.price_id,
      maxAIRuns: p.max_ai_runs,
      maxUploads: p.max_uploads,
      maxMembers: p.max_members,
    }));
    return Response.json({ data: plans });
  } catch (error) {
    console.error("Error fetching plans", error)
    return Response.json({ error: "Error fetching plans" });
  }
}