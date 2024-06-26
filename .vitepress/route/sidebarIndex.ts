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
                    text: "Base 基础",
                    link: "/docs/interview/java/base",
                },
                {
                    text: "Collect 集合",
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
            text: "Markdown",
            collapsed: true,
            items: [
                {
                    text: "Base 基础",
                    link: "/docs/knowledge/markdown/base",
                },
                {
                    text: "Table 表格",
                    link: "/docs/knowledge/markdown/table",
                },
                {
                    text: "Mermaid 图表",
                    link: "/docs/knowledge/markdown/mermaid",
                },
                {
                    text: "Vitepress 内置扩展语法",
                    link: "/docs/knowledge/markdown/vitepress",
                },
                {
                    text: "Emoji 表情",
                    link: "/docs/knowledge/markdown/emoji",
                },
            ],
        },
        {
            text: "数据库",
            collapsed: true,
            items: [
                {
                    text: "MySQL",
                    collapsed: true,
                    items: [
                        {
                            text: "索引原理",
                            link: "/docs/knowledge/database/mysql/index_principle",
                        },
                        {
                            text: "索引设计原则",
                            link: "/docs/knowledge/database/mysql/index_design_principles",
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
