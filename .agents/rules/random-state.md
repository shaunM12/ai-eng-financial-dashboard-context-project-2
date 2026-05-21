# Rule: Random State Management

## Scope
All backend code using random number generation.

## Standard
- Avoid global `random.seed()` in request-handling code.
- Use local `random.Random(seed)` instances for deterministic data.

## Rationale
Global random state can cause unpredictable results in concurrent or multi-user environments. Local RNGs are safer and more testable.