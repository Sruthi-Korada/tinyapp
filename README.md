# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["screenshot description"](#)
!["screenshot description"](#)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-parser (*** changed later into cookie-session because cookie-parser is a middleware which parses cookies attached to the client request object ***)
- cookie-session (***Cookie session is basically used for lightweight session applications where the session data is stored in a cookie but within the client [browser], whereas, Express Session stores just a mere session identifier within a cookie in the client end, whilst storing the session data entirely on the server ***)

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.