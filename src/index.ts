import { AzureFunction, Context } from '@azure/functions';
import { Article } from './common/article';
import { GetNotionItems, UpdateNotionLink } from './services/notion.service';
import { UpdateSanity } from './services/sanity.service';

const trigger: AzureFunction = async (context: Context) => {
    context.log('hello');
    let response: Article[] | null = await GetNotionItems(context);

    if (response === null) {
        return;
    }

    context.log(response);

    response.map(async (item) => {
        item = await UpdateSanity(item, context);

        if (item.sanityId != null) {
            var response = await UpdateNotionLink(item);

            if (response) {
                console.log(`Notion Page of ID: ${item.notionId} updated to sanity Id: ${item.sanityId}`);
            }
        }
    });
};

export default trigger;
