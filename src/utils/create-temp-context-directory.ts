import path from "node:path";
import { WALLET_CONTEXT_DIR_NAME } from "./constants";

export default async function createTempContextDirectory(testId: string) {
    return path.resolve(process.cwd(), WALLET_CONTEXT_DIR_NAME, testId);
}
