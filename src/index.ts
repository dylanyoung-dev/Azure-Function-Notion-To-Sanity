import { AzureFunction, Context } from '@azure/functions';
import { Article } from './common/article';
import { GetNotionItems, UpdateNotionLink } from './services/notion.service';
import { UpdateSanity } from './services/sanity.service';

const trigger: AzureFunction = async (context: Context) => {
    let response: Article[] | null = await GetNotionItems();

    if (response === null) {
        return;
    }

    response.map(async (item) => {
        item = await UpdateSanity(item);

        if (item.sanityId != null) {
            var response = await UpdateNotionLink(item);

            if (response) {
                console.log(`Notion Page of ID: ${item.notionId} updated to sanity Id: ${item.sanityId}`);
            }
        }
    });

    setTimeout(() => {
        console.log('Holding on till Dylan can cancel execution!');
    }, 55000);
};

export default trigger;
