import {
  GeistProvider,
  Text,
  Button,
  Spacer,
} from '@geist-ui/core';

export function HomeLayout() {
  return (
    <GeistProvider>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '60px 20px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Text h1 style={{ fontSize: '3rem' }}>
            欢迎来到我的网站
          </Text>
          <Text type="secondary" style={{ fontSize: '1.25rem' }}>
            使用 Rspress + React + Geist UI 构建的现代化文档站点
          </Text>
          <Spacer h={2} />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {/* @ts-expect-error Geist UI types incompatible with React 19 */}
            <Button type="secondary-light" scale={1.2} auto>
              开始阅读
            </Button>
            {/* @ts-expect-error Geist UI types incompatible with React 19 */}
            <Button type="success-light" scale={1.2} auto>
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </GeistProvider>
  );
}
