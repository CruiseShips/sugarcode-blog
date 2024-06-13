const aboutSiteRoute = {
    "/docs/aboutSite": [
        {
            text: "关于站点",
            link: "/docs/aboutSite",
        },
    ],
};

const interviewRoute = {
    "/docs/interview": [
        { text: "写在前面", link: "/docs/interview/readBefore" },
        {
            text: "Java",
            collapsed: true,
            items: [
                {
                    text: "Java-基础",
                    link: "/docs/interview/java/base",
                },
            ],
        },
    ],
};

const caseRoute = {
    "/docs/case": [{ text: "写在前面", link: "/docs/case/readBefore" }],
};

const knowledgeRoute = {
    "/docs/knowledge": [
        { text: "写在前面", link: "/docs/knowledge/readBefore" },
        {
            text: "Markdown",
            collapsed: true,
            items: [
                {
                    text: "Markdown-基础",
                    link: "/docs/knowledge/markdown/base",
                },
            ],
        },
    ],
};

const sidebarRoute = {
    ...aboutSiteRoute,
    ...interviewRoute,
    ...caseRoute,
    ...knowledgeRoute,
};

export default sidebarRoute;
