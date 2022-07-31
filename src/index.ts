import { AzureFunction, Context } from '@azure/functions';
import { Client as NotionClient } from '@notionhq/client';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { SanityClient } from '@sanity/client';

const notion = new NotionClient({ auth: process.env["Notion_Client_Key"]})

const trigger: AzureFunction = async (context: Context) => {
    console.log('context', context);

    // Check Notion Database for any updates with a Status of "Scheduled" to pull into Sanity
    let items[] = await getNotionItems();
    

};

const getNotionItems = async () => {
    let response: QueryDatabaseResponse = await notion.databases.query({
        database_id: process.env["NOTION_DATABASE_ID"],
        filter: {
                property: 'Status',
                select: {
                    equals: 'Scheduled'
                }
            }
    })

    return response;
}

const updateSanity = async() => {
    
}

export default trigger;