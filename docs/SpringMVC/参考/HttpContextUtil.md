# HttpContextUtil

使用 RequestContextHolder避免api侵入式设计

```java
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Arrays;

public class HttpContextUtil {

    /**
     * 获取当前请求对象 Request
     */
    public static HttpServletRequest getRequest() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attributes != null ? attributes.getRequest() : null;
    }

    /**
     * 获取当前响应对象 Response
     */
    public static HttpServletResponse getResponse() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attributes != null ? attributes.getResponse() : null;
    }

    /**
     * 便捷获取请求头
     */
    public static String getHeader(String headerName) {
        HttpServletRequest request = getRequest();
        return request != null ? request.getHeader(headerName) : null;
    }

    // ==================== 🍪 Cookie 查询方法 ====================

    /**
     * 根据名称获取具体的 Cookie 对象
     */
    public static Cookie getCookie(String name) {
        HttpServletRequest request = getRequest();
        if (request == null || request.getCookies() == null) {
            return null;
        }
        return Arrays.stream(request.getCookies())
                .filter(cookie -> cookie.getName().equals(name))
                .findFirst()
                .orElse(null);
    }

    /**
     * 快捷获取指定 Cookie 的值
     */
    public static String getCookieValue(String name) {
        Cookie cookie = getCookie(name);
        return cookie != null ? cookie.getValue() : null;
    }

    // ==================== 🚀 新增：Cookie 设置与删除方法 ====================

    /**
     * 快捷设置 Cookie（基础原生版）
     * @param name   键
     * @param value  值
     * @param maxAge 存活时间（秒，例如 3600 为一小时；-1 为会话级，关闭浏览器失效）
     */
    public static void setCookie(String name, String value, int maxAge) {
        HttpServletResponse response = getResponse();
        if (response != null) {
            Cookie cookie = new Cookie(name, value);
            cookie.setPath("/");          // 全站有效
            cookie.setMaxAge(maxAge);
            cookie.setHttpOnly(true);     // 防 XSS 攻击，前端 JS 无法读取
            response.addCookie(cookie);
        }
    }

    /**
     * 快捷设置高级 Cookie（Spring 推荐版：解决前后端分离跨域 SameSite 问题）
     * @param name     键
     * @param value    值
     * @param maxAge   存活时间（秒）
     * @param sameSite 跨域策略（可选 "Lax", "Strict", "None"）
     * 注意：如果设为 "None"，secure 必须为 true（即接口必须是 https 协议）
     */
    public static void setResponseCookie(String name, String value, int maxAge, String sameSite) {
        HttpServletResponse response = getResponse();
        if (response != null) {
            ResponseCookie responseCookie = ResponseCookie.from(name, value)
                    .path("/")
                    .maxAge(maxAge)
                    .httpOnly(true)
                    .secure("None".equalsIgnoreCase(sameSite)) // SameSite=None 时必须开启 Secure
                    .sameSite(sameSite)
                    .build();
            // 注意：这里是往 Header 里追加 Set-Cookie
            response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
        }
    }

    /**
     * 删除指定的 Cookie
     */
    public static void deleteCookie(String name) {
        // 将 maxAge 设为 0，且 value 设为空字符串，浏览器收到后会自动立刻删除该 Cookie
        setCookie(name, "", 0);
    }

    // ==================== 💾 Session 相关方法 ====================

    public static HttpSession getSession(boolean create) {
        HttpServletRequest request = getRequest();
        return request != null ? request.getSession(create) : null;
    }

    public static HttpSession getSession() {
        return getSession(false);
    }

    public static Object getSessionAttribute(String attributeName) {
        HttpSession session = getSession(false);
        return session != null ? session.getAttribute(attributeName) : null;
    }

    public static void setSessionAttribute(String attributeName, Object value) {
        HttpSession session = getSession(true);
        if (session != null) {
            session.setAttribute(attributeName, value);
        }
    }
}
```
