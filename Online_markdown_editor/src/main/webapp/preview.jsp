<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<link href="uclaStyle.css" rel="stylesheet" type="text/css">

<html>
<head>
    <meta charset="UTF-8">
</head>
<body>
    <form action = "post" method = "GET">
        <div>
            <button type="submit" name = "action" value = "open">Close Preview</button>
        </div>
        <%
            String title = request.getParameter("title");
            String body = request.getParameter("body");
        %>
        <div>
            <h1>${parRenTitle}</h1>
            <input type = "hidden" name = "username" value = <%= request.getParameter("username")%>>
            <input type = "hidden" name = "postid" value = <%= request.getParameter("postid")%>>
            <input type = "hidden" name = "title" value = '<c:out value = "<%= title %>"/>'>
            <input type = "hidden" name = "body" value = '<c:out value = "<%= body %>"/>'>
        </div>
    </form>
    <div>
        <h1>${parRenBody}</h1>
    </div>
</body>
</html>
