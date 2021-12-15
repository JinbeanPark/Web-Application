<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<%@ page import="java.sql.*" %>
<%@ page import="java.io.IOException" %>
<%@ page import="com.mysql.*" %>
<link href="uclaStyle.css" rel="stylesheet" type="text/css">


<html>
<head>
    <meta charset="UTF-8">
    <%
        String refreshURL = "URL=http://localhost:8888/editor/post?action=list&username=" + request.getParameter("username");
    %>
    <meta http-equiv="Refresh" content="2; <%=refreshURL %>">
    <title>Posts</title>
</head>
<body>
    <div><h1>Posts</h1></div>
    <form action = "post" method = "GET">
            <div>
                <button type="submit" name = "action" value = "open">New Post</button>
                <input type = "hidden" name = "username" value = <%= request.getParameter("username")%>>
                <input type = "hidden" name = "postid" value = "0">
            </div>
    </form>
    <div align="center">
        <table border="1" cellpadding="8">
            <caption><h2>List of <%= request.getParameter("username") %> posts</h2></caption>
            <tr>
                <th>Title</th>
                <th>Created</th>
                <th>Modified</th>
                <th>Open</th>
                <th>Delete</th>
            </tr>
            <%
                Connection c = null;
                PreparedStatement ps = null;
                ResultSet rs = null;

                try {
                    c = DriverManager.getConnection("jdbc:mariadb://localhost:3306/CS144", "cs144", "");
                    ps = c.prepareStatement("SELECT * FROM Posts WHERE username = ?");
                    ps.setString(1, request.getParameter("username"));
                    rs = ps.executeQuery();

                    SQLWarning warn = ps.getWarnings();
                    if (warn != null) System.out.println("Message: " + warn.getMessage());
                    SQLWarning warning = rs.getWarnings();
                    if (warning != null) System.out.println("Message: " + warning.getMessage());

                    while (rs.next()) { %>
                        <tr>
                            <td><%= rs.getString("title") %></td>
                            <td><%= rs.getString("created") %></td>
                            <td><%= rs.getString("modified") %></td>
                            <%
                                String title = rs.getString("title");
                                String body = rs.getString("body");
                            %>
                            <form action = "post" method = "GET">
                            <input type = "hidden" name = "username" value = <%= request.getParameter("username")%>>
                            <input type = "hidden" name = "postid" value = <%= rs.getInt("postid")%>>
                            <input type = "hidden" name = "title" value = '<c:out value = "<%= title %>"/>'>
                            <input type = "hidden" name = "body" value = '<c:out value = "<%= body %>"/>'>
                            <td><button type="submit" name = "action" value = "open">Open</button></td>
                            </form>
                            <form action = "post" method = "POST">
                            <input type = "hidden" name = "username" value = <%= request.getParameter("username")%>>
                            <input type = "hidden" name = "postid" value = <%= rs.getInt("postid")%>>
                            <td><button type="submit" name = "action" value = "delete">Delete</button></td>
                            </form>
                        </tr>
                    <% }
                } catch (SQLException ex) {
                    System.out.println("SQLException caught");
                    System.out.println("---");
                    while (ex != null) {
                        System.out.println("Message   : " + ex.getMessage());
                        System.out.println("SQLState  : " + ex.getSQLState());
                        System.out.println("ErrorCode : " + ex.getErrorCode());
                        System.out.println("---");
                        ex = ex.getNextException();
                    }
                } finally {
                    try { rs.close(); } catch (Exception e) { /* ignored */ }
                    try { ps.close(); } catch (Exception e) { /* ignored */ }
                    try { c.close(); } catch (Exception e) { /* ignored */ }
                 } %>
        </table>
    </div>
</body>
</html>