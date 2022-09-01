import type { NextRequest } from "next/server";
import { MiddlewareRequest } from "@netlify/next";
//import { request } from "http";

export async function middleware(nextRequest: NextRequest) {
  const pathname = nextRequest.nextUrl.pathname;

  const middlewareRequest = new MiddlewareRequest(nextRequest);

  if (pathname.startsWith("/static")) {
    const response = await middlewareRequest.next();

    async function gql(query: String, variables={}) {
      const data = await fetch('https://api.hashnode.com/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              query,
              variables
          })
      });
  
      return data.json();
    }

    const query = `
      query {
        user(username: "Ekeneeze") {
          name
          publication {
            posts {
              title
            }
          }
        }
      }
    `

    const hashnodeData = await gql(query)

    console.log(hashnodeData.data.user.publication.posts[0].title)

    const message = `You're visiting this site from 
                     ${nextRequest?.geo?.city}, 
                     ${nextRequest?.geo?.country}. I know where you live now, lock your doors`;

    const head = hashnodeData.data.user.publication.posts[0].title

    response.replaceText("#message", message);
    response.setPageProp("message", message);
    response.setPageProp("title", head)
    response.setPageProp("content", head)
    response.rewriteHTML("meta[name=next-head-count]", {
      element(elemChunk) {
        if (elemChunk) {
          elemChunk.setAttribute('description', head);
        }
      },
    });

    console.log(response);
    console.log(nextRequest.headers)

    return response;
  }
}