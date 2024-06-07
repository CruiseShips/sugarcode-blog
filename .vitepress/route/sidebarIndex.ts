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
                {
                    text: "Java-集合",
                    link: "/docs/interview/java/collect",
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
            text: "数据库",
            items: [
                {
                    text: "MySQL",
                    collapsed: true,
                    items: [
                        {
                            text: "测试",
                            link: "/docs/knowledge/database/mysql/test",
                        },
                    ],
                },
                {
                    text: "Redis",
                    items: [
                        {
                            text: "测试",
                            link: "/docs/knowledge/database/redis/test",
                        },
                    ],
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
