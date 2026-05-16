import path from "node:path";
import type { CLIOptions } from "@/types";
import { CACHE_DIR_NAME } from "./constants";

export default function getCacheDirectory(walletName: CLIOptions) {
    return path.resolve(process.cwd(), CACHE_DIR_NAME, walletName);
}
