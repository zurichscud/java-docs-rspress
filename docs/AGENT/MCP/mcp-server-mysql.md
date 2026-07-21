# mcp_server_mysql

`mcp_server_mysql` 用于让 Agent 通过 MCP 协议访问 MySQL 数据库。默认配置下建议仅开放只读能力，确认风险后再按需开启写操作。

## 安装

先全局安装服务：

```sh
pnpm add -g @benborla29/mcp-server-mysql
```

## 接入方式

### 使用命令行添加

```sh
claude mcp add \
  --env MYSQL_HOST="127.0.0.1" \
  --env MYSQL_PORT="3306" \
  --env MYSQL_USER="root" \
  --env MYSQL_PASS="your_password" \
  --env MYSQL_DB="your_database" \
  --env ALLOW_INSERT_OPERATION="false" \
  --env ALLOW_UPDATE_OPERATION="false" \
  --env ALLOW_DELETE_OPERATION="false" \
  mcp_server_mysql
  -- npx -y @benborla29/mcp-server-mysql
```

### 使用 JSON 配置

```json
{
  "mcpServers": {
    "mcp_server_mysql": {
      "command": "/path/to/npx/binary/npx",
      "args": ["-y", "@benborla29/mcp-server-mysql"],
      "env": {
        "MYSQL_HOST": "127.0.0.1",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "root",
        "MYSQL_PASS": "",
        "MYSQL_DB": "db_name",
        "ALLOW_INSERT_OPERATION": "false",
        "ALLOW_UPDATE_OPERATION": "false",
        "ALLOW_DELETE_OPERATION": "false"
      }
    }
  }
}
```

添加完成后，可以用下面的命令检查配置是否生效：

```sh
claude mcp get mcp_server_mysql
```

## 配置项

### 基础连接配置

- `MYSQL_HOST`：MySQL 服务地址，默认值为 `127.0.0.1`
- `MYSQL_PORT`：MySQL 服务端口，默认值为 `3306`
- `MYSQL_USER`：MySQL 用户名，默认值为 `root`
- `MYSQL_PASS`：MySQL 密码
- `MYSQL_DB`：默认连接的数据库名；如果需要启用多数据库模式，可留空

### 操作权限配置

- `ALLOW_INSERT_OPERATION`：是否允许执行 `INSERT`，默认值为 `false`
- `ALLOW_UPDATE_OPERATION`：是否允许执行 `UPDATE`，默认值为 `false`
- `ALLOW_DELETE_OPERATION`：是否允许执行 `DELETE`，默认值为 `false`
- `ALLOW_DDL_OPERATION`：是否允许执行 DDL 语句，默认值为 `false`

建议在生产环境中默认关闭所有写操作，仅在明确可控的场景下开启。

## 多数据库模式

如果没有指定 `MYSQL_DB`，`mcp_server_mysql` 可以在当前 MySQL 用户具备权限的多个数据库之间切换。

### 开启方式

将 `MYSQL_DB` 留空即可启用多数据库模式。

在这种模式下，查询时建议显式指定 schema，避免歧义：

```sql
-- 使用全限定表名
SELECT * FROM database_name.table_name;

-- 或先切换数据库再查询
USE database_name;
SELECT * FROM table_name;
```

## 按 Schema 控制权限

如果需要更细粒度的安全控制，可以按 schema 分别配置读写权限。这样不同数据库可以拥有不同的操作级别，例如开发库允许写入、生产库保持只读。

- `SCHEMA_INSERT_PERMISSIONS`：按 schema 配置 `INSERT` 权限
- `SCHEMA_UPDATE_PERMISSIONS`：按 schema 配置 `UPDATE` 权限
- `SCHEMA_DELETE_PERMISSIONS`：按 schema 配置 `DELETE` 权限
- `SCHEMA_DDL_PERMISSIONS`：按 schema 配置 DDL 权限

示例：

```yaml
SCHEMA_INSERT_PERMISSIONS=development:true,test:true,production:false
SCHEMA_UPDATE_PERMISSIONS=development:true,test:true,production:false
SCHEMA_DELETE_PERMISSIONS=development:false,test:true,production:false
SCHEMA_DDL_PERMISSIONS=development:false,test:true,production:false
```

上面的配置表示：

- `development` 库允许插入和更新，但不允许删除和 DDL
- `test` 库允许插入、更新、删除和部分结构变更
- `production` 库禁止所有写操作和 DDL
