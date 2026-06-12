import {
  siHtml5,
  siMarkdown,
  siOpenapiinitiative,
  siOpenjdk,
  siSpring,
  siSpringboot,
  siSqlite,
  siApachemaven,
  type SimpleIcon,
} from 'simple-icons';

export interface ModuleItem {
  name: string;
  title: string;
  text?: string;
  href: string;
  count?: string;
  icon: SimpleIcon;
}

export const modules: ModuleItem[] = [
  {
    name: 'guide',
    title: 'Guide',
    text: 'Rspress、MDX、文件树与站点使用说明。',
    href: '/guide/start/introduction',
    count: '8 topics',
    icon: siMarkdown,
  },
  {
    name: 'Springboot',
    title: 'Spring Boot',
    text: '入门、请求处理、自动配置、日志、整合与异常处理。',
    href: '/Springboot/入门/1.QuickStart',
    count: '34 notes',
    icon: siSpringboot,
  },
  {
    name: 'JAVA',
    title: 'Java',
    text: '基础语法、集合、泛型、反射、注解、日期与面向对象。',
    href: '/JAVA/1.JAVA运行',
    count: '70+ notes',
    icon: siOpenjdk,
  },
  {
    name: 'web',
    title: 'Web',
    text: '实时通信、文件上传、支付、Quartz、XXL-Job 与短信服务。',
    href: '/web/文件上传/单文件上传',
    count: '22 notes',
    icon: siHtml5,
  },
  {
    name: 'api',
    title: 'API',
    text: '站点命令与 API 参考。',
    href: '/api/',
    count: '2 pages',
    icon: siOpenapiinitiative,
  },
  {
    name: 'Spring',
    title: 'Spring',
    text: 'Spring 容器、AOP、Quartz、XXL-Job、支付与短信服务。',
    href: '/Spring/QuickStart',
    count: '40+ notes',
    icon: siSpring,
  },
  {
    name: '数据库',
    title: '数据库',
    href: '/数据库/Query',
    icon: siSqlite,
  },
  {
    name: 'Maven',
    title: 'Maven',
    href: '/Maven/基础/1.安装与配置',
    icon: siApachemaven,
  },
  {
    name: 'SpringMVC',
    title: 'SpringMVC',
    href: '/SpringMVC/响应设计',
    icon: siSpring,
  },
];
