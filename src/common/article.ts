interface Article {
    title: string;
    excerpt: string;
    publishDate: Date;
    bodyContent: string;
    slug: string;
    mainImage: string;
    landscapeImage: string;
    notionId: string;
    sanityId?: string;
}

export type { Article };
