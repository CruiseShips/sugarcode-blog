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
                {
                    text: "Design Pattern 设计模式",
                    link: "/docs/interview/java/design_pattern",
                },
                {
                    text: "Thread 线程",
                    link: "/docs/interview/java/thread",
                },
                {
                    text: "JVM",
                    link: "/docs/interview/java/jvm",
                },
            ],
        },
    ],
};

const caseRoute = {
    "/docs/case": [
        { text: "写在前面", link: "/docs/case/readBefore" },
        {
            text: "King Password",
            link: "/docs/case/kingpassword/readme",
        },
    ],
};

const knowledgeRoute = {
    "/docs/knowledge": [
        { text: "写在前面", link: "/docs/knowledge/readBefore" },
        {
            text: "Java",
            collapsed: true,
            items: [
                {
                    text: "关键字",
                    collapsed: true,
                    items: [
                        {
                            text: "synchronized",
                            link: "/docs/knowledge/java/keyword/synchronized",
                        },
                    ],
                },
                {
                    text: "类",
                    collapsed: true,
                    items: [
                        {
                            text: "Executors",
                            link: "/docs/knowledge/java/class/executors",
                        },
                        {
                            text: "Callable & Future & FutureTask",
                            link: "/docs/knowledge/java/class/callable_future_futureTask",
                        },
                        {
                            text: "CompleteFuture",
                            link: "/docs/knowledge/java/class/completeFuture",
                        },
                        {
                            text: "ForkJoinPool",
                            link: "/docs/knowledge/java/class/forkJoinPool",
                        },
                    ],
                },
                {
                    text: "架构",
                    collapsed: true,
                    items: [
                        {
                            text: "AOT",
                            link: "/docs/knowledge/java/architecture/aot",
                        },
                    ],
                },
                {
                    text: "构建组件",
                    collapsed: true,
                    items: [
                        {
                            text: "配置加密 - Properties Secret",
                            link: "/docs/knowledge/java/buildingBlocks/properties_secret",
                        },
                        {
                            text: "单体缓存 - ExpiringMap",
                            link: "/docs/knowledge/java/buildingBlocks/expiringMap",
                        },
                        {
                            text: "重试 - Retry",
                            link: "/docs/knowledge/java/buildingBlocks/retry",
                        },
                        {
                            text: "验证码 - captcha",
                            link: "/docs/knowledge/java/buildingBlocks/captcha",
                        },
                    ],
                },
            ],
        },
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
