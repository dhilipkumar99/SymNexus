// Fixed-window attempt counters held in memory. One gateway instance is the
// supported topology; with several, each would count separately (put a shared
// limit at the load balancer in that case).

export class RateLimiter {
	constructor({ limit, windowMs, now = () => Date.now() }) {
		this.limit = limit;
		this.windowMs = windowMs;
		this.now = now;
		this.buckets = new Map();
	}

	#bucket(key) {
		const t = this.now();
		let b = this.buckets.get(key);
		if (!b || t >= b.resetAt) {
			b = { count: 0, resetAt: t + this.windowMs };
			this.buckets.set(key, b);
		}
		return b;
	}

	// Seconds until the key may try again, or 0 if it is not blocked.
	blockedFor(key) {
		const b = this.#bucket(key);
		return b.count >= this.limit ? Math.ceil((b.resetAt - this.now()) / 1000) : 0;
	}

	hit(key) {
		this.#bucket(key).count++;
	}

	reset(key) {
		this.buckets.delete(key);
	}

	sweep() {
		const t = this.now();
		for (const [key, b] of this.buckets) if (t >= b.resetAt) this.buckets.delete(key);
	}
}
