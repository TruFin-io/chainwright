#!/usr/bin/env -S node --import tsx
declare function clientEntry(): Promise<void>;

export { clientEntry };
