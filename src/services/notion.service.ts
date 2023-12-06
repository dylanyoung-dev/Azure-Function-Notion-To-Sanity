import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { Client } from '@notionhq/client';
import { Article } from '../common/article';
import { NotionToMarkdown } from 'notion-to-md';
import { Context } from '@azure/functions';

const client = new Client({
    auth: process.env['Notion_Client_Key'],
    notionVersion: '2022-02-22',
});

const notionBodyClient = new NotionToMarkdown({ notionClient: client });

const GetNotionItems = async (context: Context): Promise<Article[] | null> => {
    let response: QueryDatabaseResponse = await client.databases.query({
        database_id: process.env['Notion_Database_Id'],
        filter: {
            and: [
                {
                    property: 'Workflow',
                    select: {
                        equals: 'Scheduled',
                    },
                },
                {
                    property: 'Publish Date',
                    date: {
                        is_not_empty: true,
                    },
                },
                {
                    property: 'Sanity Id',
                    rich_text: {
                        is_empty: true,
                    },
                },
            ],
        },
    });

    context.log(response);

    if (response?.results != null) {
        return await Promise.all(
            response.results
                .filter((item) => item.object == 'page')
                .map((item) => {
                    return ConvertToArticle(item);
                })
        );
    }

    return null;
};

const ConvertToArticle = async (item: any): Promise<Article> => {
    // TODO: Add proper error checking

    let article: Article = {
        title: item.properties.Title?.title[0]?.plain_text,
        excerpt: item.properties.Excerpt?.rich_text[0]?.text?.content,
        publishDate: new Date(item.properties['Publish Date']?.date?.start),
        slug: item.properties.Slug?.rich_text[0]?.text?.content,
        notionId: item.id,
        mainImage: item.properties['Main Image (500x260)']?.rich_text[0]?.text?.content,
        landscapeImage: item.properties['Landscape Image (1280 x 720)']?.rich_text[0]?.text?.content,
        bodyContent: await GenerateBodyContent(item),
    };

    console.log('Conversion Successfull');

    return article;
};

const GenerateBodyContent = async (item: any): Promise<string> => {
    if (item.id == null) {
        return '';
    }

    let mdBlocks = await notionBodyClient.pageToMarkdown(item.id);

    return notionBodyClient.toMarkdownString(mdBlocks);
};

const UpdateNotionLink = async (article: Article): Promise<boolean> => {
    let response = await client.pages.update({
        page_id: article.notionId,
        properties: {
            'Sanity Id': {
                type: 'rich_text',
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: article.sanityId,
                        },
                    },
                ],
            },
        },
    });

    if (response != null && response.id) {
        return true;
    }

    return false;
};

export { UpdateNotionLink, GetNotionItems };
