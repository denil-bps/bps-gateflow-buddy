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

    await supabaseAdmin.from("audit_logs").insert({
      actor_id: context.userId,
      action: `Created ${data.role} staff account`,
      entity_type: "staff_account",
      metadata: { email: data.email, role: data.role },
    });

    return { email: data.email, role: data.role };
  });

export const listStaffAccounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError || !isAdmin) throw new Error("Only Admin can view staff accounts.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: roleRows, error: rolesError }, { data: usersResult, error: usersError }] = await Promise.all([
      supabaseAdmin.from("user_roles").select("user_id, role").order("role"),
      supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ]);
    if (rolesError || usersError) throw new Error("Staff accounts could not be loaded.");

    const userById = new Map(usersResult.users.map((user) => [user.id, user]));
    return (roleRows ?? []).flatMap((row) => {
      const user = userById.get(row.user_id);
      return user ? [{ id: user.id, email: user.email ?? null, role: row.role, createdAt: user.created_at }] : [];
    });
  });