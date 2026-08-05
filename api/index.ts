import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Express } from 'express';
import type { createApp as CreateAppFn } from '../src/create-app';

// Runtime module resolved from the tsc-alias-rewritten build output, so
// every downstream 'src/...' path alias is a real relative path by the
// time this runs (Vercel's file tracer can't follow bare-specifier
// requires like 'src/x', so raw TS source imports get silently dropped
// from the deployed bundle).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createApp } = require('../dist/src/create-app') as {
    createApp: typeof CreateAppFn;
};

let cachedApp: Express | undefined;

async function getApp(): Promise<Express> {
    if (!cachedApp) {
        const app = await createApp();
        await app.init();
        cachedApp = app.getHttpAdapter().getInstance();
    }
    return cachedApp;
}

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    const expressApp = await getApp();
    expressApp(req as unknown as Parameters<Express>[0], res as unknown as Parameters<Express>[1]);
}
