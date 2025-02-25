import { CONTACT_URL, SIGNUP_URL, ANNUAL_DISCOUNT } from "./lib/constants";
export { CONTACT_URL, SIGNUP_URL, ANNUAL_DISCOUNT };

// Import and re-export the calculatePrice function
import { calculatePrice } from "./lib/calculate-price";
export { calculatePrice };

// Import and re-export the pricingTiers
import { pricingTiers } from "./lib/pricing-data";
export { pricingTiers };

// Alternatively, you can use this more concise syntax:
// export { CONTACT_URL, SIGNUP_URL, ANNUAL_DISCOUNT } from './lib/constants'
// export { calculatePrice } from './lib/calculate-price'
// export { pricingTiers } from './lib/pricing-data'
