import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const staffAccountInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin", "gate_system"]),
});

export const createStaffAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((value) => staffAccountInput.parse(value))
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError || !isAdmin) throw new Error("Only Admin can create staff accounts.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (createError || !created.user) throw new Error(createError?.message ?? "Could not create the staff account.");

    const { error: roleInsertError } = await supabaseAdmin.from("user_roles").insert({ user_id: created.user.id, role: data.role });
    if (roleInsertError) {
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      throw new Error("The account could not be assigned a GateFlow role.");
    }

    return { email: data.email, role: data.role };
  });