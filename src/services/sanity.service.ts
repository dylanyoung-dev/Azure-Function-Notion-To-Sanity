import SanityClient, { SanityDocument } from '@sanity/client';
import { Article } from '../common/article';

const client = SanityClient({
    projectId: process.env['Sanity_Project_Id'],
    dataset: process.env['Sanity_Project_Dataset'],
    token: process.env['Sanity_Token'], // we need this to get write access
    useCdn: false, // We can't use the CDN for writing
    apiVersion: '2021-10-21',
});

const UpdateSanity = async (article: Article): Promise<Article> => {
    let response: SanityDocument = await client.create({
        _type: 'post',
        title: article.title,
        excerpt: article.excerpt,
        body: article.bodyContent,
        mainImage: {
            _type: 'image',
            asset: {
                _ref: `image-${article.mainImage}-500x260-jpg`,
                _type: 'reference',
            },
        },
        landscapeImage: {
            _type: 'image',
            asset: {
                _ref: `image-${article.landscapeImage}-1280x720-jpg`,
                _type: 'reference',
            },
        },
        slug: {
            _type: 'slug',
            current: article.slug,
        },
        publishedAt: article.publishDate.toISOString,
        notionitemdatabaseid: article.notionId,
    });

    if (response != null) {
        article.sanityId = response._id;

        return article;
    }

    return null;
};

export { UpdateSanity };
