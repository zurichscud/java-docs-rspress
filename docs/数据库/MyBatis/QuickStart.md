# QuickStart

## Interface

```java
public interface MonsterMapper {
    public void addMonster(Monster monster);

    public void deleteMonster(Integer id);

    public void updateMonster(Monster monster);
    
    public List<Monster> findAllMonster();

}
```



## XML

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.lai.mapper.MonsterMapper" >

    <delete id="deleteMonster" parameterType="Integer">
        delete from monster where id=#{id}
    </delete>

</mapper>
```



## mybatis-config

```xml
<?xml version="1.0" encoding="UTF-8" ?>  
<!DOCTYPE configuration  
PUBLIC "-//mybatis.org//DTD Config 3.0//EN"  
"http://mybatis.org/dtd/mybatis-3-config.dtd">  
<configuration>  
  <!--设置连接数据库的环境-->  
  <environments default="development">  
    <environment id="development">  
      <transactionManager type="JDBC"/>  
      <dataSource type="POOLED">  
        <property name="driver" value="com.mysql.cj.jdbc.Driver"/>  
        <property name="url" value="jdbc:mysql://localhost:3306/MyBatis"/>  
        <property name="username" value="root"/>  
        <property name="password" value="123456"/>  
      </dataSource>  
    </environment>  
  </environments>  
  <!--引入映射文件-->  
  <mappers>  
    <mapper resource="mappers/UserMapper.xml"/>  
  </mappers>  
</configuration>
```

