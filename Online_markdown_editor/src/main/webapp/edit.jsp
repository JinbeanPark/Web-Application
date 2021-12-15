<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<link href="uclaStyle.css" rel="stylesheet" type="text/css">
<html>
<head>
    <meta charset="UTF-8">
    <title>Edit Post</title>
</head>
<body>
    <div><h1>Edit Post</h1></div>
    <%
        String title = request.getParameter("title");
        String body = request.getParameter("body");
    %>
    <form action = "post" method = "GET">
        <div>
            <button type="submit" name = "action" value = "close">Close</button>
            <input type = "hidden" name = "username" value = <%= request.getParameter("username")%>>
            <input type = "hidden" name = "postid" value = <%= request.getParameter("postid")%>>
            <input type = "hidden" name = "title" value = '<c:out value = "<%= title %>"/>'>
            <input type = "hidden" name = "body" value = '<c:out value = "<%= body %>"/>'>
        </div>
    </form>
    <form action = "post" method = "POST">
        <div>
            <button type="submit" name = "action" value = "preview" formmethod = "GET">Preview</button><br>
            <button type="submit" name = "action" value = "save">Save</button><br>
            <button type="submit" name = "action" value = "delete">Delete</button><br><br>
            <input type = "hidden" name = "username" value = <%= request.getParameter("username")%>>
            <input type = "hidden" name = "postid" value = <%= request.getParameter("postid")%>>
        </div>
        <div>
            <label for="title">Title</label><br>
            <input type="text" id="title" name = "title" value = "<c:out value="${not empty title ? title : ''}"/>">
        </div>
        <div>
            <br><label for="body">Body</label><br>
            <textarea style="height: 20rem;" id="body" name = "body"><c:out value="${not empty body ? body : ''}" /></textarea>
        </div>
    </form>
</body>
</html>
