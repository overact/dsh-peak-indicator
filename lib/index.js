/**
 * Node-side host half of dsh-peak-indicator plugin.
 * The active functionality lives in lib/client.js (browser bundle loaded via dsh.client).
 */

export const name = 'dsh-peak-indicator'

export function apply(ctx) {
  // Client-focused plugin; host side is a no-op marker.
}

export default { name, apply }
