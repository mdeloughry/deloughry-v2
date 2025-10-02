import { Recipe as CookRecipe } from 'cooklang';

export type ParsedIngredient = {
	name: string;
	quantity?: number;
	unit?: string | null;
	optional?: boolean;
};

export type ParsedTimer = { label?: string | null; seconds: number };

export type ParsedStep = {
	text: string;
	timers: ParsedTimer[];
};

export type ParsedRecipe = {
	slug: string;
	title: string;
	description: string | undefined;
	tags: string[];
	servings: number | undefined;
	ingredients: ParsedIngredient[];
	utensils: string[];
	steps: ParsedStep[];
	source: string | null | undefined;
	image: string | null | undefined;
};

export function parseCook(slug: string, raw: string): ParsedRecipe {
	const r = new CookRecipe(raw);

	const metaObj: Record<string, string> = {};
	for (const m of r.metadata ?? []) {
		if (m?.key) metaObj[m.key] = String(m.value ?? '').trim();
	}
	const title = metaObj.title || slug;
	const servings = metaObj.servings ? Number(metaObj.servings) : undefined;
	const tags = (metaObj.tags || '')
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean);

  // First map raw ingredients
  const rawIngredients: ParsedIngredient[] = (r.ingredients || []).map((i: any) => {
    const result: ParsedIngredient = {
      name: i.name || '',
      optional: false
    };

    if (typeof i.quantity === 'number') {
      (result as any).quantity = i.quantity;
    }
    if (i.units && i.units.trim()) {
      (result as any).unit = i.units.trim();
    }

    return result;
  });

  // Aggregate by normalised name + unit to ensure uniqueness and correct totals
  const ingredientTotals = new Map<string, ParsedIngredient>();
  for (const ing of rawIngredients) {
    const unit = (ing.unit || '').trim().toLowerCase();
    const nameKey = (ing.name || '').trim().toLowerCase();
    const key = `${nameKey}::${unit}`;

    const existing = ingredientTotals.get(key);
    if (!existing) {
      ingredientTotals.set(key, { ...ing });
    } else {
      const q1 = typeof existing.quantity === 'number' ? existing.quantity : 0;
      const q2 = typeof ing.quantity === 'number' ? ing.quantity : 0;
      const total = q1 + q2;
      const merged: ParsedIngredient = { ...existing };
      if (total !== 0) {
        merged.quantity = total;
      } else {
        delete (merged as any).quantity;
      }
      ingredientTotals.set(key, merged);
    }
  }

  const ingredients: ParsedIngredient[] = Array.from(ingredientTotals.values());

	// Normalise cookware so multi-word utensils are preserved (e.g. "baking tray")
	// Prefer quoted raw names if present, otherwise fall back to name with dashes as spaces
	const normaliseCookware = (c: any): string => {
		const rawToken = (c?.raw || '').toString();
		if (rawToken.includes('"')) {
			const match = rawToken.match(/"([^"]+)"/);
			if (match && match[1]) return match[1].trim();
		}
		const name = (c?.name || '').toString();
		return name.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
	};

	const utensils: string[] = Array.from(
		new Set(
			(r.cookware || [])
				.map((c: any) => normaliseCookware(c))
				.filter((u: string) => u.length > 0)
		)
	);

	const steps: ParsedStep[] = (r.steps || []).map((s: any) => {
		// Build text from parsed tokens, handling ingredients, cookware, and timers
		const text = Array.isArray(s.line)
			? s.line
					.map((token: any) => {
						if (typeof token === 'string') {
							return token;
						} else if (token && typeof token === 'object') {
							// Handle ingredients, cookware, and timers
							if (token.name !== undefined) {
								// Ingredient or cookware
								return token.name;
							} else if (token.raw && token.raw.startsWith('~')) {
								// Timer - show duration and unit
								const duration = token.quantity || token.amount;
								const unit = token.units || 'minutes';
								return `${duration}${unit}`;
							}
						}
						return '';
					})
					.join('')
					.trim()
			: String(s.raw || '').trim();

		// Extract timers from the parsed line
		const timers: ParsedTimer[] = [];
		if (Array.isArray(s.line)) {
			for (const token of s.line) {
				if (token && typeof token === 'object' && token.raw && token.raw.startsWith('~')) {
					// This is a timer
					const name = token.name || null;
					const seconds = token.seconds || 0;
					timers.push({ label: name, seconds });
				}
			}
		}

		return { text, timers };
	});

	return {
		slug,
		title,
		description: metaObj.description ? String(metaObj.description) : undefined,
		tags,
		servings,
		ingredients,
		utensils,
		steps,
		source: metaObj.source ? String(metaObj.source) : null,
		image: metaObj.image ? String(metaObj.image) : null,
	};
}


