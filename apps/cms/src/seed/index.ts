import path from 'path';
import type { Payload } from 'payload';
import { pagesSlug } from '../collections/Pages';
import { mediaSlug } from '../collections/Media';
import { usersSlug } from '../collections/Users';
import home from './home-page.json';
import posts from './posts-page.json';
import type { Page } from 'payload/generated-types';

export const seedPages = async (payload: Payload) => {
    const { totalDocs } = await payload.find({
        collection: pagesSlug,
    });
    if (!totalDocs) {
        const createdMedia = await payload.create({
            collection: mediaSlug,
            data: {
                alt: 'Payload',
            },
            filePath: path.resolve(__dirname, './payload.jpg'),
        });

        const createdPostsPage = await payload.create({
            collection: pagesSlug,
            // payload 1.6.9 have incorrect generated types for rich text
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: posts as any,
        });

        const publicString = JSON.stringify(home)
            .replace(/{{IMAGE_ID}}/g, createdMedia.id)
            .replace(/{{SAMPLE_PAGE_ID}}/g, createdPostsPage.id);

        await payload.create({
            collection: pagesSlug,
            data: JSON.parse(publicString),
        });
        payload.logger.info(`Successfully seeded pages into database`);
    }
};

export const seedUsers = async (payload: Payload) => {
    const { totalDocs } = await payload.find({
        collection: usersSlug,
    });
    if (!totalDocs) {
        payload.create({
            collection: usersSlug,
            data: {
                email: 'dev@payloadcms.com',
                password: 'qwerty',
                name: 'Admin User',
                role: 'admin',
            },
        });
        payload.create({
            collection: usersSlug,
            data: {
                email: 'user@payloadcms.com',
                password: 'qwerty',
                name: 'Frontend User',
                role: 'user',
            },
        });
        payload.logger.info(`Successfully seeded users into database`);
    }
};
