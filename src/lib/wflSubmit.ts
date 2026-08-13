/**
 * Shared submit helper for every form on umbrcom.co.il — routes into the
 * "WFL Micro CRM" plugin already installed on admin.umbrcom.co.il (see
 * umbrcom-crm-integration.md, provided directly by Nik). That plugin has
 * two inboxes in wp-admin ("WFL Submissions" and "Umbrcom Submissions");
 * passing `site: "umbrcom"` routes every submission from this storefront
 * into the Umbrcom one specifically, distinct from any other site sharing
 * the same CRM plugin.
 *
 * This replaces the various one-off, per-form patterns that existed
 * before (readdy.ai form endpoints left over from the original template,
 * and mailto: fallbacks other AI tools added as a stopgap when no real
 * endpoint existed yet) — every form on the site should call this instead
 * of rolling its own submission logic.
 *
 * No API key/auth needed — the plugin only accepts requests whose Origin
 * header matches an allowed list (umbrcom.co.il / www.umbrcom.co.il are
 * already on it). See the .md doc for details.
 */

const WFL_SUBMIT_URL = "https://admin.umbrcom.co.il/wp-json/wfl/v1/submit";

export interface WflSubmitResult {
  ok: boolean;
}

/**
 * @param label  Short human-readable name for which form this is — shows
 *               as the subject line in the email notification and in the
 *               admin submissions list (e.g. "Umbrcom Contact Form").
 * @param fields Flat object of string key/value pairs. Whatever keys are
 *               sent are what display in wp-admin and the notification
 *               email — Hebrew field labels are fine and preferred here
 *               since that's what the person reading the inbox expects.
 */
export async function sendUmbrcomForm(
  label: string,
  fields: Record<string, string>
): Promise<WflSubmitResult> {
  try {
    const res = await fetch(WFL_SUBMIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, site: "umbrcom", fields }),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
