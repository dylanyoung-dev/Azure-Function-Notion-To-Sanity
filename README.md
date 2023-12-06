[![Deploy - Github Workflow](https://github.com/dylanyoung-dev/Azure-Function-Notion-To-Sanity/actions/workflows/main.yml/badge.svg)](https://github.com/dylanyoung-dev/Azure-Function-Notion-To-Sanity/actions/workflows/main.yml)

# Notion to Sanity Serverless Integration

Using this to setup a database workflow in Notion to automatically publish blog content out to my Sanity Blog, because I hate writing in the Sanity editor.

## Running Locally

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file in the root of the project and add the following variables:

```bash
NOTION_API_KEY=<your-notion-api-key>
NOTION_DATABASE_ID=<your-notion-database-id>
SANITY_PROJECT_ID=<your-sanity-project-id>
SANITY_DATASET=<your-sanity-dataset>
```

4. Make sure you have azure blob service running. I use [Azure Storage Emulator](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-emulator)
5. Run `npm start` to start the local server
6. Then you can manually trigger the function by hitting `http://localhost:7071/api/NotionToSanity` or use your Azure extension, find your function, right click and select `Execute Function Now...`
